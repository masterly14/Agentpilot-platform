import type {
  FunnelOrigin,
  AnyPipelineState,
  PipelineStage,
  WhatsAppCreateComponent,
  WhatsAppCreateTemplatePayload,
  WhatsAppNamedParam,
  WhatsAppSendTemplateMessage,
  WhatsAppTemplateDefinition,
} from "./types.ts"

export const WHATSAPP_TEMPLATE_LANGUAGE = "es"
export const WHATSAPP_TEMPLATE_LIMITS = {
  body: 1024,
  footer: 60,
  button: 25,
} as const

export const WHATSAPP_PARAM_EXAMPLES: Record<WhatsAppNamedParam, string> = {
  nombre: "Carlos",
  fecha: "viernes 28 de agosto",
  hora: "10:00 a. m.",
  link: "https://santiagovaron.com/agendar",
  dolor: "el seguimiento manual de reservas",
  resumen: "Empresa: Example PM · 16 propiedades · Usa PMS",
}

const NAMED_PARAM_RE = /\{\{([a-z][a-z0-9_]*)\}\}/g
const LEADING_VARIABLE_RE = /^\{\{[a-z][a-z0-9_]*\}\}/
const TRAILING_VARIABLE_RE = /\{\{[a-z][a-z0-9_]*\}\}$/

function lines(...parts: string[]) {
  return parts.join("\n")
}

function defineWhatsAppTemplates<const T extends Record<string, WhatsAppTemplateDefinition>>(
  templates: T,
) {
  return templates
}

