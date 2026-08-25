import type { Contact, LeadPipeline, PipelineState } from "@/prisma/generated/client"
import type { WhatsAppNamedParam } from "@/lib/whatsapp/types"
import {
  buildWhatsAppSendPayload,
  findWhatsAppTemplate,
  interpolateWhatsAppBody,
  type WhatsAppTemplateName,
} from "@/lib/whatsapp/templates"
import { sendWhatsAppGraphMessage } from "@/lib/whatsapp/client"
import { persistConversationMessage } from "@/lib/pipeline/conversation"
import { buildTemplateVars } from "@/lib/pipeline/vars"

export type SendPipelineTemplateInput = {
  contact: Contact
  pipeline: LeadPipeline
  state: PipelineState
}

export async function sendPipelineTemplate({ contact, pipeline, state }: SendPipelineTemplateInput) {
  const template = findWhatsAppTemplate({
    state,
    pipeline: pipeline.currentStage,
    funnelOrigin: pipeline.funnelOrigin,
  })

  if (!template) {
    console.warn("[whatsapp] no hay plantilla para enviar", {
      templateName: null,
      to: contact.phoneE164,
      state,
      currentStage: pipeline.currentStage,
      funnelOrigin: pipeline.funnelOrigin,
    })
    return { skipped: true as const, reason: "no_template" as const }
  }

  const vars = await buildTemplateVars(contact, pipeline, template.params, state)
  const payload = buildWhatsAppSendPayload(
    template.name as WhatsAppTemplateName,
    contact.phoneE164,
    vars as never,
  )

  try {
    const result = await sendWhatsAppGraphMessage(payload)
    const body = interpolateWhatsAppBody(template.body, vars)
    await persistConversationMessage({
      contactId: contact.id,
      direction: "OUTBOUND",
      type: "TEMPLATE",
      body,
      templateName: template.name,
      waMessageId: result.messageId,
      pipelineState: state,
      status: "SENT",
      rawPayload: payload as never,
    })
    console.info("[whatsapp] plantilla enviada", {
      templateName: template.name,
      to: contact.phoneE164,
      state,
      messageId: result.messageId,
    })
    return { skipped: false as const, messageId: result.messageId, templateName: template.name }
  } catch (error) {
    const body = interpolateWhatsAppBody(template.body, vars)
    await persistConversationMessage({
      contactId: contact.id,
      direction: "OUTBOUND",
      type: "TEMPLATE",
      body,
      templateName: template.name,
      pipelineState: state,
      status: "FAILED",
      rawPayload: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    })
    console.error("[whatsapp] Graph falló al enviar plantilla", {
      templateName: template.name,
      to: contact.phoneE164,
      state,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export async function sendWhatsAppText(input: {
  contact: Contact
  body: string
  pipelineState?: PipelineState | null
  previewUrl?: boolean
}) {
  const previewUrl = input.previewUrl ?? /https?:\/\//i.test(input.body)
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: input.contact.phoneE164,
    type: "text",
    text: { preview_url: previewUrl, body: input.body },
  }

  try {
    const result = await sendWhatsAppGraphMessage(payload)
    await persistConversationMessage({
      contactId: input.contact.id,
      direction: "OUTBOUND",
      type: "TEXT",
      body: input.body,
      waMessageId: result.messageId,
      pipelineState: input.pipelineState ?? null,
      status: "SENT",
      rawPayload: payload,
    })
    return { messageId: result.messageId }
  } catch (error) {
    await persistConversationMessage({
      contactId: input.contact.id,
      direction: "OUTBOUND",
      type: "TEXT",
      body: input.body,
      pipelineState: input.pipelineState ?? null,
      status: "FAILED",
      rawPayload: {
        payload,
        error: error instanceof Error ? error.message : String(error),
      },
    })
    throw error
  }
}

export type { WhatsAppNamedParam }
