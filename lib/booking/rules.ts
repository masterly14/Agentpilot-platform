import { bookingConfig } from "@/lib/booking/config"

export function getBookingDateTimeParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: bookingConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })

  const parts = Object.fromEntries(
    formatter
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  )

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour.padStart(2, "0")}:${parts.minute.padStart(2, "0")}:${parts.second.padStart(2, "0")}`,
  }
}

export function getBookingToday(): string {
  return getBookingDateTimeParts().date
}

export function getBookingNowIso(): string {
  const { date, time } = getBookingDateTimeParts()
  return `${date}T${time}`
}

export function isPastBookingSlotStart(slotStart: string): boolean {
  const slotDate = slotStart.slice(0, 10)
  const slotTime = slotStart.slice(11, 19)
  const { date: today, time: nowTime } = getBookingDateTimeParts()

  if (slotDate < today) return true
  if (slotDate > today) return false

  return slotTime < nowTime
}
export function isSunday(date: string): boolean {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).getDay() === 0
}

export function isPastBookingDay(date: string): boolean {
  return date < getBookingToday()
}

export function isBookableDay(date: string): boolean {
  return !isSunday(date) && !isPastBookingDay(date)
}

export function getUnbookableDaysInMonth(year: number, month: number): number[] {
  const monthStr = String(month).padStart(2, "0")
  const daysInMonth = new Date(year, month, 0).getDate()
  const unbookable: number[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${monthStr}-${String(day).padStart(2, "0")}`
    if (!isBookableDay(date)) unbookable.push(day)
  }

  return unbookable
}
