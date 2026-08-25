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

export function generateCandidateSlotStarts(date: string): string[] {
  if (!isBookableDay(date)) return []

  const starts: string[] = []
  const startMinutes = bookingConfig.workStartHour * 60
  const endMinutes = bookingConfig.workEndHour * 60
  const step = bookingConfig.slotMinutes

  for (let minutes = startMinutes; minutes < endMinutes; minutes += step) {
    const slotEnd = minutes + step
    if (slotEnd > endMinutes) continue

    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    starts.push(bookingSlotStart(date, hour, minute))
  }

  return starts
}

export function generateCandidateSlots(date: string): Interval[] {
  return generateCandidateSlotStarts(date).map((start) => slotIntervalFromStart(start))
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

export function buildDaySlots(date: string, busyIntervals: Interval[]): BookingSlot[] {
  return applyLiveSlotRules(
    generateCandidateSlotStarts(date).map((start) => {
      const candidate = slotIntervalFromStart(start)
      const busy = busyIntervals.some((interval) => intervalsOverlap(candidate, interval))
      return toBookingSlot(start, !busy)
    })
  )
}

export function filterAvailableSlots(date: string, busyIntervals: Interval[]): BookingSlot[] {
  return buildDaySlots(date, busyIntervals)
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
  busyIntervals: Interval[]
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

    const slots = buildDaySlots(date, dayBusy)
    slotsByDate[date] = slots

    if (slots.some((slot) => slot.available)) availableDays.push(day)
    else unavailableDays.push(day)
  }

  return { slotsByDate, availableDays, unavailableDays }
}

export function buildMockMonthAvailability(year: number, month: number) {
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

    const slots = getMockSlotsForDay(day, year, month)
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
): BookingSlot[] {
  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  const all = buildDaySlots(date, [])

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
