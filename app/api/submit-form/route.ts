import { NextResponse } from "next/server"
import type {
  IndustryTime,
  PmsUsage,
  PropertyCount,
  RevenueRange,
  YesNo,
} from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { getResendFromAddress } from "@/lib/email"
import { sendLeadGuideEmail } from "@/lib/emails/send-lead-guide"
import { formatLeadFormDataForEmail } from "@/lib/form-labels"
import { isValidPhoneNumber } from "@/lib/booking/phone-countries"
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
import { generatePdfToken } from "@/lib/ebook/token"
import { classifyLead, getLeadPostSubmitPath } from "@/lib/lead-qualification"
import { upsertContactFromLead } from "@/lib/pipeline/contact"
import { ensureNurturingPipeline } from "@/lib/pipeline/engine"
import type { LeadFormPayload } from "@/lib/booking/types"
import { attributionFromRequest, clientContextFromRequest } from "@/lib/marketing/attribution"
import { MARKETING_TRIGGERED_BY, recordMarketingStage } from "@/lib/marketing/events"
import { markLandingConverted } from "@/lib/ad-landing"
import { readVisitorId } from "@/lib/visitor-id"
import { getAppUrl } from "@/lib/ebook/app-url"

export const runtime = "nodejs"
export const maxDuration = 60

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPayload(body: unknown): body is LeadFormPayload {
  if (!body || typeof body !== "object") return false

  const record = body as Record<string, unknown>
  return (
    typeof record.fullName === "string" &&
    typeof record.email === "string" &&
    typeof record.companyName === "string" &&
    typeof record.phoneCountryCode === "string" &&
    typeof record.phoneNumber === "string" &&
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
    isValidEmail(record.email.trim()) &&
    record.companyName.trim().length > 0 &&
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const attribution = attributionFromRequest(request, body)
    const client = clientContextFromRequest(request)

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: "Datos del formulario inválidos" }, { status: 400 })
    }

    if (!isValidOptionalUrl(body.websiteUrl)) {
      return NextResponse.json({ error: "Enlace de sitio web inválido" }, { status: 400 })
    }

    const payload: LeadFormPayload = {
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      companyName: body.companyName.trim(),
      phoneCountryCode: body.phoneCountryCode.trim(),
      phoneNumber: body.phoneNumber.replace(/\D/g, ""),
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

    const requestedTokenValue = (body as LeadFormPayload & { leadToken?: unknown }).leadToken
    const requestedToken = typeof requestedTokenValue === "string" ? requestedTokenValue.trim() : ""
    const existing = requestedToken
      ? await prisma.formSubmission.findUnique({
          where: { pdfToken: requestedToken },
          select: { id: true, pdfToken: true, status: true },
        })
      : null

    const pdfToken = existing?.status === "PARTIAL" ? existing.pdfToken : generatePdfToken()
    const classification = classifyLead({
      propertyCount: payload.propertyCount,
      revenueRange: payload.revenueRange,
      isTodero: payload.isTodero,
      usesAi: payload.usesAi,
      wantsToScale: payload.wantsToScale,
    })

    const contact = await upsertContactFromLead({
      fullName: payload.fullName,
      email: payload.email,
      phoneCountryCode: payload.phoneCountryCode,
      phoneNumber: payload.phoneNumber,
      companyName: payload.companyName,
      websiteUrl: payload.websiteUrl,
      instagramUrl: payload.instagramUrl,
    })

    const leadData = {
      fullName: payload.fullName,
      email: payload.email,
      companyName: payload.companyName,
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
      qualification: classification.qualification,
      qualificationScore: classification.qualificationScore,
      disqualificationReason: classification.disqualificationReason,
      scoreBreakdown: classification.scoreBreakdown ?? undefined,
      entrySource: "EBOOK" as const,
      status: "NEW" as const,
      contactId: contact.id,
    }

    const submission =
      existing?.status === "PARTIAL"
        ? await prisma.formSubmission.update({
            where: { id: existing.id },
            data: leadData,
          })
        : await prisma.formSubmission.create({
            data: {
              ...leadData,
              pdfToken,
            },
          })

    if (
      classification.qualification === "SQL" ||
      classification.qualification === "MQL"
    ) {
      try {
        await ensureNurturingPipeline(contact.id, classification.qualification)
      } catch (error) {
        console.error("[pipeline] no se pudo arrancar nutrición", error)
      }
    }

    const marketing = await recordMarketingStage({
      submissionId: submission.id,
      to: "LEAD_MAGNET_SENT",
      triggeredBy: MARKETING_TRIGGERED_BY.system,
      eventSourceUrl: `${getAppUrl()}/ebook`,
      attribution,
      client,
    })

    try {
      await markLandingConverted({
        visitorId: readVisitorId((body as { visitorId?: unknown }).visitorId),
        landingPath: "/ebook",
        conversion: "LEAD",
        attribution,
      })
    } catch (error) {
      console.error("[landing/visit] no se pudo marcar Lead", error)
    }

    if (process.env.RESEND_API_KEY) {
      const from = getResendFromAddress()
      const replyTo = process.env.NOTIFICATION_EMAIL || undefined

      const { error: notificationError } = await resend.emails.send({
        from,
        to: process.env.NOTIFICATION_EMAIL || "santiagov@example.com",
        subject: `Nueva descarga de guía: ${payload.fullName}`,
        html: `
          <h1>Nueva descarga de la guía</h1>
          <p><strong>Calificación:</strong> ${classification.qualification}${
            classification.qualificationScore != null
              ? ` · ${classification.qualificationScore} pts`
              : ""
          }${
            classification.disqualificationReason
              ? ` · ${classification.disqualificationReason}`
              : ""
          }</p>
          <h2>Información del lead</h2>
          <ul>
            ${formatLeadFormDataForEmail(payload)}
          </ul>
          <hr />
          <p><small>ID de solicitud: ${submission.id}</small></p>
        `,
      })

      if (notificationError) {
        console.error("Error enviando notificación interna:", notificationError)
      }

      const { error: confirmationError } = await sendLeadGuideEmail({
        fullName: payload.fullName,
        email: payload.email,
        downloadToken: pdfToken,
        replyTo,
      })

      if (confirmationError) {
        console.error("Error enviando confirmación al visitante:", confirmationError)
      }
    } else {
      console.warn("RESEND_API_KEY no configurada: se omitieron los correos de notificación.")
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
      token: pdfToken,
      qualification: classification.qualification,
      redirectTo: getLeadPostSubmitPath(classification.qualification, pdfToken),
      eventId: marketing?.eventId ?? null,
    })
  } catch (error) {
    console.error("Error processing form submission:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
