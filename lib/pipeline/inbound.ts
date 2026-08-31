import type { Contact, LeadPipeline, MessageType, PipelineState, Prisma } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { persistConversationMessage, updateMessageStatus } from "@/lib/pipeline/conversation"
import { findContactByWaId, linkContactWaId } from "@/lib/pipeline/contact"
import {
  markVideoWatched,
  scheduleFollowupAfterMessageDelivery,
  transitionPipeline,
} from "@/lib/pipeline/engine"
import { notifyNurtureHandoff } from "@/lib/pipeline/notify"
import {
  buildNurtureReply,
  detectReplyIntent,
  loadNurtureReplyVars,
} from "@/lib/pipeline/replies"
import {
  mergeQualificationAnswer,
  normalizeButtonAction,
} from "@/lib/pipeline/transitions"
import { hasLowPropertyFit, parseQualificationAnswers } from "@/lib/pipeline/qualify-mql"
import { sendWhatsAppText } from "@/lib/whatsapp/send-template"
import { PIPELINE_INBOUND_TYPES } from "@/lib/whatsapp/webhook"
import { isRescheduleMessage, processRescheduleTurn } from "@/lib/pipeline/reschedule-agent"
import { getPipelineBaseUrl, getQstashClient, isQstashConfigured } from "@/lib/qstash/client"

type InboundMessage = {
  waId: string
  waMessageId: string
  profileName?: string
  body?: string
  buttonId?: string
  type: MessageType
  mediaId?: string
  mimeType?: string
  mediaFilename?: string
  caption?: string
  raw: Prisma.InputJsonValue
  phoneNumberId?: string
}

export async function handleInboundWhatsApp(message: InboundMessage) {
  const duplicate = await prisma.conversationMessage.findUnique({
    where: { waMessageId: message.waMessageId },
  })
  if (duplicate) return duplicate
  let contact = await findContactByWaId(message.waId)
  if (!contact) {
    contact = await prisma.contact.create({
      data: {
        fullName: message.profileName || `WhatsApp ${message.waId}`,
        phoneE164: message.waId,
        waId: message.waId,
        phoneCountryCode: "+",
        phoneNumber: message.waId,
      },
    })
  } else if (!contact.waId) {
    contact = await linkContactWaId(contact.id, message.waId)
  }

  const saved = await persistConversationMessage({
    contactId: contact.id,
    direction: "INBOUND",
    type: message.type,
    body: message.body ?? message.caption ?? null,
    buttonId: message.buttonId ?? null,
    waMessageId: message.waMessageId,
    rawPayload: message.raw,
    waPhoneNumberId: message.phoneNumberId,
    mediaId: message.mediaId ?? null,
    mimeType: message.mimeType ?? null,
    mediaFilename: message.mediaFilename ?? null,
    caption: message.caption ?? null,
  })

  if (!PIPELINE_INBOUND_TYPES.has(message.type)) return saved

  const pipeline = await prisma.leadPipeline.findUnique({
    where: { contactId: contact.id },
  })
  if (!pipeline) return saved

  const rescheduleSession =
    pipeline.currentState === "NEED_RESCHEDULE" &&
    pipeline.rescheduleContext &&
    typeof pipeline.rescheduleContext === "object"
  const rescheduleEligible =
    pipeline.currentStage === "PRE_MEETING" || pipeline.currentStage === "PRE_DEMO"
  if (rescheduleEligible && (rescheduleSession || isRescheduleMessage(message.body, message.buttonId))) {
    if (pipeline.currentState !== "NEED_RESCHEDULE") {
      await transitionPipeline({
        contactId: contact.id,
        toState: "NEED_RESCHEDULE",
        extra: { rescheduleContext: { status: "active" } },
      })
    }
    const payload = { contactId: contact.id, body: message.body, buttonId: message.buttonId }
    if (isQstashConfigured()) {
      const qstash = getQstashClient()
      await qstash?.publishJSON({
        url: `${getPipelineBaseUrl()}/api/pipeline/reschedule-agent`,
        body: payload,
      })
    } else {
      await processRescheduleTurn(payload)
    }
    return saved
  }

  if (pipeline.currentStage !== "NURTURING") return saved

  const action = message.buttonId
    ? normalizeButtonAction(message.buttonId)
    : message.body
      ? normalizeButtonAction(message.body)
      : null

  if (pipeline.currentState === "QUALIFICATION_OFFERED" && action === "qualify_now") {
    await transitionPipeline({ contactId: contact.id, toState: "QUALIFYING_Q1" })
    return saved
  }

  if (pipeline.currentState === "QUALIFICATION_OFFERED" && action === "book_direct") {
    await transitionPipeline({ contactId: contact.id, toState: "FIT_CONFIRMED" })
    return saved
  }

  if (
    pipeline.currentState === "QUALIFYING_Q1" ||
    pipeline.currentState === "QUALIFYING_Q2" ||
    pipeline.currentState === "QUALIFYING_Q3"
  ) {
    const answer = message.body?.trim()
    if (!answer) return saved
    await handleQualificationReply(contact.id, pipeline.currentState, answer)
    return saved
  }

  await handleNurtureReply(contact, pipeline, message.buttonId, message.body)
  return saved
}

