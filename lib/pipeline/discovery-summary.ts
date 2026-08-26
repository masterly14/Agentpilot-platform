import { z } from "zod"
import type { Contact, LeadPipeline, Prisma } from "@/prisma/generated/client"
import { getMastra, isOpenAiConfigured } from "@/lib/agents/mastra"
import { discoverySummaryAgent } from "@/lib/agents/mastra/agents/discovery-summary"
import { loadProductKnowledge } from "@/lib/agents/mastra/tools/product-knowledge"
import type { FathomMeeting } from "@/lib/fathom/payload"
import { formatMeetingTranscript } from "@/lib/fathom/transcript"
import { prisma } from "@/lib/prisma"
import { formatMeetingParts } from "@/lib/pipeline/vars"
import { firstNameFromFullName } from "@/lib/whatsapp/phone"
import { sendWhatsAppText } from "@/lib/whatsapp/send-template"
import { schedulePipelineJob } from "@/lib/pipeline/schedule"
import { isQstashConfigured } from "@/lib/qstash/client"

export const DISCOVERY_SUMMARY_DELAY_MS = 2 * 60 * 60 * 1000

export const discoverySummarySchema = z.object({
  outcome: z.enum(["demo_booked", "fit_no_demo", "no_fit"]),
  dolores: z.array(z.string()).max(4),
  dolor: z.string(),
  fecha: z.string().optional(),
  hora: z.string().optional(),
  noFitReason: z.string().optional(),
})

export type DiscoverySummaryDraft = z.infer<typeof discoverySummarySchema>
export type DiscoverySummaryOutcome = DiscoverySummaryDraft["outcome"]

const SKIP_STATES = new Set([
  "DISCOVERY_COMPLETED",
  "DISCOVERY_SUMMARY_SENT",
  "DEMO_CONFIRMATION_SENT",
  "DEMO_REMINDER_48H",
  "DEMO_REMINDER_24H",
  "DEMO_REMINDER_8AM",
  "DEMO_REMINDER_30MIN",
  "QUOTE_PRESENTED",
  "WON",
  "FORMAL_PROPOSAL_SENT",
  "LOST",
  "DISQUALIFIED",
])

export function parseDiscoverySummary(value: unknown): DiscoverySummaryDraft | null {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  const parsed = discoverySummarySchema.safeParse(record.discoverySummary)
  return parsed.success ? parsed.data : null
}

export function withDiscoverySummary(
  current: unknown,
  draft: DiscoverySummaryDraft,
): Prisma.InputJsonValue {
  const base =
    current && typeof current === "object" && !Array.isArray(current)
      ? { ...(current as Record<string, unknown>) }
      : {}
  return { ...base, discoverySummary: draft } as Prisma.InputJsonValue
}

export function formatDoloresLines(dolores: string[]) {
  return dolores
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const text = item.replace(/^["«“”]+|["«“”]+$/g, "").trim()
      return `• “${text}”`
    })
    .join("\n")
}

export function buildDiscoverySummaryMessage(input: {
  nombre: string
  outcome: DiscoverySummaryOutcome
  dolores: string[]
  fecha?: string
  hora?: string
}) {
  const { nombre, outcome } = input

  if (outcome === "no_fit") {
    return [
      `Hola ${nombre} 👋 Gracias por el tiempo de hoy.`,
      "",
      "Con lo que me contaste hoy, no creo que seamos el mejor aliado para tu operación ahora mismo.",
      "",
      "Te dejo la puerta abierta si más adelante cambia el tamaño o el momento. ¡Éxitos!",
    ].join("\n")
  }

  const dolores = formatDoloresLines(input.dolores)
  const recap = [
    `Hola ${nombre} 👋 Gracias por el tiempo de hoy.`,
    "",
    "Quedé con esto de tu operación, en tus palabras:",
    "",
    dolores,
  ]

  if (outcome === "demo_booked" && input.fecha && input.hora) {
    return [
      ...recap,
      "",
      "Próximo paso: te muestro cómo resolverlo en una demo aterrizada.",
      "",
      `Nos vemos el ${input.fecha} a las ${input.hora}.`,
      "",
      "Si alguien más decide contigo, súmalo a esa llamada.",
    ].join("\n")
  }

  return recap.join("\n")
}