export const whatsappTemplates = defineWhatsAppTemplates({
  ap_owner_meeting_rescheduled: {
    name: "ap_owner_meeting_rescheduled",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: undefined,
    state: "NEED_RESCHEDULE",
    funnelOrigin: "ANY",
    triggerType: "EVENT",
    params: ["nombre", "fecha", "hora", "resumen"],
    buttons: [],
    body: lines(
      "Se reprogramó la reunión con {{nombre}} para el {{fecha}} a las {{hora}}.",
      "",
      "Resumen: {{resumen}}.",
      "",
      "Revisa el calendario para los detalles.",
    ),
  },
  ap_confirmation_sent1: {
    name: "ap_confirmation_sent1",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_MEETING",
    state: "CONFIRMATION_SENT",
    funnelOrigin: "ANY",
    triggerType: "EVENT",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 0 },
    params: ["nombre", "fecha", "hora"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, te habla Santiago Varón, founder de Agent Pilot 👋",
      "",
      "Vi que agendaste tu diagnóstico para entender cómo liberar +50 horas semanales, recuperar dinero que hoy se pierde y aumentar la capacidad operativa de tu negocio, sin que dependa de que tú estés encima todo el día.",
      "",
      "Antes de la llamada, 3 cosas importantes:",
      "",
      "1. El objetivo es entender tu operación actual y evaluar si tiene sentido implementar nuestro sistema en tu negocio.",
      "2. Al ser un diagnóstico, dura 60 min o más, así que asegúrate de estar 100% presente ese rato.",
      "3. Conéctate desde computador, en un lugar tranquilo, para aprovechar el tiempo al máximo.",
      "",
      "Nos vemos el {{fecha}} a las {{hora}}. Te iré enviando recordatorios antes de la fecha. ¡Nos vemos pronto! 🚀",
    ),
  },
  ap_reminder_48h: {
    name: "ap_reminder_48h",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_MEETING",
    state: "REMINDER_48H",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "MEETING_TIME", offsetSeconds: -48 * 60 * 60 },
    params: ["nombre"],
    buttons: [],
    body: lines(
      "Hola {{nombre}} 👋 Nos vemos en 2 días para tu diagnóstico.",
      "",
      "En la llamada vamos a mapear exactamente cuales son los cuellos de botella de tu empresa y el por qué la gran mayoría de Property Managers son los toderos del negocio.",
      "",
      "Nos vemos pronto 🚀",
    ),
  },
  ap_reminder_24h: {
    name: "ap_reminder_24h",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_MEETING",
    state: "REMINDER_24H",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "MEETING_TIME", offsetSeconds: -24 * 60 * 60 },
    params: ["nombre", "hora"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, mañana a las {{hora}} es nuestra reunión.",
      "",
      "Antes de vernos, ve pensando la razón por la que agendaste el diagnóstico y lo que falla hoy en tu operación.",
      "",
      "Piénsalo y tenlo listo para la llamada. Nos vemos mañana 👋",
    ),
  },
  ap_reminder_8am: {
    name: "ap_reminder_8am",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_MEETING",
    state: "REMINDER_8AM_DAY_OF",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "CLOCK", offsetSeconds: 8 * 60 * 60 },
    params: ["nombre", "hora"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, nos vemos hoy a las {{hora}} 🙌",
      "",
      "Recuerda conectarte desde computador, en un lugar tranquilo. ¡Nos vemos en un rato!",
    ),
  },
  ap_reminder_30min: {
    name: "ap_reminder_30min",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_MEETING",
    state: "REMINDER_30MIN",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "MEETING_TIME", offsetSeconds: -30 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    examples: { link: "https://meet.google.com/abc-defg-hij" },
    body: lines(
      "Hola {{nombre}}, en 30 minutos empezamos 🚀",
      "",
      "Aquí el link para conectarte: {{link}}",
      "",
      "Nos vemos ya mismo.",
    ),
  },
  ap_reschedule_offered: {
    name: "ap_reschedule_offered",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_MEETING",
    state: "RESCHEDULE_OFFERED",
    funnelOrigin: "ANY",
    triggerType: "EVENT",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 0 },
    params: ["nombre", "link"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, te esperé en la llamada pero no logramos coincidir 😅",
      "",
      "Sé que el día a día de la operación absorbe todo el tiempo, pasa mucho.",
      "¿Prefieres que reagendemos ahora mismo? Aquí tienes mi calendario: {{link}}",
      "",
      "Cuando quieras, ahí estaré.",
    ),
  },
  ap_demo_reminder_48h: {
    name: "ap_demo_reminder_48h",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_DEMO",
    state: "DEMO_REMINDER_48H",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "MEETING_TIME", offsetSeconds: -48 * 60 * 60 },
    params: ["nombre", "dolor"],
    buttons: [],
    body: lines(
      "Hola {{nombre}} 👋 En 2 días te muestro cómo resolvemos {{dolor}}, lo que hablamos en nuestra última llamada.",
      "",
      "Ya con la información que me compartiste, armamos algo 100% aterrizado a tu operación, no una demo genérica. Vas a ver exactamente cómo funcionaría en tu día a día.",
      "",
      "Nos vemos pronto 🚀",
    ),
  },
  ap_demo_reminder_24h: {
    name: "ap_demo_reminder_24h",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_DEMO",
    state: "DEMO_REMINDER_24H",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "MEETING_TIME", offsetSeconds: -24 * 60 * 60 },
    params: ["nombre", "hora", "dolor"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, mañana a las {{hora}} te muestro la propuesta completa, incluyendo cómo resolvemos {{dolor}}.",
      "",
      "¿Quieres que alguien más de tu equipo esté en la llamada? Recuerda invitar a todos los tomadores de decisión.",
      "",
      "Nos vemos mañana 👋",
    ),
  },
  ap_demo_reminder_8am: {
    name: "ap_demo_reminder_8am",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_DEMO",
    state: "DEMO_REMINDER_8AM",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "CLOCK", offsetSeconds: 8 * 60 * 60 },
    params: ["nombre", "hora", "dolor"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, hoy a las {{hora}} te muestro cómo resolvemos {{dolor}} en tu operación 🙌",
      "",
      "Conéctate desde computador, en un lugar tranquilo. ¡Nos vemos en un rato!",
    ),
  },
  ap_demo_reminder_30min: {
    name: "ap_demo_reminder_30min",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_DEMO",
    state: "DEMO_REMINDER_30MIN",
    funnelOrigin: "ANY",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "MEETING_TIME", offsetSeconds: -30 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    examples: { link: "https://meet.google.com/abc-defg-hij" },
    body: lines(
      "Hola {{nombre}}, en 30 minutos te muestro todo el sistema para resolver lo que hemos hablado 🚀",
      "",
      "Aquí el link: {{link}}",
      "",
      "Nos vemos ya mismo.",
    ),
  },
  ap_demo_reschedule_offered: {
    name: "ap_demo_reschedule_offered",
    category: "UTILITY",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "PRE_DEMO",
    state: "RESCHEDULE_OFFERED",
    funnelOrigin: "ANY",
    triggerType: "EVENT",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 0 },
    params: ["nombre", "dolor", "link"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, te esperé pero no logramos coincidir.",
      "",
      "Ya tengo lista la demo enfocada en {{dolor}}, no quiero que se quede en el aire. ¿Reagendamos ahora mismo? Aquí mi calendario: {{link}}",
      "",
      "Cuando quieras, ahí estaré.",
    ),
  },
  ap_awaiting_confirmation: {
    name: "ap_awaiting_confirmation",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "AWAITING_CONFIRMATION",
    funnelOrigin: "ANY",
    triggerType: "EVENT",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 0 },
    params: ["nombre"],
    body: lines(
      "Hola {{nombre}} 👋 Soy Santiago, founder de Agent Pilot.",
      "",
      "Ya tienes tu guía para aprender como poner celular en modo avión y que tu renta corta siga operando. 📩",
      "",
      "¿La recibiste bien?",
    ),
    buttons: [
      { type: "QUICK_REPLY", text: "Sí, la recibí", id: "guide_received" },
      { type: "QUICK_REPLY", text: "No me llegó", id: "guide_missing" },
      { type: "QUICK_REPLY", text: "Tengo dudas", id: "guide_questions" },
    ],
  },
  ap_video_sent_sql: {
    name: "ap_video_sent_sql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "VIDEO_SENT",
    funnelOrigin: "SQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    examples: { link: "https://santiagovaron.com/diagnostico" },
    body: lines(
      "Hola {{nombre}}, vi que descargaste la guía, bien ahí 🙌",
      "",
      "Si quieres ver cómo se ve esto aplicado a un negocio como el tuyo, grabé un video corto explicando exactamente el proceso de diagnóstico y cómo funcionaría en tu operación: {{link}}",
      "",
      "Son solo 4-5 min.",
    ),
  },
  ap_cta_saw_video_sql: {
    name: "ap_cta_saw_video_sql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "CTA_SENT_SAW_VIDEO",
    funnelOrigin: "SQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, ¿qué te pareció el video? 👀",
      "",
      "Si tiene sentido para tu operación, agenda aquí tu diagnóstico, dura 60 min y salimos con claridad de qué cuellos de botella tiene tu negocio: {{link}}",
      "",
      "Queda abierto cuando te quede mejor.",
    ),
  },
  ap_cta_no_video_sql: {
    name: "ap_cta_no_video_sql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "CTA_SENT_NO_VIDEO",
    funnelOrigin: "SQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, entiendo que el día a día es pesado 😅",
      "",
      "Te dejo por si acaso el link directo para agendar, a veces es más rápido que ver el video completo: {{link}}",
      "",
      "Queda abierto cuando te quede mejor.",
    ),
  },
  ap_last_nurture_sql: {
    name: "ap_last_nurture_sql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "LAST_NURTURE_SENT",
    funnelOrigin: "SQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 36 * 60 * 60 },
    params: ["nombre", "link"],
    body: lines(
      "Hola {{nombre}}, última vez que te escribo por aquí antes de intentar llamarte.",
      "Sé que suena a mucho compromiso agendar 60 min, pero la mayoría de Property Managers con los que hablo salen de esa llamada con al menos 2-3 cosas concretas para dejar de hacer manualmente, agenden con nosotros o no.",
      "",
      "Si te interesa, aquí el link: {{link}}",
      "",
      "Si no es el momento, cuéntame y no te sigo escribiendo por aquí.",
    ),
    buttons: [
      { type: "QUICK_REPLY", text: "Sí, quiero agendar", id: "book_now" },
      { type: "QUICK_REPLY", text: "No es el momento", id: "not_now" },
    ],
  },
  ap_qualification_offered: {
    name: "ap_qualification_offered",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "QUALIFICATION_OFFERED",
    funnelOrigin: "MQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre"],
    body: lines(
      "Hola {{nombre}}, antes de mostrarte algo aterrizado a tu operación, quiero entenderte un poco mejor, así la sesión de diagnóstico va directo a lo que de verdad te sirve.",
      "",
      "¿Te hago 3 preguntas rápidas por aquí? Toma menos de 2 minutos.",
    ),
    buttons: [
      { type: "QUICK_REPLY", text: "Dale, pregunta", id: "qualify_now" },
      { type: "QUICK_REPLY", text: "Prefiero agendar directo", id: "book_direct" },
    ],
  },
  ap_fit_confirmed: {
    name: "ap_fit_confirmed",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "FIT_CONFIRMED",
    funnelOrigin: "MQL",
    triggerType: "EVENT",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 0 },
    params: ["link"],
    buttons: [],
    body: lines(
      "Con esto que me cuentas, tiene mucho sentido que hables conmigo directamente. Te dejo el link para que agendes cuando te quede mejor: {{link}}",
      "",
      "Nos vemos cuando agendes.",
    ),
  },
  ap_disqualified: {
    name: "ap_disqualified",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "DISQUALIFIED",
    funnelOrigin: "MQL",
    triggerType: "EVENT",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 0 },
    params: [],
    buttons: [],
    body: "Por ahora no creo que seamos el mejor aliado para tu operación, pero te dejo la guía por si te sirve más adelante. ¡Éxitos!",
  },
  ap_video_sent_mql: {
    name: "ap_video_sent_mql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "VIDEO_SENT",
    funnelOrigin: "MQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    examples: { link: "https://santiagovaron.com/diagnostico" },
    body: lines(
      "Hola {{nombre}}, te dejo un video corto (4-5 min) donde te explico exactamente cómo funciona el proceso de diagnóstico y qué te llevas de la sesión: {{link}}",
      "",
      "Son solo 4-5 min.",
    ),
  },
  ap_cta_saw_video_mql: {
    name: "ap_cta_saw_video_mql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "CTA_SENT_SAW_VIDEO",
    funnelOrigin: "MQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, ¿qué te pareció el video? Si tiene sentido para tu operación, aquí puedes agendar directo: {{link}}",
      "",
      "Queda abierto cuando te quede mejor.",
    ),
  },
  ap_cta_no_video_mql: {
    name: "ap_cta_no_video_mql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "CTA_SENT_NO_VIDEO",
    funnelOrigin: "MQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre", "link"],
    buttons: [],
    body: lines(
      "Hola {{nombre}}, sé que el día a día es pesado 😅 Te dejo el link directo para agendar cuando tengas un espacio: {{link}}",
      "",
      "Queda abierto cuando te quede mejor.",
    ),
  },
  ap_last_nurture_mql: {
    name: "ap_last_nurture_mql",
    category: "MARKETING",
    language: WHATSAPP_TEMPLATE_LANGUAGE,
    pipeline: "NURTURING",
    state: "LAST_NURTURE_SENT",
    funnelOrigin: "MQL",
    triggerType: "TIME",
    delayFromAnchor: { anchor: "STATE_ENTRY", offsetSeconds: 24 * 60 * 60 },
    params: ["nombre", "link"],
    body: lines(
      "Hola {{nombre}}, última vez que te escribo por aquí 📞 Si te interesa seguir la conversación, aquí el link: {{link}}",
      "",
      "Si no es el momento, cuéntame y no te sigo escribiendo.",
    ),
    buttons: [
      { type: "QUICK_REPLY", text: "Sí, quiero agendar", id: "book_now" },
      { type: "QUICK_REPLY", text: "No es el momento", id: "not_now" },
    ],
  },
})

