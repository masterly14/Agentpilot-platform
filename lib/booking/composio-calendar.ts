import { addMinutes } from "date-fns"
import {
  BOOKING_MONTH,
  BOOKING_YEAR,
  bookingConfig,
  isComposioConfigured,
  toBookingDate,
} from "@/lib/booking/config"
import { parseBookingDateTime } from "@/lib/booking/datetime"
import {
  isBookableDay,
  getBookingDateTimeParts,
  isBookableMonth,
  isSlotOpenForBooking,
} from "@/lib/booking/rules"
import {
  buildDayRange,
  buildMockMonthAvailability,
  buildMonthAvailabilityMaps,
  buildMonthRange,
  filterAvailableSlots,
  generateCandidateSlotStarts,
  getMockSlotsForDay,
  parseBusyIntervals,
} from "@/lib/booking/slots"
import type {
  AvailabilityResponse,
  BookingCreateResponse,
  BookingFormPayload,
  MonthAvailabilityResponse,
} from "@/lib/booking/types"
import { formatBookingAnswersForDescription } from "@/lib/booking/form-options"
import { formatBookingTimezoneNote } from "@/lib/booking/timezone"
import { getComposioClient, getComposioUserId } from "@/lib/composio/client"

type ComposioExecuteResult = {
  successful?: boolean
  data?: unknown
  error?: string
}

function unwrapComposioData(result: unknown): unknown {
  if (!result || typeof result !== "object") return result

  const record = result as ComposioExecuteResult
  if (record.data !== undefined) return record.data

  return result
}

function composioErrorMessage(result: unknown) {
  const envelope = asRecord(result)
  if (!envelope) return null

  const nested = asRecord(envelope.data) ?? envelope
  const status = nested.status_code
  if (typeof status === "number" && status >= 400) {
    if (typeof nested.message === "string" && nested.message.trim()) return nested.message
    if (typeof envelope.error === "string" && envelope.error.trim()) return envelope.error
    return `Composio request failed (${status})`
  }

  if (envelope.successful === false) {
    if (typeof envelope.error === "string" && envelope.error.trim()) return envelope.error
    if (typeof nested.message === "string" && nested.message.trim()) return nested.message
    return "Composio tool failed"
  }

  return null
}

async function executeCalendarTool(tool: string, arguments_: Record<string, unknown>) {
  const composio = getComposioClient()
  const userId = getComposioUserId()

  const result = await composio.tools.execute(tool, {
    userId,
    arguments: arguments_,
  })

  const errorMessage = composioErrorMessage(result)
  if (errorMessage) {
    throw new Error(errorMessage)
  }

  return unwrapComposioData(result)
}

function slotsFromFreeBusy(date: string, payload: unknown) {
  return filterAvailableSlots(date, parseBusyIntervals(payload))
}

export async function getDayAvailability(date: string): Promise<AvailabilityResponse> {
  if (!isComposioConfigured()) {
    const [year, month, day] = date.split("-").map(Number)
    return {
      date,
      slots: getMockSlotsForDay(day, year, month),
      source: "mock",
    }
  }

  const dayRange = buildDayRange(date)
  const payload = await executeCalendarTool("GOOGLECALENDAR_FIND_FREE_SLOTS", {
    items: [bookingConfig.calendarId],
    ...dayRange,
  })
  return {
    date,
    slots: slotsFromFreeBusy(date, payload),
    source: "composio",
  }
}

export async function getMonthAvailability(
  year = BOOKING_YEAR,
  month = BOOKING_MONTH
): Promise<MonthAvailabilityResponse> {
  if (!isComposioConfigured()) {
    const { slotsByDate, availableDays, unavailableDays } = buildMockMonthAvailability(year, month)

    return {
      year,
      month,
      availableDays,
      unavailableDays,
      slotsByDate,
      source: "mock",
    }
  }

  const monthRange = buildMonthRange(year, month)
  const payload = await executeCalendarTool("GOOGLECALENDAR_FIND_FREE_SLOTS", {
    items: [bookingConfig.calendarId],
    ...monthRange,
  })
  const busy = parseBusyIntervals(payload)
  const { slotsByDate, availableDays, unavailableDays } = buildMonthAvailabilityMaps(
    year,
    month,
    busy
  )

  return {
    year,
    month,
    availableDays,
    unavailableDays,
    slotsByDate,
    source: "composio",
  }
}

