import { AnyPipelineState, FunnelOrigin, PipelineStage } from "@/lib/pipeline/states"

export type {
  AnyPipelineState,
  FunnelOrigin,
  NurturingState,
  PipelineStage,
  PostDemoState,
  PreDemoState,
  PreMeetingState,
} from "@/lib/pipeline/states"

export type WhatsAppTemplateCategory = "AUTHENTICATION" | "MARKETING" | "UTILITY"

export type WhatsAppParameterFormat = "NAMED" | "POSITIONAL" | "named" | "positional"

export type WhatsAppNamedParam = "nombre" | "fecha" | "hora" | "link" | "dolor" | "resumen"

export type WhatsAppQuickReplyButton = {
  type: "QUICK_REPLY"
  text: string
  id?: string
}

export type WhatsAppUrlButton = {
  type: "URL"
  text: string
  url: string
  example?: string
}

export type WhatsAppTemplateButton = WhatsAppQuickReplyButton | WhatsAppUrlButton

export type TemplateTriggerType = "TIME" | "EVENT"

export type TemplateDelayAnchor = "STATE_ENTRY" | "MEETING_TIME" | "CLOCK"

export type TemplateDelayFromAnchor = {
  anchor: TemplateDelayAnchor
  offsetSeconds: number
}

export type WhatsAppTemplateDefinition<
  P extends readonly WhatsAppNamedParam[] = readonly WhatsAppNamedParam[],
> = {
  name: string
  category: WhatsAppTemplateCategory
  language: string
  pipeline?: PipelineStage
  state: AnyPipelineState
  funnelOrigin: FunnelOrigin | "ANY"
  triggerType: TemplateTriggerType
  delayFromAnchor?: TemplateDelayFromAnchor
  body: string
  footer?: string
  buttons: readonly WhatsAppTemplateButton[]
  params: P
  examples?: { [K in P[number]]?: string }
  metaTemplateId?: string | null
}

export type WhatsAppNamedParamExample = {
  param_name: string
  example: string
}

export type WhatsAppCreateBodyComponent = {
  type: "BODY"
  text: string
  example?: {
    body_text: string[][]
    body_text_named_params?: WhatsAppNamedParamExample[]
  }
}

export type WhatsAppCreateFooterComponent = {
  type: "FOOTER"
  text: string
}

export type WhatsAppCreateButtonsComponent = {
  type: "BUTTONS"
  buttons: Array<
    | { type: "QUICK_REPLY"; text: string }
    | { type: "URL"; text: string; url: string; example?: string[] }
  >
}

export type WhatsAppCreateComponent =
  | WhatsAppCreateBodyComponent
  | WhatsAppCreateFooterComponent
  | WhatsAppCreateButtonsComponent

export type WhatsAppCreateTemplatePayload = {
  name: string
  language: string
  category: WhatsAppTemplateCategory
  parameter_format?: WhatsAppParameterFormat
  allow_category_change: boolean
  components: WhatsAppCreateComponent[]
}

export type WhatsAppSendTextParameter = {
  type: "text"
  parameter_name: WhatsAppNamedParam
  text: string
}

export type WhatsAppSendTemplateMessage = {
  messaging_product: "whatsapp"
  recipient_type: "individual"
  to: string
  type: "template"
  template: {
    name: string
    language: { code: string }
    components: Array<{
      type: "body"
      parameters: WhatsAppSendTextParameter[]
    }>
  }
}

export type WhatsAppRemoteTemplate = {
  id: string
  name: string
  status: string
  category: string
  language: string
  rejected_reason?: string
}

export type WhatsAppRenderedTemplate<Name extends string = string> = {
  name: Name
  language: string
  category: WhatsAppTemplateCategory
  pipeline: PipelineStage
  state: AnyPipelineState
  funnelOrigin: FunnelOrigin | "ANY"
  body: string
  buttons: readonly WhatsAppTemplateButton[]
  params: readonly WhatsAppNamedParam[]
}