export type WhatsAppTemplates = typeof whatsappTemplates
export type WhatsAppTemplateName = keyof WhatsAppTemplates
export type WhatsAppTemplate<Name extends WhatsAppTemplateName = WhatsAppTemplateName> =
  WhatsAppTemplates[Name]

export type WhatsAppTemplateVars<Name extends WhatsAppTemplateName> = {
  [Param in WhatsAppTemplate<Name>["params"][number]]: string
}

export function isWhatsAppTemplateName(value: string): value is WhatsAppTemplateName {
  return value in whatsappTemplates
}

export function getWhatsAppTemplate<Name extends WhatsAppTemplateName>(name: Name) {
  return whatsappTemplates[name]
}

export function listWhatsAppTemplates() {
  return Object.values(whatsappTemplates)
}

export function listWhatsAppTemplateNames() {
  return Object.keys(whatsappTemplates) as WhatsAppTemplateName[]
}

export function findWhatsAppTemplate(query: {
  state: AnyPipelineState
  pipeline?: PipelineStage
  funnelOrigin?: FunnelOrigin | "ANY"
}) {
  const matches = listWhatsAppTemplates().filter((template) => {
    if (template.state !== query.state) return false
    if (query.pipeline && template.pipeline !== query.pipeline) return false
    if (!query.funnelOrigin) return true
    return template.funnelOrigin === query.funnelOrigin || template.funnelOrigin === "ANY"
  })

  if (query.funnelOrigin && query.funnelOrigin !== "ANY") {
    return (
      matches.find((template) => template.funnelOrigin === query.funnelOrigin) ??
      matches.find((template) => template.funnelOrigin === "ANY")
    )
  }

  return matches[0]
}

