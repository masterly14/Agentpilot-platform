import { NextResponse } from "next/server"
import { sendBookingConfirmationEmails } from "@/lib/booking-emails"
import {
  createBooking,
  isValidBookingDate,
  isValidSlot,
} from "@/lib/booking/composio-calendar"
import { bookingFormDataFromSubmission } from "@/lib/booking/from-submission"
import {
  INDUSTRY_TIME_DB,
  INDUSTRY_TIME_OPTIONS,
  isOptionValue,
  isValidOptionalUrl,
  normalizeInstagram,
  normalizeWebsiteUrl,
  PMS_OPTIONS,
  PMS_USAGE_DB,
  PROPERTY_COUNT_DB,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
  REVENUE_RANGE_DB,
  YES_NO_DB,
  YES_NO_OPTIONS,
} from "@/lib/booking/form-options"
import { isValidPhoneNumber } from "@/lib/booking/phone-countries"
import type { BookingFormPayload } from "@/lib/booking/types"
import { generatePdfToken } from "@/lib/ebook/token"
import { classifyLead } from "@/lib/lead-qualification"
import { leadFormToPrismaData } from "@/lib/partial-leads"
import { attachBookingToPipeline } from "@/lib/pipeline/booking"
import { parseBookingDateTime } from "@/lib/booking/datetime"
import { sanitizeVisitorTimezone } from "@/lib/booking/timezone"
import { prisma } from "@/lib/prisma"
import type {
  BookingFlow,
  IndustryTime,
  PmsUsage,
  PropertyCount,
  RevenueRange,
  YesNo,
} from "@/prisma/generated/client"
import { attributionFromRequest, clientContextFromRequest } from "@/lib/marketing/attribution"
import { MARKETING_TRIGGERED_BY, recordMarketingStage } from "@/lib/marketing/events"
import { markLandingConverted } from "@/lib/ad-landing"
import { readVisitorId } from "@/lib/visitor-id"
import { getAppUrl } from "@/lib/ebook/app-url"

const BOOKING_FLOWS = ["EBOOK_SQL", "EBOOK_PDF", "DIAGNOSIS_PUBLIC", "DIRECT_BOOKING"] as const

function isBookingFlow(value: unknown): value is BookingFlow {
  return typeof value === "string" && BOOKING_FLOWS.includes(value as BookingFlow)
}

function isLeadTokenPayload(
  body: unknown
): body is { date: string; slotStart: string; leadToken: string; bookingFlow?: BookingFlow } {
  if (!body || typeof body !== "object") return false
  const record = body as Record<string, unknown>
  return (
    typeof record.date === "string" &&
    typeof record.slotStart === "string" &&
    typeof record.leadToken === "string" &&
    record.leadToken.trim().length > 0 &&
    (record.bookingFlow === undefined || isBookingFlow(record.bookingFlow))
  )
}