function meetingSendAt(meeting: FathomMeeting, now = new Date()) {
  const end = meeting.recording_end_time || meeting.scheduled_end_time
  const endedAt = end ? new Date(end) : now
  const sendAt = new Date(endedAt.getTime() + DISCOVERY_SUMMARY_DELAY_MS)
  return Number.isNaN(sendAt.getTime()) ? new Date(now.getTime() + DISCOVERY_SUMMARY_DELAY_MS) : sendAt
}

function inviteeEmails(meeting: FathomMeeting) {
  const recorder = meeting.recorded_by.email.trim().toLowerCase()
  const emails = meeting.calendar_invitees
    .filter((person) => person.is_external !== false)
    .map((person) => person.email?.trim().toLowerCase())
    .filter((email): email is string => Boolean(email) && email !== recorder)
  return [...new Set(emails)]
}

export async function findContactForMeeting(meeting: FathomMeeting) {
  const emails = inviteeEmails(meeting)
  if (emails.length) {
    const contacts = await prisma.contact.findMany({
      where: {
        OR: emails.map((email) => ({
          email: { equals: email, mode: "insensitive" as const },
        })),
      },
      include: { pipeline: true },
    })
    const ranked = contacts.sort((a, b) => {
      const score = (contact: (typeof contacts)[number]) => {
        const state = contact.pipeline?.currentState
        if (state === "ATTENDED") return 3
        if (contact.pipeline?.currentStage === "PRE_MEETING") return 2
        if (contact.pipeline) return 1
        return 0
      }
      return score(b) - score(a)
    })
    if (ranked[0]) return ranked[0]
  }

  const startRaw = meeting.scheduled_start_time || meeting.recording_start_time
  if (!startRaw) return null
  const start = new Date(startRaw)
  if (Number.isNaN(start.getTime())) return null

  const windowMs = 2 * 60 * 60 * 1000
  const pipeline = await prisma.leadPipeline.findFirst({
    where: {
      meetingTime: {
        gte: new Date(start.getTime() - windowMs),
        lte: new Date(start.getTime() + windowMs),
      },
      currentStage: { in: ["PRE_MEETING", "PRE_DEMO"] },
    },
    include: { contact: true },
    orderBy: { updatedAt: "desc" },
  })

  return pipeline?.contact ? { ...pipeline.contact, pipeline } : null
}

export async function extractDiscoverySummary(meeting: FathomMeeting): Promise<DiscoverySummaryDraft> {
  const transcript = formatMeetingTranscript(meeting)
  if (!transcript) {
    throw new Error("La reunión no trae transcripción para el resumen")
  }

  const productKnowledge = await loadProductKnowledge()
  const attendees = meeting.calendar_invitees
    .map((person) => {
      const role = person.is_external ? "externo" : "interno"
      return `- ${person.name || person.email || "sin nombre"} (${role}) ${person.email || ""}`
    })
    .join("\n")

  const prompt = `Extrae el follow-up post-diagnóstico.

## Meta
Título: ${meeting.meeting_title || meeting.title}
Grabó: ${meeting.recorded_by.name} <${meeting.recorded_by.email}>
Resumen Fathom:
${meeting.default_summary?.markdown_formatted || "(sin resumen)"}

Participantes:
${attendees || "(sin invitados)"}

## Ficha de producto (Confluence)
${productKnowledge}

## Transcripción
${transcript}

Devuelve el JSON estructurado. Citas reales. No inventes la demo si no se agendó.`

  const agent = getMastra().getAgentById?.("discovery-summary") ?? discoverySummaryAgent
  const response = await agent.generate(prompt, {
    structuredOutput: { schema: discoverySummarySchema },
  })
  const parsed = discoverySummarySchema.safeParse(response.object)
  if (!parsed.success) {
    throw new Error("El modelo no devolvió un resumen de discovery válido")
  }

  const draft = parsed.data
  if (draft.outcome === "demo_booked" && (!draft.fecha?.trim() || !draft.hora?.trim())) {
    return { ...draft, outcome: "fit_no_demo", fecha: undefined, hora: undefined }
  }
  return draft
}

