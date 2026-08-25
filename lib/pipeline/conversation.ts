import type {
  MessageDirection,
  MessageStatus,
  MessageType,
  PipelineState,
  Prisma,
} from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"

export async function ensureWhatsAppConversation(contactId: string, waPhoneNumberId?: string | null) {
  return prisma.conversation.upsert({
    where: {
      contactId_channel: {
        contactId,
        channel: "WHATSAPP",
      },
    },
    create: {
      contactId,
      channel: "WHATSAPP",
      waPhoneNumberId: waPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || null,
    },
    update: waPhoneNumberId
      ? { waPhoneNumberId }
      : {},
  })
}

export async function persistConversationMessage(input: {
  contactId: string
  direction: MessageDirection
  type: MessageType
  body?: string | null
  templateName?: string | null
  buttonId?: string | null
  waMessageId?: string | null
  rawPayload?: Prisma.InputJsonValue
  pipelineState?: PipelineState | null
  status?: MessageStatus
  waPhoneNumberId?: string | null
  mediaId?: string | null
  mimeType?: string | null
  mediaFilename?: string | null
  mediaUrl?: string | null
  caption?: string | null
}) {
  const conversation = await ensureWhatsAppConversation(input.contactId, input.waPhoneNumberId)

  if (input.waMessageId) {
    const existing = await prisma.conversationMessage.findUnique({
      where: { waMessageId: input.waMessageId },
    })
    if (existing) return existing
  }

  const [saved] = await prisma.$transaction([
    prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        direction: input.direction,
        type: input.type,
        body: input.body ?? null,
        templateName: input.templateName ?? null,
        buttonId: input.buttonId ?? null,
        waMessageId: input.waMessageId ?? null,
        rawPayload: input.rawPayload,
        pipelineState: input.pipelineState ?? null,
        status: input.status ?? (input.direction === "OUTBOUND" ? "PENDING" : "DELIVERED"),
        mediaId: input.mediaId ?? null,
        mimeType: input.mimeType ?? null,
        mediaFilename: input.mediaFilename ?? null,
        mediaUrl: input.mediaUrl ?? null,
        caption: input.caption ?? null,
      },
    }),
    prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    }),
  ])

  return saved
}

export async function updateMessageStatus(waMessageId: string, status: MessageStatus) {
  const existing = await prisma.conversationMessage.findUnique({
    where: { waMessageId },
  })
  if (!existing) return null
  return prisma.conversationMessage.update({
    where: { waMessageId },
    data: { status },
  })
}
