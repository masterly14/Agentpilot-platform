export const BOOKING_MONTH = 7
export const BOOKING_YEAR = 2026

export const bookingConfig = {
  timezone: process.env.BOOKING_TIMEZONE ?? "America/Bogota",
  slotMinutes: Number(process.env.BOOKING_SLOT_MINUTES ?? 30),
  workStartHour: Number(process.env.BOOKING_WORK_START_HOUR ?? 8),
  workEndHour: Number(process.env.BOOKING_WORK_END_HOUR ?? 20),
  calendarId: process.env.BOOKING_CALENDAR_ID ?? "primary",
  composioUserId: process.env.COMPOSIO_CALENDAR_USER_ID ?? "santiago-calendar",
  composioAuthConfigId: process.env.COMPOSIO_GOOGLE_CALENDAR_AUTH_CONFIG_ID,
  googleCalendarToolkitVersion:
    process.env.COMPOSIO_TOOLKIT_VERSION_GOOGLECALENDAR ?? "20260623_00",
}

export function isComposioConfigured() {
  return Boolean(process.env.COMPOSIO_API_KEY && bookingConfig.composioUserId)
}

export function toBookingDate(day: number) {
  return `${BOOKING_YEAR}-${String(BOOKING_MONTH).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}
