import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { bookingConfig } from "@/lib/booking/config"
import {
  bookingSlotStart,
  formatBookingLabel12h,
  parseBookingDateTime,
  slotIntervalFromStart,
} from "@/lib/booking/datetime"
import { isBookableDay, getBookingToday, getUnbookableDaysInMonth, isPastBookingSlotStart } from "@/lib/booking/rules"
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

  for (let hour = bookingConfig.workStartHour; hour < bookingConfig.workEndHour; hour++) {
    for (const minute of [0, 30]) {
      const endMinutes = hour * 60 + minute + bookingConfig.slotMinutes
      const endHour = Math.floor(endMinutes / 60)
      const endMinute = endMinutes % 60

      if (endHour > bookingConfig.workEndHour || (endHour === bookingConfig.workEndHour && endMinute > 0)) {
        continue
      }

      starts.push(bookingSlotStart(date, hour, minute))
    }
  }

  return starts
}

export function generateCandidateSlots(date: string): Interval[] {
  return generateCandidateSlotStarts(date).map((start) => slotIntervalFromStart(start))
}

export function intervalsOverlap(a: Interval, b: Interval) {
  return a.start < b.end && b.start < a.end
}

export function toBookingSlot(start: string): BookingSlot {
  return {
    start,
    label12h: formatBookingLabel12h(start),
    label24h: start.slice(11, 16),
  }
}

export function filterPastSlots(date: string, slots: BookingSlot[]): BookingSlot[] {
  if (date !== getBookingToday()) return slots
  return slots.filter((slot) => !isPastBookingSlotStart(slot.start))
}

export function filterAvailableSlots(date: string, busyIntervals: Interval[]): BookingSlot[] {
  const available = generateCandidateSlotStarts(date)
    .filter((start) => {
      const candidate = slotIntervalFromStart(start)
      return !busyIntervals.some((busy) => intervalsOverlap(candidate, busy))
    })
    .map((start) => toBookingSlot(start))

  return filterPastSlots(date, available)
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

    const slots = filterAvailableSlots(date, dayBusy)
    slotsByDate[date] = slots

    if (slots.length > 0) availableDays.push(day)
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

    const slots = getMockSlotsForDay(day)
    slotsByDate[date] = slots
    if (slots.length > 0) availableDays.push(day)
    else unavailableDays.push(day)
  }

  return { slotsByDate, availableDays, unavailableDays }
}

export function getMockSlotsForDay(day: number): BookingSlot[] {
  const date = `2026-07-${String(day).padStart(2, "0")}`
  const all = filterAvailableSlots(date, [])

  if (day % 3 === 0) return all.filter((_, index) => index % 2 === 0)
  if (day % 2 === 0) return all.slice(0, 6)
  return all
}

export function getMockUnavailableDays(): number[] {
  return getUnbookableDaysInMonth(2026, 7)
}
