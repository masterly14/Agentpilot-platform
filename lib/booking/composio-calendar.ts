import { addMinutes } from "date-fns"
import {
  BOOKING_MONTH,
  BOOKING_YEAR,
  bookingConfig,
  isComposioConfigured,
  toBookingDate,
} from "@/lib/booking/config"
import { parseBookingDateTime } from "@/lib/booking/datetime"
import { isBookableDay, getBookingDateTimeParts, isPastBookingSlotStart } from "@/lib/booking/rules"
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

async function executeCalendarTool(tool: string, arguments_: Record<string, unknown>) {
  const composio = getComposioClient()
  const userId = getComposioUserId()

  const result = await composio.tools.execute(tool, {
    userId,
    arguments: arguments_,
  })

  const payload = unwrapComposioData(result) as ComposioExecuteResult
  if (payload && typeof payload === "object" && payload.successful === false) {
    throw new Error(payload.error || `Composio tool ${tool} failed`)
  }

  return payload
}

function slotsFromFreeBusy(date: string, payload: unknown) {
  return filterAvailableSlots(date, parseBusyIntervals(payload))
}

export async function getDayAvailability(date: string): Promise<AvailabilityResponse> {
  if (!isComposioConfigured()) {
    const day = Number(date.split("-")[2])
    return {
      date,
      slots: getMockSlotsForDay(day),
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

function buildEventEndDatetime(slotStart: string) {
  const end = addMinutes(parseBookingDateTime(slotStart), bookingConfig.slotMinutes)
  const { date, time } = getBookingDateTimeParts(end)
  return `${date}T${time}`
}

function extractMeetLink(payload: unknown): string | undefined {  if (!payload || typeof payload !== "object") return undefined

  const record = payload as Record<string, unknown>

  if (typeof record.hangoutLink === "string") return record.hangoutLink

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

async function assertSlotIsAvailable(date: string, slotStart: string) {
  if (isPastBookingSlotStart(slotStart)) {
    throw new Error("El horario seleccionado ya no está disponible")
  }

  const availability = await getDayAvailability(date)
  const isAvailable = availability.slots.some((slot) => slot.start === slotStart)

  if (!isAvailable) {
    throw new Error("El horario seleccionado ya no está disponible")
  }
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

  const description = formatBookingAnswersForDescription({
    usesPms: payload.usesPms,
    propertyCount: payload.propertyCount,
    revenueRange: payload.revenueRange,
  })

  const result = await executeCalendarTool("GOOGLECALENDAR_CREATE_EVENT", {
    calendar_id: bookingConfig.calendarId,
    summary: `Reunión con ${payload.fullName}`,
    description: description || undefined,
    start_datetime: slotStart,
    end_datetime: buildEventEndDatetime(slotStart),
    timezone: bookingConfig.timezone,
    event_duration_minutes: bookingConfig.slotMinutes,
    attendees: [{ email: payload.email, optional: false }],
    exclude_organizer: true,
    create_meeting_room: true,
    send_updates: "all",
  })

  const data =
    result && typeof result === "object"
      ? ((result as Record<string, unknown>).response_data ?? result)
      : result

  const record = (data ?? {}) as Record<string, unknown>

  return {
    success: true,
    source: "composio",
    eventId: typeof record.id === "string" ? record.id : undefined,
    htmlLink: typeof record.htmlLink === "string" ? record.htmlLink : undefined,
    meetLink: extractMeetLink(record),
  }
}

export function isValidBookingDate(date: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    date.startsWith(`${BOOKING_YEAR}-${String(BOOKING_MONTH).padStart(2, "0")}`) &&
    isBookableDay(date)
  )
}
export function dayToBookingDate(day: number) {
  return toBookingDate(day)
}

export function isValidSlot(date: string, slotStart: string) {
  return generateCandidateSlotStarts(date).includes(slotStart)
}