import { addMinutes } from "date-fns"
import { BOOKING_MONTH, BOOKING_YEAR, bookingConfig } from "@/lib/booking/config"
import {
  bookingSlotStart,
  formatBookingLabel12h,
  parseBookingDateTime,
  slotIntervalFromStart,
} from "@/lib/booking/datetime"
import {
  getUnbookableDaysInMonth,
  isBookableDay,
  isPastBookingSlotStart,
  isWithinMinNotice,
} from "@/lib/booking/rules"
import type { BookingSlot } from "@/lib/booking/types"

type Interval = {
  start: Date
  end: Date
}

export function buildDayRange(date: string) {
  return {
    time_min: `${date}T${String(bookingConfig.workStartHour).padStart(2, "0")}:00:00`,
    time_max: `${date}T${String(bookingConfig.workEndHour).padStart(2, "0")}:00:00`,
    timezone: bookingConfig.timezone,
  }
}

export function buildMonthRange(year: number, month: number) {
  const monthStr = String(month).padStart(2, "0")
  const nextMonthStart = new Date(year, month, 1)

  return {
    time_min: `${year}-${monthStr}-01T00:00:00`,
    time_max: `${nextMonthStart.getFullYear()}-${String(nextMonthStart.getMonth() + 1).padStart(2, "0")}-01T00:00:00`,
    timezone: bookingConfig.timezone,
  }
}

export function padBusyIntervals(
  intervals: Interval[],
  bufferMinutes = bookingConfig.bufferMinutes
): Interval[] {
  if (!bufferMinutes) return intervals
  return intervals.map((interval) => ({
    start: interval.start,
    end: addMinutes(interval.end, bufferMinutes),
  }))
}

export function meetingFitsWorkHours(slotStart: string, durationMinutes: number): boolean {
  const hour = Number(slotStart.slice(11, 13))
  const minute = Number(slotStart.slice(14, 16))
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return false

  const startMinutes = hour * 60 + minute
  const workStart = bookingConfig.workStartHour * 60
  const workEnd = bookingConfig.workEndHour * 60
  return startMinutes >= workStart && startMinutes + durationMinutes <= workEnd
}

export function isMeetingWindowFree(
  slotStart: string,
  durationMinutes: number,
  busyIntervals: Interval[]
): boolean {
  const candidate = slotIntervalFromStart(slotStart, durationMinutes)
  return !padBusyIntervals(busyIntervals).some((interval) => intervalsOverlap(candidate, interval))
}

export function generateCandidateSlotStarts(
  date: string,
  durationMinutes = bookingConfig.sqlDurationMinutes
): string[] {
  if (!isBookableDay(date)) return []

  const starts: string[] = []
  const startMinutes = bookingConfig.workStartHour * 60
  const endMinutes = bookingConfig.workEndHour * 60
  const step = durationMinutes + bookingConfig.bufferMinutes

  for (let minutes = startMinutes; minutes < endMinutes; minutes += step) {
    if (minutes + durationMinutes > endMinutes) continue

    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    starts.push(bookingSlotStart(date, hour, minute))
  }

  return starts
}

export function isPlausibleSlotStart(date: string, slotStart: string): boolean {
  return (
    generateCandidateSlotStarts(date, bookingConfig.mqlDurationMinutes).includes(slotStart) ||
    generateCandidateSlotStarts(date, bookingConfig.sqlDurationMinutes).includes(slotStart)
  )
}

export function generateCandidateSlots(
  date: string,
  durationMinutes = bookingConfig.sqlDurationMinutes
): Interval[] {
  return generateCandidateSlotStarts(date, durationMinutes).map((start) =>
    slotIntervalFromStart(start, durationMinutes)
  )
}

export function intervalsOverlap(a: Interval, b: Interval) {
  return a.start < b.end && b.start < a.end
}

export function toBookingSlot(start: string, available = true): BookingSlot {
  return {
    start,
    label12h: formatBookingLabel12h(start),
    label24h: start.slice(11, 16),
    available,
  }
}

export function applyLiveSlotRules(slots: BookingSlot[]): BookingSlot[] {
  return slots
    .filter((slot) => !isPastBookingSlotStart(slot.start))
    .map((slot) => (isWithinMinNotice(slot.start) ? { ...slot, available: false } : slot))
}

export function filterPastSlots(_date: string, slots: BookingSlot[]): BookingSlot[] {
  return applyLiveSlotRules(slots)
}

