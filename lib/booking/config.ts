export const BOOKING_MONTH = 8
export const BOOKING_YEAR = 2026
export const BOOKING_MONTH_HORIZON = 4

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const

export function bookingMonthName(month: number = BOOKING_MONTH) {
  return MONTHS_ES[month - 1] ?? ""
}

export function bookingMonthLabel(year: number = BOOKING_YEAR, month: number = BOOKING_MONTH) {
  return `${bookingMonthName(month)} ${year}`
}

export function addBookingMonths(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}

const mqlDurationMinutes = Number(process.env.BOOKING_SLOT_MINUTES ?? 40)
const sqlDurationMinutes = Number(process.env.BOOKING_SQL_MINUTES ?? 70)
const bufferMinutes = Number(process.env.BOOKING_BUFFER_MINUTES ?? 20)
const demoDurationMinutes = Number(process.env.BOOKING_DEMO_MINUTES ?? 60)

export const bookingConfig = {
  timezone: process.env.BOOKING_TIMEZONE ?? "America/Bogota",
  slotMinutes: mqlDurationMinutes,
  mqlDurationMinutes,
  sqlDurationMinutes,
  bufferMinutes,
  demoDurationMinutes,
  workStartHour: Number(process.env.BOOKING_WORK_START_HOUR ?? 10),
  workEndHour: Number(process.env.BOOKING_WORK_END_HOUR ?? 18),
  minNoticeMinutes: Number(process.env.BOOKING_MIN_NOTICE_MINUTES ?? 120),
  calendarId: process.env.BOOKING_CALENDAR_ID ?? "primary",
  composioUserId: process.env.COMPOSIO_CALENDAR_USER_ID ?? "santiago-calendar",
  composioAuthConfigId: process.env.COMPOSIO_GOOGLE_CALENDAR_AUTH_CONFIG_ID,
  googleCalendarToolkitVersion:
    process.env.COMPOSIO_TOOLKIT_VERSION_GOOGLECALENDAR ?? "20260623_00",
}

export function isComposioConfigured() {
  return Boolean(process.env.COMPOSIO_API_KEY && bookingConfig.composioUserId)
}

export function toBookingDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}
