import type {
  ConversationMessage,
  FunnelOrigin,
  MarketingFunnelStage,
  MessageDirection,
  MessageStatus,
  MessageType,
  PipelineStage,
  PipelineState,
} from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import {
  getWhatsAppTemplate,
  isWhatsAppTemplateName,
} from "@/lib/whatsapp/templates"
import type { WhatsAppTemplateButton } from "@/lib/whatsapp/types"

export const FUNNEL_ORIGIN_LABEL: Record<FunnelOrigin, string> = {
  SQL: "SQL",
  MQL: "MQL",
  DIRECT_BOOKING: "Booking directo",
}

export const PIPELINE_STAGE_LABEL: Record<PipelineStage, string> = {
  NURTURING: "Nutrición",
  PRE_MEETING: "Pre-reunión",
  PRE_DEMO: "Pre-demo",
  POST_DEMO: "Post-demo",
}

export const PIPELINE_STATE_LABEL: Record<PipelineState, string> = {
  LEAD_MAGNET_DOWNLOADED: "Guía descargada",
  AWAITING_CONFIRMATION: "Esperando confirmación",
  QUALIFICATION_OFFERED: "Cualificación ofrecida",
  QUALIFYING_Q1: "Cualificación Q1",
  QUALIFYING_Q2: "Cualificación Q2",
  QUALIFYING_Q3: "Cualificación Q3",
  FIT_CONFIRMED: "Fit confirmado",
  DISQUALIFIED: "Descalificado",
  VIDEO_SENT: "Video enviado",
  CTA_SENT_SAW_VIDEO: "CTA (vio el video)",
  CTA_SENT_NO_VIDEO: "CTA (sin video)",
  LAST_NURTURE_SENT: "Última nutrición",
  COLD_CALL_QUEUED: "Cold call en cola",
  SCHEDULED: "Agendado",
  LOST: "Perdido",
  LONG_TERM_NURTURE: "Nurture a largo plazo",
  MEETING_SCHEDULED: "Reunión agendada",
  CONFIRMATION_SENT: "Confirmación enviada",
  REMINDER_48H: "Recordatorio 48h",
  REMINDER_24H: "Recordatorio 24h",
  REMINDER_8AM_DAY_OF: "Recordatorio 8am",
  REMINDER_30MIN: "Recordatorio 30 min",
  ATTENDED: "Asistió",
  NO_SHOW: "No-show",
  RESCHEDULE_OFFERED: "Reagendamiento ofrecido",
  DISCOVERY_COMPLETED: "Discovery completado",
  DISCOVERY_SUMMARY_SENT: "Resumen enviado",
  DEMO_CONFIRMATION_SENT: "Confirmación de demo",
  DEMO_REMINDER_48H: "Recordatorio demo 48h",
  DEMO_REMINDER_24H: "Recordatorio demo 24h",
  DEMO_REMINDER_8AM: "Recordatorio demo 8am",
  DEMO_REMINDER_30MIN: "Recordatorio demo 30 min",
  QUOTE_PRESENTED: "Cotización presentada",
  WON: "Ganado",
  FORMAL_PROPOSAL_SENT: "Propuesta formal",
  FOLLOWUP_48H: "Follow-up 48h",
  FOLLOWUP_5_7_DAYS: "Follow-up 5-7 días",
  CUTOFF_20_DAYS: "Corte 20 días",
}

export type ChatTemplateButton = {
  type: WhatsAppTemplateButton["type"]
  text: string
  url?: string
}

export type ChatMessageRecord = {
  id: string
  direction: MessageDirection
  type: MessageType
  body: string | null
  caption: string | null
  templateName: string | null
  templateFooter: string | null
  templateButtons: ChatTemplateButton[]
  buttonId: string | null
  pipelineState: PipelineState | null
  status: MessageStatus
  deliveryError: string | null
  mediaId: string | null
  mimeType: string | null
  mediaFilename: string | null
  hasMedia: boolean
  createdAt: string
}

export type ChatConversationSummary = {
  contactId: string
  conversationId: string
  fullName: string
  phoneE164: string
  funnelOrigin: FunnelOrigin | null
  currentState: PipelineState | null
  lastMessagePreview: string
  lastMessageAt: string | null
  lastDirection: MessageDirection | null
}

export type ChatContactRecord = {
  contactId: string
  fullName: string
  phoneE164: string
  email: string | null
  companyName: string | null
  funnelOrigin: FunnelOrigin | null
  currentStage: PipelineStage | null
  currentState: PipelineState | null
  meetingTime: string | null
  meetLink: string | null
  submissionId: string | null
  marketingFunnelStage: MarketingFunnelStage | null
}

export type ChatThreadRecord = {
  contact: ChatContactRecord
  messages: ChatMessageRecord[]
}

const CONTACT_INCLUDE = {
  pipeline: {
    select: {
      funnelOrigin: true,
      currentStage: true,
      currentState: true,
      meetingTime: true,
      meetLink: true,
    },
  },
  submissions: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
    select: { id: true, marketingFunnelStage: true },
  },
}