export function namedParamsInBody(body: string) {
  const names: WhatsAppNamedParam[] = []
  const seen = new Set<string>()
  NAMED_PARAM_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = NAMED_PARAM_RE.exec(body))) {
    const name = match[1]
    if (seen.has(name)) continue
    seen.add(name)
    names.push(name as WhatsAppNamedParam)
  }
  return names
}

function namedParamCounts(body: string) {
  const counts = new Map<string, number>()
  NAMED_PARAM_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = NAMED_PARAM_RE.exec(body))) {
    const name = match[1]
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  return counts
}

export function interpolateWhatsAppBody(body: string, vars: Partial<Record<WhatsAppNamedParam, string>>) {
  return body.replace(NAMED_PARAM_RE, (_full, name: string) => {
    const value = vars[name as WhatsAppNamedParam]
    if (value == null || value === "") {
      throw new Error(`Falta el parámetro {{${name}}} para interpolar la plantilla.`)
    }
    return value
  })
}

export function renderWhatsAppTemplate<Name extends WhatsAppTemplateName>(
  name: Name,
  vars: WhatsAppTemplateVars<Name>,
) {
  const template = whatsappTemplates[name]
  return {
    name,
    language: template.language,
    category: template.category,
    pipeline: template.pipeline,
    state: template.state,
    funnelOrigin: template.funnelOrigin,
    body: interpolateWhatsAppBody(template.body, vars as Partial<Record<WhatsAppNamedParam, string>>),
    buttons: template.buttons,
    params: template.params,
  }
}

