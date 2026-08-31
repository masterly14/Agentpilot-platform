import { z } from "zod"
import { findNearbyRescheduleSlots, preferredWindowFromText, type ReschedulePreference } from "@/lib/booking/reschedule-slots"
import { parseBookingDateTime } from "@/lib/booking/datetime"
import { commitMeetingReschedule } from "@/lib/pipeline/commit-reschedule"
import { prisma } from "@/lib/prisma"
import { getMastra, isOpenAiConfigured } from "@/lib/agents/mastra"
import { rescheduleAgent } from "@/lib/agents/mastra/agents/reschedule"
import { sendWhatsAppInteractiveButtons, sendWhatsAppTemplateToNumber } from "@/lib/whatsapp/send-template"
import { formatMeetingParts } from "@/lib/pipeline/vars"
import { persistConversationMessage } from "@/lib/pipeline/conversation"
import { resend } from "@/lib/resend"
import { getResendFromAddress } from "@/lib/email"

const intentSchema = z.object({
  intent: z.enum(["reschedule", "confirm", "other", "preference", "unknown"]),
  proposedSlot: z.string().optional(),
  preference: z.enum(["morning", "afternoon", "any"]).optional(),
  avoidWindow: z.enum(["morning", "afternoon"]).optional(),
})

type RescheduleContext = {
  status: "active" | "awaiting_preference" | "awaiting_slot_confirm" | "completed" | "paused"
  preference?: ReschedulePreference
  offeredSlot?: string
  offeredHistory?: string[]
}

export function isRescheduleMessage(body?: string, buttonId?: string) {
  if (buttonId?.startsWith("reschedule_")) return true
  return /\b(reagend|reprogram|no (puedo|voy a poder)|otro d[ií]a|cambiar (la )?hora|me surgi[oó]|imprevisto)\b/i.test(body ?? "")
}

function contextFrom(value: unknown): RescheduleContext {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as RescheduleContext
    : { status: "active" }
}

function fallbackIntent(message: string, buttonId?: string): z.infer<typeof intentSchema> {
  if (buttonId === "reschedule_confirm") return { intent: "confirm" }
  if (buttonId === "reschedule_other") return { intent: "other" }
  if (buttonId === "reschedule_morning") return { intent: "preference", preference: "morning" }
  if (buttonId === "reschedule_afternoon") return { intent: "preference", preference: "afternoon" }
  if (/\b(s[ií],?\s*(me )?queda bien|confirmo|perfecto)\b/i.test(message)) return { intent: "confirm" }
  if (/\b(otro horario|otra hora|mu[ée]strame otra|no me queda)\b/i.test(message)) return { intent: "other" }
  const window = preferredWindowFromText(message)
  return {
    intent: "reschedule",
    preference: window,
    avoidWindow: window === "morning" || window === "afternoon" ? window : undefined,
  }
}

async function extractIntent(message: string, buttonId?: string) {
  const fallback = fallbackIntent(message, buttonId)
  if (fallback.intent !== "reschedule") return fallback
  if (!isOpenAiConfigured()) return fallback
  try {
    const agent = getMastra().getAgentById?.("reschedule-agent") ?? rescheduleAgent
    const response = await agent.generate(
      `Analiza este mensaje de WhatsApp para una reprogramación. Devuelve JSON.
Mensaje: ${message}
Botón: ${buttonId ?? "ninguno"}
Una hora propuesta solo es válida si puedes expresarla como YYYY-MM-DDTHH:mm:ss en hora de Bogotá; si falta fecha, omítela.`,
      { structuredOutput: { schema: intentSchema } },
    )
    return intentSchema.parse(response.object)
  } catch {
    return fallback
  }
}