function isValidPayload(body: unknown): body is BookingFormPayload {
  if (!body || typeof body !== "object") return false

  const record = body as Record<string, unknown>
  return (
    typeof record.date === "string" &&
    typeof record.slotStart === "string" &&
    typeof record.fullName === "string" &&
    typeof record.email === "string" &&
    typeof record.phoneCountryCode === "string" &&
    typeof record.phoneNumber === "string" &&
    typeof record.companyName === "string" &&
    typeof record.websiteUrl === "string" &&
    typeof record.instagramUrl === "string" &&
    typeof record.usesPms === "string" &&
    typeof record.propertyCount === "string" &&
    typeof record.revenueRange === "string" &&
    typeof record.isTodero === "string" &&
    typeof record.usesAi === "string" &&
    typeof record.wantsToScale === "string" &&
    typeof record.industryTime === "string" &&
    record.fullName.trim().length > 0 &&
    record.email.trim().length > 0 &&
    record.phoneCountryCode.trim().length > 0 &&
    isValidPhoneNumber(record.phoneNumber) &&
    isOptionValue(PMS_OPTIONS, record.usesPms) &&
    isOptionValue(PROPERTY_OPTIONS, record.propertyCount) &&
    isOptionValue(REVENUE_OPTIONS, record.revenueRange) &&
    isOptionValue(YES_NO_OPTIONS, record.isTodero) &&
    isOptionValue(YES_NO_OPTIONS, record.usesAi) &&
    isOptionValue(YES_NO_OPTIONS, record.wantsToScale) &&
    isOptionValue(INDUSTRY_TIME_OPTIONS, record.industryTime)
  )
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizePublicPayload(body: BookingFormPayload): BookingFormPayload {
  return {
    date: body.date,
    slotStart: body.slotStart,
    fullName: body.fullName.trim(),
    email: body.email.trim(),
    phoneCountryCode: body.phoneCountryCode.trim(),
    phoneNumber: body.phoneNumber.replace(/\D/g, ""),
    companyName: body.companyName.trim(),
    websiteUrl: normalizeWebsiteUrl(body.websiteUrl),
    instagramUrl: normalizeInstagram(body.instagramUrl),
    usesPms: body.usesPms,
    propertyCount: body.propertyCount,
    revenueRange: body.revenueRange,
    isTodero: body.isTodero,
    usesAi: body.usesAi,
    wantsToScale: body.wantsToScale,
    industryTime: body.industryTime,
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const attribution = attributionFromRequest(request, body)
    const client = clientContextFromRequest(request)

    let payload: BookingFormPayload
    let submissionId: string | null = null
    let bookingFlow: BookingFlow | null = null
    let writeFormFields = false

    if (isValidPayload(body)) {
      if (!isValidEmail(body.email.trim())) {
        return NextResponse.json({ error: "Correo electrónico inválido" }, { status: 400 })
      }

      if (!isValidOptionalUrl(body.websiteUrl)) {
        return NextResponse.json({ error: "Enlace de página web inválido" }, { status: 400 })
      }

      payload = normalizePublicPayload(body)
      const publicFlow = (body as { bookingFlow?: unknown }).bookingFlow
      bookingFlow = isBookingFlow(publicFlow) ? publicFlow : "DIRECT_BOOKING"
      payload.origin =
        bookingFlow === "DIAGNOSIS_PUBLIC" ? "Diagnóstico público" : "Booking directo"

      const partialTokenValue = (body as BookingFormPayload & { leadToken?: unknown }).leadToken
      const partialToken = typeof partialTokenValue === "string" ? partialTokenValue.trim() : ""
      if (partialToken) {
        const existing = await prisma.formSubmission.findUnique({
          where: { pdfToken: partialToken },
          select: { id: true, status: true },
        })
        if (existing?.status === "PARTIAL") {
          submissionId = existing.id
          writeFormFields = true
        }
      }
    } else if (isLeadTokenPayload(body)) {
      const submission = await prisma.formSubmission.findUnique({
        where: { pdfToken: body.leadToken.trim() },
      })

      if (!submission) {
        return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
      }

      const requestedFlow = body.bookingFlow ?? "EBOOK_PDF"
      if (requestedFlow === "EBOOK_SQL" && submission.qualification !== "SQL") {
        return NextResponse.json({ error: "Este lead no califica para agendar por esta vía" }, { status: 403 })
      }

      payload = {
        date: body.date,
        slotStart: body.slotStart,
        ...bookingFormDataFromSubmission(submission),
        origin:
          requestedFlow === "EBOOK_SQL"
            ? `Ebook SQL · lead=${submission.pdfToken}`
            : `Guía PDF · lead=${submission.pdfToken}`,
      }
      submissionId = submission.id
      bookingFlow = requestedFlow
    } else {
      return NextResponse.json({ error: "Datos de reserva inválidos" }, { status: 400 })
    }

    const visitorTimezone = sanitizeVisitorTimezone((body as { visitorTimezone?: unknown }).visitorTimezone)
    if (visitorTimezone) payload.visitorTimezone = visitorTimezone

    if (!isValidBookingDate(payload.date)) {
      return NextResponse.json({ error: "Fecha fuera del calendario disponible" }, { status: 400 })
    }

    if (!isValidSlot(payload.date, payload.slotStart)) {
      return NextResponse.json({ error: "Horario no disponible" }, { status: 400 })
    }

    const result = await createBooking(payload)
    const meetingTime = parseBookingDateTime(payload.slotStart)
    const hasConfirmedCalendarEvent = result.source === "composio" && Boolean(result.eventId)
    if (!hasConfirmedCalendarEvent) {
      console.error("[booking/create] reserva sin evento de calendario confirmado; se omite Schedule", {
        source: result.source,
        hasEventId: Boolean(result.eventId),
      })
    }

    let savedSubmissionId = submissionId

    if (submissionId && bookingFlow) {
      const classification = writeFormFields ? classifyLead(payload) : null
      await prisma.formSubmission.update({
        where: { id: submissionId },
        data: {
          ...(writeFormFields ? leadFormToPrismaData(payload) : {}),
          status: "MEETING_SCHEDULED",
          bookingFlow,
          bookedAt: new Date(),
          ...(classification
            ? {
                qualification: classification.qualification,
                qualificationScore: classification.qualificationScore,
                disqualificationReason: classification.disqualificationReason,
                scoreBreakdown: classification.scoreBreakdown ?? undefined,
              }
            : {}),
        },
      })
    } else if (bookingFlow) {
      const classification = classifyLead(payload)
      const created = await prisma.formSubmission.create({
        data: {
          fullName: payload.fullName,
          email: payload.email,
          companyName: payload.companyName || null,
          phoneCountryCode: payload.phoneCountryCode,
          phoneNumber: payload.phoneNumber,
          websiteUrl: payload.websiteUrl || null,
          instagramUrl: payload.instagramUrl || null,
          usesPms: PMS_USAGE_DB[payload.usesPms as keyof typeof PMS_USAGE_DB] as PmsUsage,
          propertyCount: PROPERTY_COUNT_DB[payload.propertyCount as keyof typeof PROPERTY_COUNT_DB] as PropertyCount,
          revenueRange: REVENUE_RANGE_DB[payload.revenueRange as keyof typeof REVENUE_RANGE_DB] as RevenueRange,
          isTodero: YES_NO_DB[payload.isTodero as keyof typeof YES_NO_DB] as YesNo,
          usesAi: YES_NO_DB[payload.usesAi as keyof typeof YES_NO_DB] as YesNo,
          wantsToScale: YES_NO_DB[payload.wantsToScale as keyof typeof YES_NO_DB] as YesNo,
          industryTime: INDUSTRY_TIME_DB[payload.industryTime as keyof typeof INDUSTRY_TIME_DB] as IndustryTime,
          pdfToken: generatePdfToken(),
          qualification: classification.qualification,
          qualificationScore: classification.qualificationScore,
          disqualificationReason: classification.disqualificationReason,
          scoreBreakdown: classification.scoreBreakdown ?? undefined,
          entrySource: bookingFlow === "DIAGNOSIS_PUBLIC" ? "DIAGNOSIS" : "DIRECT_BOOKING",
          bookingFlow,
          bookedAt: new Date(),
          status: "MEETING_SCHEDULED",
        },
      })
      savedSubmissionId = created.id
    }

    if (savedSubmissionId && bookingFlow) {
      const submission = await prisma.formSubmission.findUnique({
        where: { id: savedSubmissionId },
      })
      if (submission?.fullName && submission.email && submission.phoneCountryCode && submission.phoneNumber) {
        try {
          await attachBookingToPipeline({
            submissionId: submission.id,
            fullName: submission.fullName,
            email: submission.email,
            phoneCountryCode: submission.phoneCountryCode,
            phoneNumber: submission.phoneNumber,
            companyName: submission.companyName,
            websiteUrl: submission.websiteUrl,
            instagramUrl: submission.instagramUrl,
            bookingFlow,
            qualification: submission.qualification,
            meetingTime,
            meetingId: result.eventId,
            meetLink: result.meetLink,
            visitorTimezone,
          })
        } catch (error) {
          console.error("[pipeline] no se pudo arrancar pre-reunión", error)
        }
      }
    }

    const marketing = savedSubmissionId && hasConfirmedCalendarEvent
      ? await recordMarketingStage({
          submissionId: savedSubmissionId,
          to: "SCHEDULED",
          triggeredBy: MARKETING_TRIGGERED_BY.system,
          eventSourceUrl: `${getAppUrl()}/agendar`,
          attribution,
          client,
        })
      : null

    if (bookingFlow === "DIAGNOSIS_PUBLIC") {
      try {
        await markLandingConverted({
          visitorId: readVisitorId((body as { visitorId?: unknown }).visitorId),
          landingPath: "/diagnosis",
          conversion: "SCHEDULE",
          attribution,
        })
      } catch (error) {
        console.error("[landing/visit] no se pudo marcar Schedule", error)
      }
    }

    await sendBookingConfirmationEmails(payload, result)

    return NextResponse.json({
      ...result,
      submissionId: savedSubmissionId,
      marketingEventId: marketing?.eventId ?? null,
    })
  } catch (error) {
    console.error("[booking/create]", error)
    const message = error instanceof Error ? error.message : "No se pudo crear la reserva"
    const status = message.includes("ya no está disponible") ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