function previewMessage(message: ConversationMessage | null) {
  if (!message) return "Sin mensajes"
  if (message.type === "BUTTON" || message.type === "INTERACTIVE") {
    return `Tocó: ${message.body || message.buttonId || "botón"}`
  }
  if (message.type === "AUDIO") return "Audio"
  if (message.type === "IMAGE") return message.caption || "Imagen"
  if (message.type === "VIDEO") return message.caption || "Video"
  if (message.type === "DOCUMENT") return message.mediaFilename || message.caption || "Documento"
  if (message.type === "STICKER") return "Sticker"
  if (message.type === "LOCATION") return message.body || "Ubicación"
  if (message.type === "TEMPLATE") {
    return message.body || (message.templateName ? `Plantilla ${message.templateName}` : "Plantilla")
  }
  return message.body?.trim() || "Mensaje"
}

function templateMeta(templateName: string | null) {
  if (!templateName || !isWhatsAppTemplateName(templateName)) {
    return { footer: null as string | null, buttons: [] as ChatTemplateButton[] }
  }
  const template = getWhatsAppTemplate(templateName) as {
    footer?: string
    buttons: readonly WhatsAppTemplateButton[]
  }
  return {
    footer: template.footer ?? null,
    buttons: template.buttons.map((button) => ({
      type: button.type,
      text: button.text,
      url: button.type === "URL" ? button.url : undefined,
    })),
  }
}

function deliveryError(rawPayload: unknown) {
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) return null
  const payload = rawPayload as {
    error?: unknown
    webhookErrors?: Array<{
      code?: unknown
      title?: unknown
      message?: unknown
      error_data?: { details?: unknown }
    }> | null
  }
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error

  const first = payload.webhookErrors?.[0]
  if (!first) return null
  const details =
    typeof first.error_data?.details === "string" ? first.error_data.details : null
  const message = typeof first.message === "string" ? first.message : null
  const title = typeof first.title === "string" ? first.title : null
  const code = typeof first.code === "number" ? `Código ${first.code}` : null
  return [details, message, title, code].filter(Boolean).join(" · ") || "WhatsApp no entregó el mensaje"
}

export function toChatMessageRecord(message: ConversationMessage): ChatMessageRecord {
  const template = templateMeta(message.templateName)
  return {
    id: message.id,
    direction: message.direction,
    type: message.type,
    body: message.body,
    caption: message.caption,
    templateName: message.templateName,
    templateFooter: template.footer,
    templateButtons: template.buttons,
    buttonId: message.buttonId,
    pipelineState: message.pipelineState,
    status: message.status,
    deliveryError: deliveryError(message.rawPayload),
    mediaId: message.mediaId,
    mimeType: message.mimeType,
    mediaFilename: message.mediaFilename,
    hasMedia: Boolean(message.mediaId),
    createdAt: message.createdAt.toISOString(),
  }
}

function toContactRecord(contact: {
  id: string
  fullName: string
  phoneE164: string
  email: string | null
  companyName: string | null
  pipeline: {
    funnelOrigin: FunnelOrigin
    currentStage: PipelineStage
    currentState: PipelineState
    meetingTime: Date | null
    meetLink: string | null
  } | null
  submissions: Array<{ id: string; marketingFunnelStage: MarketingFunnelStage | null }>
}): ChatContactRecord {
  const submission = contact.submissions[0]
  return {
    contactId: contact.id,
    fullName: contact.fullName,
    phoneE164: contact.phoneE164,
    email: contact.email,
    companyName: contact.companyName,
    funnelOrigin: contact.pipeline?.funnelOrigin ?? null,
    currentStage: contact.pipeline?.currentStage ?? null,
    currentState: contact.pipeline?.currentState ?? null,
    meetingTime: contact.pipeline?.meetingTime?.toISOString() ?? null,
    meetLink: contact.pipeline?.meetLink ?? null,
    submissionId: submission?.id ?? null,
    marketingFunnelStage: submission?.marketingFunnelStage ?? null,
  }
}

export async function listChatConversations(): Promise<ChatConversationSummary[]> {
  const conversations = await prisma.conversation.findMany({
    where: { channel: "WHATSAPP" },
    orderBy: { updatedAt: "desc" },
    include: {
      contact: { include: CONTACT_INCLUDE },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  return conversations.map((conversation) => {
    const last = conversation.messages[0] ?? null
    return {
      contactId: conversation.contactId,
      conversationId: conversation.id,
      fullName: conversation.contact.fullName,
      phoneE164: conversation.contact.phoneE164,
      funnelOrigin: conversation.contact.pipeline?.funnelOrigin ?? null,
      currentState: conversation.contact.pipeline?.currentState ?? null,
      lastMessagePreview: previewMessage(last),
      lastMessageAt: last?.createdAt.toISOString() ?? conversation.updatedAt.toISOString(),
      lastDirection: last?.direction ?? null,
    }
  })
}

export async function getChatThread(contactId: string): Promise<ChatThreadRecord | null> {
  const conversation = await prisma.conversation.findUnique({
    where: {
      contactId_channel: {
        contactId,
        channel: "WHATSAPP",
      },
    },
    include: {
      contact: { include: CONTACT_INCLUDE },
      messages: {
        where: { type: { not: "STATUS" } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!conversation) return null

  return {
    contact: toContactRecord(conversation.contact),
    messages: conversation.messages.map(toChatMessageRecord),
  }
}

export async function getChatMessageForMedia(messageId: string) {
  return prisma.conversationMessage.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      mediaId: true,
      mimeType: true,
      mediaFilename: true,
    },
  })
}