export async function sendDiscoverySummaryMessage(input: {
  contact: Contact
  pipeline: LeadPipeline
}) {
  const pipeline = await prisma.leadPipeline.findUniqueOrThrow({
    where: { id: input.pipeline.id },
  })
  const draft = parseDiscoverySummary(pipeline.qualificationAnswers)
  if (!draft) {
    console.warn("[pipeline] no hay draft de resumen discovery", input.contact.id)
    return { skipped: true as const, reason: "no_draft" as const }
  }

  if (draft.outcome !== "no_fit" && draft.dolores.length === 0) {
    console.warn("[pipeline] resumen discovery sin dolores", input.contact.id, draft.outcome)
    return { skipped: true as const, reason: "no_pains" as const }
  }

  const meeting = pipeline.meetingTime ? formatMeetingParts(pipeline.meetingTime) : null
  const meetingIsFuture =
    pipeline.meetingTime != null && pipeline.meetingTime.getTime() > Date.now() + 15 * 60 * 1000

  let outcome = draft.outcome
  const fecha = draft.fecha?.trim() || (meetingIsFuture ? meeting?.fecha : undefined)
  const hora = draft.hora?.trim() || (meetingIsFuture ? meeting?.hora : undefined)
  if (outcome === "demo_booked" && (!fecha || !hora)) {
    outcome = "fit_no_demo"
  }

  const body = buildDiscoverySummaryMessage({
    nombre: firstNameFromFullName(input.contact.fullName),
    outcome,
    dolores: draft.dolores,
    fecha,
    hora,
  })

  const sent = await sendWhatsAppText({
    contact: input.contact,
    body,
    pipelineState: "DISCOVERY_SUMMARY_SENT",
  })

  return { skipped: false as const, messageId: sent.messageId, outcome }
}

export async function processDiscoveryFollowup(meeting: FathomMeeting) {
  if (!meeting.transcript?.length) {
    return { skipped: "no_transcript" as const }
  }
  if (!isOpenAiConfigured()) {
    return { skipped: "no_openai" as const }
  }

  const matched = await findContactForMeeting(meeting)
  if (!matched?.pipeline) {
    console.info("[pipeline] discovery followup sin contacto", {
      recordingId: meeting.recording_id,
      title: meeting.meeting_title || meeting.title,
    })
    return { skipped: "no_contact" as const }
  }

  const pipeline = matched.pipeline
  if (
    SKIP_STATES.has(pipeline.currentState) ||
    pipeline.currentStage === "PRE_DEMO" ||
    pipeline.currentStage === "POST_DEMO"
  ) {
    return { skipped: "already_processed" as const, contactId: matched.id }
  }

  const draft = await extractDiscoverySummary(meeting)
  await prisma.leadPipeline.update({
    where: { id: pipeline.id },
    data: {
      painPoint: draft.dolor.trim() || "tus cuellos de botella operativos",
      qualificationAnswers: withDiscoverySummary(pipeline.qualificationAnswers, draft),
    },
  })

  const { transitionPipeline } = await import("@/lib/pipeline/engine")
  await transitionPipeline({
    contactId: matched.id,
    toState: "DISCOVERY_COMPLETED",
  })

  const sendAt = meetingSendAt(meeting)
  const shouldSendNow = sendAt.getTime() <= Date.now() + 15_000 || !isQstashConfigured()

  if (shouldSendNow) {
    await transitionPipeline({
      contactId: matched.id,
      toState: "DISCOVERY_SUMMARY_SENT",
    })
    return { skipped: false as const, contactId: matched.id, outcome: draft.outcome, sent: true }
  }

  const refreshed = await prisma.leadPipeline.findUniqueOrThrow({
    where: { id: pipeline.id },
    select: { id: true, contactId: true },
  })
  await schedulePipelineJob({
    pipelineId: refreshed.id,
    contactId: refreshed.contactId,
    expectedState: "DISCOVERY_SUMMARY_SENT",
    notBefore: sendAt,
  })

  return {
    skipped: false as const,
    contactId: matched.id,
    outcome: draft.outcome,
    sent: false,
    sendAt: sendAt.toISOString(),
  }
}