async function handleNurtureReply(
  contact: Contact,
  pipeline: LeadPipeline,
  buttonId?: string,
  body?: string,
) {
  const hasSignal = Boolean(buttonId?.trim() || body?.trim())
  if (!hasSignal) return

  const intent = detectReplyIntent(buttonId, body)
  const vars = await loadNurtureReplyVars(contact, pipeline)
  const reply = buildNurtureReply({
    state: pipeline.currentState,
    origin: pipeline.funnelOrigin,
    intent,
    vars,
  })
  if (!reply) return

  try {
    await sendWhatsAppText({
      contact,
      body: reply.body,
      pipelineState: pipeline.currentState,
    })
  } catch (error) {
    console.error("[pipeline] fallo respuesta inbound", pipeline.currentState, contact.id, error)
  }

  if (reply.effect === "lost") {
    await transitionPipeline({ contactId: contact.id, toState: "LOST" })
    return
  }
  if (reply.effect === "video_watched") {
    await markVideoWatched(contact.id)
    return
  }
  if (reply.effect === "notify") {
    await notifyNurtureHandoff({
      contactName: contact.fullName,
      phone: contact.phoneE164,
      state: pipeline.currentState,
      intent,
      message: body ?? null,
    })
  }
}

async function handleQualificationReply(
  contactId: string,
  state: PipelineState,
  answer: string,
) {
  const pipeline = await prisma.leadPipeline.findUniqueOrThrow({
    where: { contactId },
  })
  const current = parseQualificationAnswers(pipeline.qualificationAnswers)
  const nextAnswers = mergeQualificationAnswer(current, state, answer)

  await prisma.leadPipeline.update({
    where: { id: pipeline.id },
    data: { qualificationAnswers: nextAnswers },
  })

  if (state === "QUALIFYING_Q1") {
    await transitionPipeline({ contactId, toState: "QUALIFYING_Q2" })
    return
  }
  if (state === "QUALIFYING_Q2") {
    await transitionPipeline({ contactId, toState: "QUALIFYING_Q3" })
    return
  }

  const properties = nextAnswers.properties ?? ""
  if (hasLowPropertyFit(properties)) {
    await transitionPipeline({ contactId, toState: "DISQUALIFIED" })
    return
  }

  await transitionPipeline({ contactId, toState: "FIT_CONFIRMED" })
}

const STATUS_MAP = {
  sent: "SENT",
  delivered: "DELIVERED",
  read: "READ",
  failed: "FAILED",
} as const

export async function handleWhatsAppStatus(
  waMessageId: string,
  status: string,
  errors?: Array<{ code?: number; title?: string; message?: string; error_data?: { details?: string } }>,
) {
  const mapped = STATUS_MAP[status as keyof typeof STATUS_MAP]
  if (!mapped) return
  if (mapped === "FAILED") {
    console.error("[whatsapp] entrega fallida", { waMessageId, errors })
  } else {
    console.info("[whatsapp] status", { waMessageId, status: mapped })
  }
  await updateMessageStatus(waMessageId, mapped, errors)
  if (mapped === "DELIVERED") {
    await scheduleFollowupAfterMessageDelivery(waMessageId)
  }
}