function exampleValue(
  param: WhatsAppNamedParam,
  template: WhatsAppTemplateDefinition,
  overrides?: Partial<Record<WhatsAppNamedParam, string>>,
) {
  return overrides?.[param] || template.examples?.[param] || WHATSAPP_PARAM_EXAMPLES[param]
}

export function validateWhatsAppTemplate(template: WhatsAppTemplateDefinition) {
  const errors: string[] = []
  if (!/^[a-z0-9_]+$/.test(template.name)) {
    errors.push(`nombre inválido: ${template.name}`)
  }
  if (template.body.length > WHATSAPP_TEMPLATE_LIMITS.body) {
    errors.push(
      `body de ${template.name} tiene ${template.body.length} chars (máx ${WHATSAPP_TEMPLATE_LIMITS.body})`,
    )
  }
  if (template.footer && template.footer.length > WHATSAPP_TEMPLATE_LIMITS.footer) {
    errors.push(
      `footer de ${template.name} tiene ${template.footer.length} chars (máx ${WHATSAPP_TEMPLATE_LIMITS.footer})`,
    )
  }
  for (const button of template.buttons ?? []) {
    if (button.text.length > WHATSAPP_TEMPLATE_LIMITS.button) {
      errors.push(
        `botón "${button.text}" en ${template.name} tiene ${button.text.length} chars (máx ${WHATSAPP_TEMPLATE_LIMITS.button})`,
      )
    }
  }

  const trimmedBody = template.body.trim()
  if (LEADING_VARIABLE_RE.test(trimmedBody)) {
    errors.push(`${template.name}: el body no puede iniciar con una variable (regla de Meta)`)
  }
  if (TRAILING_VARIABLE_RE.test(trimmedBody)) {
    errors.push(`${template.name}: el body no puede terminar con una variable (regla de Meta)`)
  }

  const fromBody = namedParamsInBody(template.body)
  for (const [param, count] of namedParamCounts(template.body)) {
    if (count > 1) {
      errors.push(
        `${template.name}: {{${param}}} aparece ${count} veces; Meta exige que cada variable sea única`,
      )
    }
  }
  const declared = new Set(template.params)
  for (const param of fromBody) {
    if (!declared.has(param)) {
      errors.push(`${template.name} usa {{${param}}} pero no está en params`)
    }
  }
  for (const param of template.params) {
    if (!fromBody.includes(param)) {
      errors.push(`${template.name} declara ${param} pero no aparece en el body`)
    }
  }

  if (errors.length) throw new Error(errors.join("\n"))
}