function normalizeSlotStart(date: string, slotStart: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(slotStart)) {
    throw new Error("Formato de horario inválido")
  }

  if (!slotStart.startsWith(date)) {
    throw new Error("La fecha del horario no coincide con el día seleccionado")
  }

  return slotStart
}

function buildEventEndDatetime(slotStart: string, durationMinutes = bookingConfig.slotMinutes) {
  const end = addMinutes(parseBookingDateTime(slotStart), durationMinutes)
  const { date, time } = getBookingDateTimeParts(end)
  return `${date}T${time}`
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function extractMeetLink(payload: unknown): string | undefined {
  const record = asRecord(payload)
  if (!record) return undefined

  if (typeof record.hangoutLink === "string") return record.hangoutLink
  if (typeof record.meetLink === "string" && record.meetLink.includes("meet.google.com")) {
    return record.meetLink
  }
  if (typeof record.location === "string" && record.location.includes("meet.google.com")) {
    return record.location
  }

  const conferenceData = record.conferenceData
  if (conferenceData && typeof conferenceData === "object") {
    const entryPoints = (conferenceData as Record<string, unknown>).entryPoints
    if (Array.isArray(entryPoints)) {
      for (const entry of entryPoints) {
        if (!entry || typeof entry !== "object") continue
        const uri = (entry as Record<string, unknown>).uri
        if (typeof uri === "string" && uri.includes("meet.google.com")) return uri
      }
    }
  }

  return undefined
}

function pickCalendarEventRecord(payload: unknown): Record<string, unknown> {
  const seen = new Set<unknown>()
  const queue: unknown[] = [payload]

  while (queue.length) {
    const item = queue.shift()
    const record = asRecord(item)
    if (!record || seen.has(record)) continue
    seen.add(record)

    const hasEventId = typeof record.id === "string" && record.id.length > 0
    const looksLikeEvent =
      hasEventId &&
      (typeof record.htmlLink === "string" ||
        typeof record.hangoutLink === "string" ||
        Boolean(record.start) ||
        Boolean(record.conferenceData) ||
        typeof record.summary === "string")
    if (looksLikeEvent || (hasEventId && !record.data && !record.response_data && !record.event)) {
      return record
    }

    for (const key of ["data", "response_data", "event", "result"]) {
      if (record[key] !== undefined) queue.push(record[key])
    }
  }

  return asRecord(payload) ?? {}
}

async function assertSlotIsAvailable(date: string, slotStart: string) {
  if (!isSlotOpenForBooking(slotStart)) {
    throw new Error("El horario seleccionado ya no está disponible")
  }

  const availability = await getDayAvailability(date)
  const isAvailable = availability.slots.some((slot) => slot.start === slotStart && slot.available)

  if (!isAvailable) {
    throw new Error("El horario seleccionado ya no está disponible")
  }
}

const DEMO_DURATION_MINUTES = 60

export async function createMeetingEvent(input: {
  summary: string
  description?: string
  start: Date
  durationMinutes?: number
  attendeeEmail?: string | null
}): Promise<BookingCreateResponse> {
  if (!isComposioConfigured()) {
    return { success: true, source: "mock" }
  }

  const { date, time } = getBookingDateTimeParts(input.start)
  const slotStart = `${date}T${time}`
  const durationMinutes = input.durationMinutes ?? bookingConfig.slotMinutes
  const attendees = input.attendeeEmail
    ? [{ email: input.attendeeEmail, optional: false }]
    : undefined

  const result = await executeCalendarTool("GOOGLECALENDAR_CREATE_EVENT", {
    calendar_id: bookingConfig.calendarId,
    summary: input.summary,
    description: input.description || undefined,
    start_datetime: slotStart,
    end_datetime: buildEventEndDatetime(slotStart, durationMinutes),
    timezone: bookingConfig.timezone,
    attendees,
    exclude_organizer: true,
    create_meeting_room: true,
    send_updates: "all",
  })

  const record = pickCalendarEventRecord(result)
  const eventId = typeof record.id === "string" ? record.id : undefined
  const htmlLink = typeof record.htmlLink === "string" ? record.htmlLink : undefined
  const meetLink = extractMeetLink(record)

  if (!eventId) {
    console.warn("[calendar] CREATE_EVENT sin event id", {
      keys: Object.keys(asRecord(result) ?? {}),
    })
  }

  return {
    success: true,
    source: "composio",
    eventId,
    htmlLink,
    meetLink,
  }
}

export async function createDemoEvent(input: {
  fullName: string
  email?: string | null
  start: Date
  painPoint: string
}): Promise<BookingCreateResponse> {
  return createMeetingEvent({
    summary: `Demo con ${input.fullName}`,
    description: `Dolor principal: ${input.painPoint}`,
    start: input.start,
    durationMinutes: DEMO_DURATION_MINUTES,
    attendeeEmail: input.email,
  })
}

export async function createBooking(payload: BookingFormPayload): Promise<BookingCreateResponse> {
  const slotStart = normalizeSlotStart(payload.date, payload.slotStart)

  if (!isComposioConfigured()) {
    return {
      success: true,
      source: "mock",
    }
  }

  await assertSlotIsAvailable(payload.date, slotStart)

  const answers = formatBookingAnswersForDescription({
    usesPms: payload.usesPms,
    propertyCount: payload.propertyCount,
    revenueRange: payload.revenueRange,
    isTodero: payload.isTodero,
    usesAi: payload.usesAi,
    wantsToScale: payload.wantsToScale,
    industryTime: payload.industryTime,
    phoneCountryCode: payload.phoneCountryCode,
    phoneNumber: payload.phoneNumber,
    companyName: payload.companyName,
    websiteUrl: payload.websiteUrl,
    instagramUrl: payload.instagramUrl,
    origin: payload.origin,
  })
  const timezoneNote = formatBookingTimezoneNote(slotStart, payload.visitorTimezone)
  const description = [timezoneNote, answers].filter(Boolean).join("\n\n")
  const start = parseBookingDateTime(slotStart)

  return createMeetingEvent({
    summary: `Reunión con ${payload.fullName}`,
    description: description || undefined,
    start,
    durationMinutes: bookingConfig.slotMinutes,
    attendeeEmail: payload.email,
  })
}

export function buildCalendarEventCopy(input: {
  fullName: string
  kind: "demo" | "meeting"
  meetingTime: Date
  visitorTimezone?: string | null
  descriptionBody?: string
}) {
  const { date, time } = getBookingDateTimeParts(input.meetingTime)
  const timezoneNote = formatBookingTimezoneNote(`${date}T${time}`, input.visitorTimezone ?? undefined)
  return {
    summary: input.kind === "demo" ? `Demo con ${input.fullName}` : `Reunión con ${input.fullName}`,
    description: [timezoneNote, input.descriptionBody].filter(Boolean).join("\n\n") || undefined,
  }
}

export async function updateCalendarEventTime(input: {
  eventId: string
  meetingTime: Date
  durationMinutes?: number
  summary?: string
  description?: string
  attendeeEmail?: string | null
}) {
  if (!isComposioConfigured()) {
    return { success: false as const, reason: "not_configured" as const }
  }

  const { date, time } = getBookingDateTimeParts(input.meetingTime)
  const slotStart = `${date}T${time}`
  const durationMinutes = input.durationMinutes ?? bookingConfig.slotMinutes
  const attendees = input.attendeeEmail
    ? [input.attendeeEmail]
    : undefined

  try {
    await executeCalendarTool("GOOGLECALENDAR_PATCH_EVENT", {
      calendar_id: bookingConfig.calendarId,
      event_id: input.eventId,
      start_time: slotStart,
      end_time: buildEventEndDatetime(slotStart, durationMinutes),
      timezone: bookingConfig.timezone,
      send_updates: "all",
      summary: input.summary || undefined,
      description: input.description || undefined,
      attendees,
    })
    return { success: true as const }
  } catch (error) {
    console.warn("[calendar] no se pudo actualizar evento", input.eventId, error)
    return { success: false as const, reason: "update_failed" as const }
  }
}

export function isValidBookingDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false

  const [year, month, day] = date.split("-").map(Number)
  const parsed = new Date(year, month - 1, day)
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return false
  }

  return isBookableMonth(year, month) && isBookableDay(date)
}

export function dayToBookingDate(year: number, month: number, day: number) {
  return toBookingDate(year, month, day)
}

export function isValidSlot(date: string, slotStart: string) {
  return generateCandidateSlotStarts(date).includes(slotStart) && isSlotOpenForBooking(slotStart)
}