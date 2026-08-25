import { createHmac, timingSafeEqual } from "node:crypto"
import type { MessageType } from "@/prisma/generated/client"

export function verifyWhatsAppSignature(rawBody: string, header: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret || !header) return false
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`
  const left = Buffer.from(expected)
  const right = Buffer.from(header)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

type GraphMedia = {
  id?: string
  mime_type?: string
  caption?: string
  filename?: string
}

type GraphLocation = {
  latitude?: number
  longitude?: number
  name?: string
  address?: string
}

type GraphMessage = {
  from?: string
  id?: string
  type?: string
  text?: { body?: string }
  button?: { payload?: string; text?: string }
  interactive?: {
    type?: string
    button_reply?: { id?: string; title?: string }
  }
  audio?: GraphMedia
  image?: GraphMedia
  video?: GraphMedia
  document?: GraphMedia
  sticker?: GraphMedia
  location?: GraphLocation
}

type GraphStatus = {
  id?: string
  status?: string
  errors?: Array<{
    code?: number
    title?: string
    message?: string
    error_data?: { details?: string }
  }>
}

type GraphValue = {
  messaging_product?: string
  metadata?: { phone_number_id?: string }
  contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>
  messages?: GraphMessage[]
  statuses?: GraphStatus[]
}

export const PIPELINE_INBOUND_TYPES = new Set<MessageType>(["TEXT", "BUTTON", "INTERACTIVE"])

export type ParsedWhatsAppInboundType = Extract<
  MessageType,
  "TEXT" | "BUTTON" | "INTERACTIVE" | "AUDIO" | "IMAGE" | "VIDEO" | "DOCUMENT" | "STICKER" | "LOCATION"
>

export type ParsedWhatsAppInboundMessage = {
  waId: string
  waMessageId: string
  profileName?: string
  body?: string
  buttonId?: string
  type: ParsedWhatsAppInboundType
  mediaId?: string
  mimeType?: string
  mediaFilename?: string
  caption?: string
  raw: GraphMessage
  phoneNumberId?: string
}

export type ParsedWhatsAppWebhook = {
  messages: ParsedWhatsAppInboundMessage[]
  statuses: Array<{
    waMessageId: string
    status: string
    errors?: GraphStatus["errors"]
  }>
}

const GRAPH_TYPE_MAP: Record<string, ParsedWhatsAppInboundType> = {
  text: "TEXT",
  button: "BUTTON",
  interactive: "INTERACTIVE",
  audio: "AUDIO",
  image: "IMAGE",
  video: "VIDEO",
  document: "DOCUMENT",
  sticker: "STICKER",
  location: "LOCATION",
}

function mediaFromMessage(message: GraphMessage, type: ParsedWhatsAppInboundType): GraphMedia | undefined {
  if (type === "AUDIO") return message.audio
  if (type === "IMAGE") return message.image
  if (type === "VIDEO") return message.video
  if (type === "DOCUMENT") return message.document
  if (type === "STICKER") return message.sticker
  return undefined
}

function extractBody(message: GraphMessage, type: ParsedWhatsAppInboundType, media?: GraphMedia) {
  if (type === "TEXT") return message.text?.body
  if (type === "BUTTON") return message.button?.text
  if (type === "INTERACTIVE") return message.interactive?.button_reply?.title
  if (type === "LOCATION") {
    const location = message.location
    if (!location) return undefined
    const named = [location.name, location.address].filter(Boolean).join(" · ")
    if (named) return named
    if (location.latitude != null && location.longitude != null) {
      return `${location.latitude}, ${location.longitude}`
    }
    return undefined
  }
  return media?.caption
}

export function parseWhatsAppWebhook(payload: unknown): ParsedWhatsAppWebhook {
  const messages: ParsedWhatsAppWebhook["messages"] = []
  const statuses: ParsedWhatsAppWebhook["statuses"] = []
  if (!payload || typeof payload !== "object") return { messages, statuses }

  const entries = (payload as { entry?: Array<{ changes?: Array<{ value?: GraphValue }> }> }).entry ?? []
  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      const value = change.value
      if (!value) continue
      const phoneNumberId = value.metadata?.phone_number_id
      const profileName = value.contacts?.[0]?.profile?.name

      for (const message of value.messages ?? []) {
        if (!message.from || !message.id) continue
        const type = message.type ? GRAPH_TYPE_MAP[message.type] : undefined
        if (!type) continue

        const media = mediaFromMessage(message, type)
        const buttonId =
          message.button?.payload ||
          message.button?.text ||
          message.interactive?.button_reply?.id ||
          message.interactive?.button_reply?.title

        messages.push({
          waId: message.from,
          waMessageId: message.id,
          profileName,
          body: extractBody(message, type, media),
          buttonId,
          type,
          mediaId: media?.id,
          mimeType: media?.mime_type,
          mediaFilename: media?.filename,
          caption: media?.caption,
          raw: message,
          phoneNumberId,
        })
      }

      for (const status of value.statuses ?? []) {
        if (!status.id || !status.status) continue
        statuses.push({
          waMessageId: status.id,
          status: status.status,
          errors: status.errors,
        })
      }
    }
  }

  return { messages, statuses }
}