export function validateWhatsAppCatalog() {
  for (const template of listWhatsAppTemplates()) {
    validateWhatsAppTemplate(template)
  }
}

export function buildWhatsAppCreatePayload(
  name: WhatsAppTemplateName,
  options?: {
    language?: string
    examples?: Partial<Record<WhatsAppNamedParam, string>>
  },
): WhatsAppCreateTemplatePayload {
  const template: WhatsAppTemplateDefinition = whatsappTemplates[name]
  validateWhatsAppTemplate(template)

  const params = namedParamsInBody(template.body)
  const exampleValues = params.map((paramName) =>
    exampleValue(paramName, template, options?.examples),
  )
  const components: WhatsAppCreateComponent[] = [
    {
      type: "BODY",
      text: template.body,
      ...(params.length
        ? {
            example: {
              body_text: [exampleValues],
              body_text_named_params: params.map((paramName, index) => ({
                param_name: paramName,
                example: exampleValues[index] ?? "",
              })),
            },
          }
        : {}),
    },
  ]

  if (template.footer) {
    components.push({ type: "FOOTER", text: template.footer })
  }

  if (template.buttons?.length) {
    components.push({
      type: "BUTTONS",
      buttons: template.buttons.map((button) => {
        if (button.type === "URL") {
          return {
            type: "URL" as const,
            text: button.text,
            url: button.url,
            ...(button.example ? { example: [button.example] } : {}),
          }
        }
        return { type: "QUICK_REPLY" as const, text: button.text }
      }),
    })
  }

  return {
    name: template.name,
    language: options?.language ?? template.language,
    category: template.category,
    ...(params.length ? { parameter_format: "NAMED" as const } : {}),
    allow_category_change: true,
    components,
  }
}

export function buildWhatsAppSendPayload<Name extends WhatsAppTemplateName>(
  name: Name,
  to: string,
  vars: WhatsAppTemplateVars<Name>,
): WhatsAppSendTemplateMessage {
  const template = whatsappTemplates[name]
  const values = vars as Partial<Record<WhatsAppNamedParam, string>>
  interpolateWhatsAppBody(template.body, values)

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: template.name,
      language: { code: template.language },
      components:
        template.params.length > 0
          ? [
              {
                type: "body",
                parameters: template.params.map((paramName) => ({
                  type: "text" as const,
                  parameter_name: paramName,
                  text: values[paramName] ?? "",
                })),
              },
            ]
          : [],
    },
  }
}
