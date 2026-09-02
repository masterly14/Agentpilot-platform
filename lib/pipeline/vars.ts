import type { Contact, LeadPipeline } from "@/prisma/generated/client"
import type { WhatsAppNamedParam } from "@/lib/whatsapp/types"
import { firstNameFromFullName } from "@/lib/whatsapp/phone"
import { getAppUrl, getAgendarUrl, getSqlDiagnosticoUrl } from "@/lib/ebook/app-url"
import { prisma } from "@/lib/prisma"

const TIMEZONE = "America/Bogota"
const WHATSAPP_PARAM_MAX = 80

function sanitizeWhatsAppParam(value: string, max = WHATSAPP_PARAM_MAX) {
  const oneLine = value.replace(/\s+/g, " ").trim().replace(/[.,;:]+$/u, "")
  if (oneLine.length <= max) return oneLine
  const comma = oneLine.slice(0, max).lastIndexOf(",")
  const cut = comma >= 24 ? comma : max
  return oneLine.slice(0, cut).trim()
}

export function formatMeetingParts(meetingTime: Date, timeZone = TIMEZONE) {
  const dateFmt = new Intl.DateTimeFormat("es-CO", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  const timeFmt = new Intl.DateTimeFormat("es-CO", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  return {
    fecha: dateFmt.format(meetingTime),
    hora: timeFmt.format(meetingTime),
  }
}

export function getVideoTrackingUrl(token: string) {
  return `${getAppUrl()}/api/pipeline/video?token=${encodeURIComponent(token)}`
}

export async function buildTemplateVars(
  contact: Contact,
  pipeline: LeadPipeline,
  params: readonly WhatsAppNamedParam[],
  state = pipeline.currentState,
) {
  const submission = await prisma.formSubmission.findFirst({
    where: { contactId: contact.id },
    orderBy: { createdAt: "desc" },
    select: { pdfToken: true },
  })

  const token = submission?.pdfToken ?? ""
  const bookingLink =
    pipeline.funnelOrigin === "SQL" && token
      ? getSqlDiagnosticoUrl(token)
      : token
        ? getAgendarUrl(token)
        : `${getAppUrl()}/diagnostico`

  const meeting = pipeline.meetingTime
    ? formatMeetingParts(pipeline.meetingTime, pipeline.visitorTimezone || TIMEZONE)
    : null
  const values: Partial<Record<WhatsAppNamedParam, string>> = {
    nombre: firstNameFromFullName(contact.fullName),
    fecha: meeting?.fecha,
    hora: meeting?.hora,
    link: pipeline.meetLink || bookingLink,
    dolor: sanitizeWhatsAppParam(pipeline.painPoint || "tus cuellos de botella operativos"),
  }

  if (state === "VIDEO_SENT") {
    values.link = token ? getVideoTrackingUrl(token) : bookingLink
  }

  if (
    state === "CTA_SENT_SAW_VIDEO" ||
    state === "CTA_SENT_NO_VIDEO" ||
    state === "LAST_NURTURE_SENT" ||
    state === "RESCHEDULE_OFFERED"
  ) {
    values.link = bookingLink
  }

  if (state === "REMINDER_30MIN" || state === "DEMO_REMINDER_30MIN") {
    values.link = pipeline.meetLink || bookingLink
  }

  const missing = params.filter((param) => !values[param])
  if (missing.length) {
    throw new Error(`Faltan variables de plantilla: ${missing.join(", ")}`)
  }

  return values as Record<WhatsAppNamedParam, string>
}
