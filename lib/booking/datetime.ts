import { addMinutes, parseISO } from "date-fns"
import { bookingConfig } from "@/lib/booking/config"

const BOOKING_UTC_OFFSET = "-05:00"

export function parseBookingDateTime(dateTime: string): Date {
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(dateTime)) {
    return parseISO(dateTime)
  }

  return parseISO(`${dateTime}${BOOKING_UTC_OFFSET}`)
}

export function bookingSlotStart(date: string, hour: number, minute: number): string {
  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`
}

export function slotIntervalFromStart(start: string, slotMinutes = bookingConfig.slotMinutes) {
  const startDate = parseBookingDateTime(start)
  return {
    start: startDate,
    end: addMinutes(startDate, slotMinutes),
  }
}

export function formatBookingLabel12h(start: string): string {
  const hour = Number(start.slice(11, 13))
  const minute = Number(start.slice(14, 16))
  const period = hour >= 12 ? "pm" : "am"
  const hour12 = hour % 12 || 12
  const minuteLabel = minute === 0 ? "" : `:${String(minute).padStart(2, "0")}`
  return `${hour12}${minuteLabel}${period}`
}