async function notifyOwner(contactId: string, meetingTime: Date) {
  const ownerPhone = process.env.WHATSAPP_OWNER_PHONE?.trim()
  const [pipeline, submission] = await Promise.all([
    prisma.leadPipeline.findUniqueOrThrow({ where: { contactId }, include: { contact: true } }),
    prisma.formSubmission.findFirst({ where: { contactId }, orderBy: { createdAt: "desc" } }),
  ])
  const meeting = formatMeetingParts(meetingTime, pipeline.visitorTimezone ?? undefined)
  const summary = [
    submission?.companyName || pipeline.contact.companyName,
    submission?.propertyCount ? `Propiedades: ${submission.propertyCount}` : null,
    submission?.usesPms ? `PMS: ${submission.usesPms}` : null,
    pipeline.painPoint,
  ].filter(Boolean).join(" · ").slice(0, 250)
  const vars = {
    nombre: pipeline.contact.fullName,
    fecha: meeting.fecha,
    hora: meeting.hora,
    resumen: summary || "Sin resumen adicional",
  }
  try {
    if (!ownerPhone) throw new Error("WHATSAPP_OWNER_PHONE vacío")
    await sendWhatsAppTemplateToNumber("ap_owner_meeting_rescheduled", ownerPhone, vars)
    await persistConversationMessage({
      contactId,
      direction: "SYSTEM",
      type: "TEMPLATE",
      body: "Santiago notificado por WhatsApp de la reprogramación.",
      pipelineState: pipeline.currentState,
      status: "SENT",
    })
  } catch (error) {
    const email = process.env.NOTIFICATION_EMAIL?.trim()
    if (!email || !process.env.RESEND_API_KEY) {
      console.warn("[reschedule] no se pudo notificar al owner", error)
      return
    }
    await resend.emails.send({
      from: getResendFromAddress(),
      to: email,
      subject: `Reunión reprogramada: ${pipeline.contact.fullName}`,
      text: `La reunión se reprogramó para ${meeting.fecha} a las ${meeting.hora}.\n\n${vars.resumen}`,
    })
  }
}

export async function processRescheduleTurn(input: { contactId: string; body?: string; buttonId?: string }) {
  const pipeline = await prisma.leadPipeline.findUniqueOrThrow({
    where: { contactId: input.contactId },
    include: { contact: true },
  })
  const context = contextFrom(pipeline.rescheduleContext)
  const extracted = await extractIntent(input.body ?? "", input.buttonId)
  const preference = extracted.preference ?? context.preference ?? "any"

  if (extracted.intent === "confirm" && context.offeredSlot) {
    const updated = await commitMeetingReschedule({
      contactId: input.contactId,
      meetingTime: parseBookingDateTime(context.offeredSlot),
    })
    await prisma.leadPipeline.update({
      where: { id: updated.id },
      data: { rescheduleContext: { ...context, status: "completed" } },
    })
    await notifyOwner(input.contactId, parseBookingDateTime(context.offeredSlot))
    return { status: "scheduled" as const }
  }

  const proposed = extracted.proposedSlot
  if (proposed) {
    const slots = await findNearbyRescheduleSlots({ fromDate: proposed.slice(0, 10), daysToSearch: 1 })
    if (slots.some((slot) => slot.start === proposed)) {
      const updated = await commitMeetingReschedule({
        contactId: input.contactId,
        meetingTime: parseBookingDateTime(proposed),
      })
      await prisma.leadPipeline.update({
        where: { id: updated.id },
        data: { rescheduleContext: { ...context, status: "completed" } },
      })
      await notifyOwner(input.contactId, parseBookingDateTime(proposed))
      return { status: "scheduled" as const }
    }
  }

  const slots = await findNearbyRescheduleSlots({
    preference,
    avoidWindow: extracted.avoidWindow,
    excludeStarts: context.offeredHistory,
  })
  if (!slots.length) {
    await sendWhatsAppInteractiveButtons({
      contact: pipeline.contact,
      body: "Esta semana no me quedan espacios que cumplan esas condiciones. ¿Prefieres que busquemos en la mañana o en la tarde?",
      buttons: [{ id: "reschedule_morning", title: "En la mañana" }, { id: "reschedule_afternoon", title: "En la tarde" }],
      pipelineState: "NEED_RESCHEDULE",
    })
    return { status: "awaiting_preference" as const }
  }
  const offered = slots[0]
  await prisma.leadPipeline.update({
    where: { id: pipeline.id },
    data: { rescheduleContext: { ...context, status: "awaiting_slot_confirm", preference, offeredSlot: offered.start, offeredHistory: [...(context.offeredHistory ?? []), offered.start] } },
  })
  await sendWhatsAppInteractiveButtons({
    contact: pipeline.contact,
    body: `Tengo disponible el ${offered.start.slice(0, 10)} a las ${offered.label12h}. ¿Te queda bien?`,
    buttons: [{ id: "reschedule_confirm", title: "Sí, queda bien" }, { id: "reschedule_other", title: "Otro horario" }],
    pipelineState: "NEED_RESCHEDULE",
  })
  return { status: "offered" as const, slot: offered.start }
}