export function buildDaySlots(
  date: string,
  busyIntervals: Interval[],
  durationMinutes = bookingConfig.sqlDurationMinutes
): BookingSlot[] {
  const paddedBusy = padBusyIntervals(busyIntervals)
  return applyLiveSlotRules(
    generateCandidateSlotStarts(date, durationMinutes).map((start) => {
      const candidate = slotIntervalFromStart(start, durationMinutes)
      const busy = paddedBusy.some((interval) => intervalsOverlap(candidate, interval))
      return toBookingSlot(start, !busy)
    })
  )
}

export function filterAvailableSlots(
  date: string,
  busyIntervals: Interval[],
  durationMinutes = bookingConfig.sqlDurationMinutes
): BookingSlot[] {
  return buildDaySlots(date, busyIntervals, durationMinutes)
}

export function parseBusyIntervals(payload: unknown): Interval[] {
  const intervals: Interval[] = []

  if (payload && typeof payload === "object") {
    const calendars = (payload as Record<string, unknown>).calendars
    if (calendars && typeof calendars === "object") {
      for (const calendar of Object.values(calendars)) {
        if (!calendar || typeof calendar !== "object") continue

        const busy = (calendar as Record<string, unknown>).busy
        if (!Array.isArray(busy)) continue

        for (const block of busy) {
          if (!block || typeof block !== "object") continue

          const start = (block as Record<string, unknown>).start
          const end = (block as Record<string, unknown>).end

          if (typeof start === "string" && typeof end === "string") {
            intervals.push({
              start: parseBookingDateTime(start),
              end: parseBookingDateTime(end),
            })
          }
        }
      }

      return intervals
    }
  }

  const visit = (value: unknown, depth = 0) => {
    if (!value || depth > 8) return

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1))
      return
    }

    if (typeof value !== "object") return

    const record = value as Record<string, unknown>
    const start = record.start ?? record.startTime
    const end = record.end ?? record.endTime

    if (typeof start === "string" && typeof end === "string") {
      intervals.push({
        start: parseBookingDateTime(start),
        end: parseBookingDateTime(end),
      })
    }

    Object.values(record).forEach((child) => visit(child, depth + 1))
  }

  visit(payload)
  return intervals
}

export function daysWithAvailability(year: number, month: number, busyIntervals: Interval[]): number[] {
  return buildMonthAvailabilityMaps(year, month, busyIntervals).availableDays
}

export function buildMonthAvailabilityMaps(
  year: number,
  month: number,
  busyIntervals: Interval[],
  durationMinutes = bookingConfig.sqlDurationMinutes
) {
  const monthStr = String(month).padStart(2, "0")
  const daysInMonth = new Date(year, month, 0).getDate()
  const slotsByDate: Record<string, BookingSlot[]> = {}
  const availableDays: number[] = []
  const unavailableDays: number[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${monthStr}-${String(day).padStart(2, "0")}`

    if (!isBookableDay(date)) {
      slotsByDate[date] = []
      unavailableDays.push(day)
      continue
    }

    const dayStart = parseBookingDateTime(`${date}T00:00:00`)
    const dayEnd = parseBookingDateTime(`${date}T23:59:59`)

    const dayBusy = busyIntervals.filter(
      (interval) => interval.start <= dayEnd && interval.end >= dayStart
    )

    const slots = buildDaySlots(date, dayBusy, durationMinutes)
    slotsByDate[date] = slots

    if (slots.some((slot) => slot.available)) availableDays.push(day)
    else unavailableDays.push(day)
  }

  return { slotsByDate, availableDays, unavailableDays }
}

export function buildMockMonthAvailability(
  year: number,
  month: number,
  durationMinutes = bookingConfig.sqlDurationMinutes
) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const slotsByDate: Record<string, BookingSlot[]> = {}
  const availableDays: number[] = []
  const unavailableDays: number[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    if (!isBookableDay(date)) {
      slotsByDate[date] = []
      unavailableDays.push(day)
      continue
    }

    const slots = getMockSlotsForDay(day, year, month, durationMinutes)
    slotsByDate[date] = slots
    if (slots.some((slot) => slot.available)) availableDays.push(day)
    else unavailableDays.push(day)
  }

  return { slotsByDate, availableDays, unavailableDays }
}

export function getMockSlotsForDay(
  day: number,
  year = BOOKING_YEAR,
  month = BOOKING_MONTH,
  durationMinutes = bookingConfig.sqlDurationMinutes,
): BookingSlot[] {
  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  const all = buildDaySlots(date, [], durationMinutes)

  if (day % 3 === 0) {
    return all.map((slot, index) => (index % 2 === 0 ? slot : { ...slot, available: false }))
  }
  if (day % 2 === 0) {
    return all.map((slot, index) => (index < 6 ? slot : { ...slot, available: false }))
  }
  return all
}

export function getMockUnavailableDays(): number[] {
  return getUnbookableDaysInMonth(BOOKING_YEAR, BOOKING_MONTH)
}
