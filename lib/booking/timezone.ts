import { bookingConfig } from "@/lib/booking/config"
import { parseBookingDateTime } from "@/lib/booking/datetime"

const WEEKDAYS_ES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"] as const

export const BOOKING_TIMEZONE_LABELS: Record<string, string> = {
  "America/Bogota": "Bogotá",
  "America/New_York": "Miami / Nueva York",
  "America/Chicago": "Chicago",
  "America/Denver": "Denver",
  "America/Phoenix": "Phoenix",
  "America/Los_Angeles": "Los Ángeles",
  "America/Anchorage": "Alaska",
  "Pacific/Honolulu": "Hawái",
  "America/Puerto_Rico": "Puerto Rico",
  "America/Toronto": "Toronto",
  "America/Mexico_City": "Ciudad de México",
  "America/Cancun": "Cancún",
  "America/Panama": "Panamá",
  "America/Lima": "Lima",
  "America/Guayaquil": "Guayaquil",
  "America/Santiago": "Santiago",
  "America/Buenos_Aires": "Buenos Aires",
  "America/Sao_Paulo": "São Paulo",
  "America/Caracas": "Caracas",
  "America/Santo_Domingo": "Santo Domingo",
  "Europe/Madrid": "Madrid",
  UTC: "UTC",
}

const CURATED_TIMEZONES = [
  "America/Bogota",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Puerto_Rico",
  "America/Toronto",
  "America/Mexico_City",
  "America/Cancun",
  "America/Panama",
  "America/Lima",
  "America/Guayaquil",
  "America/Santiago",
  "America/Buenos_Aires",
  "America/Sao_Paulo",
  "America/Caracas",
  "America/Santo_Domingo",
  "Europe/Madrid",
  "UTC",
] as const

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? ""
}

export function isValidTimeZone(value: string): boolean {
  if (!value || value.length > 64) return false

  try {
    Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date())
    return true
  } catch {
    return false
  }
}

export function sanitizeVisitorTimezone(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (!isValidTimeZone(trimmed)) return undefined
  return trimmed
}

export function formatGmtOffset(timeZone: string, at = new Date()): string {
  try {
    const name = partValue(
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "shortOffset",
      }).formatToParts(at),
      "timeZoneName"
    )
    return name || "GMT"
  } catch {
    return "GMT"
  }
}

export function formatTimezoneCity(timeZone: string): string {
  if (BOOKING_TIMEZONE_LABELS[timeZone]) return BOOKING_TIMEZONE_LABELS[timeZone]
  const city = timeZone.split("/").pop()?.replaceAll("_", " ")
  return city || timeZone
}

export function formatTimezoneLabel(timeZone: string, at = new Date()): string {
  return `${formatTimezoneCity(timeZone)} (${formatGmtOffset(timeZone, at)})`
}

export function getBookingTimezoneOptions(current?: string): string[] {
  const zones = new Set<string>(CURATED_TIMEZONES)
  zones.add(bookingConfig.timezone)
  if (current && isValidTimeZone(current)) zones.add(current)

  return [...zones].sort((a, b) => {
    if (a === bookingConfig.timezone) return -1
    if (b === bookingConfig.timezone) return 1
    return formatTimezoneCity(a).localeCompare(formatTimezoneCity(b), "es")
  })
}

export function formatYmdInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

export function formatSlotTimeLabel(slotStart: string, timeZone: string, use24h: boolean): string {
  const date = parseBookingDateTime(slotStart)

  if (use24h) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date)
    return `${partValue(parts, "hour")}:${partValue(parts, "minute")}`
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date)
  const hour = Number(partValue(parts, "hour"))
  const minute = partValue(parts, "minute")
  const period = partValue(parts, "dayPeriod").toLowerCase().startsWith("p") ? "pm" : "am"
  const minuteLabel = minute === "00" ? "" : `:${minute}`
  return `${hour}${minuteLabel}${period}`
}

export function formatSlotDateLabel(slotStart: string, timeZone: string): string {
  const date = parseBookingDateTime(slotStart)
  const ymd = formatYmdInTimeZone(date, timeZone)
  const [year, month, day] = ymd.split("-").map(Number)
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return `${WEEKDAYS_ES[weekdayIndex] ?? "día"} ${String(day).padStart(2, "0")}`
}

export function slotLocalDateDiffers(slotStart: string, calendarDate: string, timeZone: string): boolean {
  return formatYmdInTimeZone(parseBookingDateTime(slotStart), timeZone) !== calendarDate
}

export function formatMeetingInTimeZone(slotStart: string, timeZone: string): string {
  const date = parseBookingDateTime(slotStart)

  const datePart = new Intl.DateTimeFormat("es-CO", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)

  const timePart = new Intl.DateTimeFormat("es-CO", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)

  return `${datePart} · ${timePart}`
}

export function formatBookingTimezoneNote(slotStart: string, visitorTimezone?: string): string {
  const hostLabel = formatTimezoneCity(bookingConfig.timezone)
  const hostLine = `Hora en ${hostLabel}: ${formatMeetingInTimeZone(slotStart, bookingConfig.timezone)}`

  if (!visitorTimezone || visitorTimezone === bookingConfig.timezone) return hostLine

  const visitorLabel = formatTimezoneCity(visitorTimezone)
  return [
    hostLine,
    `Hora del visitante (${visitorLabel}): ${formatMeetingInTimeZone(slotStart, visitorTimezone)}`,
  ].join("\n")
}
