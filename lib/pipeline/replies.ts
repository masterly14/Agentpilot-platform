import type { Contact, FunnelOrigin, LeadPipeline, PipelineState } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import {
  getAgendarUrl,
  getAppUrl,
  getEbookDownloadUrl,
  getSqlDiagnosticoUrl,
} from "@/lib/ebook/app-url"
import { firstNameFromFullName } from "@/lib/whatsapp/phone"
import { getVideoTrackingUrl } from "@/lib/pipeline/vars"
import { normalizeButtonAction } from "@/lib/pipeline/transitions"

export type ReplyIntent =
  | "guide_received"
  | "guide_missing"
  | "guide_questions"
  | "book_now"
  | "not_now"
  | "watched_video"
  | "unknown"

export type ReplyEffect = "none" | "lost" | "video_watched" | "notify"

export type NurtureReplyVars = {
  nombre: string
  bookingLink: string
  guideLink: string
  videoLink: string
}

export type NurtureReply = {
  body: string
  effect: ReplyEffect
}

const NURTURE_REPLY_STATES = new Set<PipelineState>([
  "AWAITING_CONFIRMATION",
  "VIDEO_SENT",
  "CTA_SENT_SAW_VIDEO",
  "CTA_SENT_NO_VIDEO",
  "LAST_NURTURE_SENT",
  "COLD_CALL_QUEUED",
])

const REPLY_INTENT_SET = new Set<ReplyIntent>([
  "guide_received",
  "guide_missing",
  "guide_questions",
  "book_now",
  "not_now",
  "watched_video",
])

const INTENT_PATTERNS: Array<[Exclude<ReplyIntent, "unknown">, RegExp]> = [
  ["not_now", /\b(no es el momento|no me interesa|deja de (escribir|escribirme)|no te escribas|stop|baja)\b/i],
  ["watched_video", /\b(ya lo vi|vi el video|vi el v[ií]deo|acabo de ver(lo| el video))\b/i],
  ["guide_missing", /\b(no me lleg[oó]|no la recib[ií]|reenv[ií]a(r|me)?|no me ha llegado)\b/i],
  ["guide_received", /\b(s[ií],?\s*la recib[ií]|ya la tengo|ya me lleg[oó]|me lleg[oó]|la recib[ií])\b/i],
  ["guide_questions", /\b(tengo dudas?|una duda|no entiendo|\bdudas?\b)\b/i],
  ["book_now", /\b(quiero agendar|s[ií] quiero agendar|ag[eé]ndame|agendar|calendario)\b/i],
]

function isReplyIntent(value: string): value is ReplyIntent {
  return REPLY_INTENT_SET.has(value as ReplyIntent)
}

export function detectReplyIntent(buttonId?: string | null, body?: string | null): ReplyIntent {
  if (buttonId) {
    const fromButton = normalizeButtonAction(buttonId)
    if (fromButton && isReplyIntent(fromButton)) return fromButton
  }

  const text = body?.trim()
  if (text) {
    const fromBody = normalizeButtonAction(text)
    if (fromBody && isReplyIntent(fromBody)) return fromBody
    for (const [intent, pattern] of INTENT_PATTERNS) {
      if (pattern.test(text)) return intent
    }
  }

  return "unknown"
}

export async function loadNurtureReplyVars(
  contact: Contact,
  pipeline: LeadPipeline,
): Promise<NurtureReplyVars> {
  const submission = await prisma.formSubmission.findFirst({
    where: { contactId: contact.id },
    orderBy: { createdAt: "desc" },
    select: { pdfToken: true },
  })
  const token = submission?.pdfToken ?? ""
  const fallback = `${getAppUrl()}/diagnostico`
  const bookingLink =
    pipeline.funnelOrigin === "SQL" && token
      ? getSqlDiagnosticoUrl(token)
      : token
        ? getAgendarUrl(token)
        : fallback

  return {
    nombre: firstNameFromFullName(contact.fullName),
    bookingLink,
    guideLink: token ? getEbookDownloadUrl(token) : fallback,
    videoLink: token ? getVideoTrackingUrl(token) : bookingLink,
  }
}

export function buildNurtureReply(input: {
  state: PipelineState
  origin: FunnelOrigin
  intent: ReplyIntent
  vars: NurtureReplyVars
}): NurtureReply | null {
  if (!NURTURE_REPLY_STATES.has(input.state)) return null

  switch (input.state) {
    case "AWAITING_CONFIRMATION":
      return replyAwaitingConfirmation(input.intent, input.vars)
    case "VIDEO_SENT":
      return replyVideoSent(input.intent, input.vars)
    case "CTA_SENT_SAW_VIDEO":
      return replyCta(input.intent, input.vars, true)
    case "CTA_SENT_NO_VIDEO":
      return replyCta(input.intent, input.vars, false)
    case "LAST_NURTURE_SENT":
      return replyLastNurture(input.intent, input.vars)
    case "COLD_CALL_QUEUED":
      return replyColdCall(input.intent, input.vars)
    default:
      return null
  }
}

function replyAwaitingConfirmation(intent: ReplyIntent, vars: NurtureReplyVars): NurtureReply {
  switch (intent) {
    case "guide_received":
      return {
        body: `Perfecto ${vars.nombre}, me alegra que te haya llegado. En las próximas horas te mando un video corto (4-5 min) de cómo se ve esto en un negocio como el tuyo.`,
        effect: "none",
      }
    case "guide_missing":
      return {
        body: `Listo ${vars.nombre}, te reenvío la guía aquí: ${vars.guideLink}\n\nSi no abre, avísame y lo vemos.`,
        effect: "notify",
      }
    case "guide_questions":
      return {
        body: `Dime qué duda tienes y te la resuelvo por aquí. Si es más fácil, también puedo llamarte.`,
        effect: "notify",
      }
    case "book_now":
      return {
        body: `Cuando quieras, aquí puedes agendar el diagnóstico (60 min): ${vars.bookingLink}`,
        effect: "none",
      }
    case "not_now":
      return {
        body: `Tranquilo, sin presión. Igual te dejo el siguiente paso en las próximas horas por si te sirve.`,
        effect: "none",
      }
    default:
      return {
        body: `Recibí tu mensaje. Si la guía no te llegó o tienes alguna duda, escríbeme y lo vemos. En las próximas horas te sigo compartiendo el siguiente paso.`,
        effect: "none",
      }
  }
}

function replyVideoSent(intent: ReplyIntent, vars: NurtureReplyVars): NurtureReply {
  switch (intent) {
    case "watched_video":
      return {
        body: `Qué bueno que lo viste. Si te hace sentido, aquí el diagnóstico: ${vars.bookingLink}`,
        effect: "video_watched",
      }
    case "book_now":
      return {
        body: `Cuando quieras, aquí puedes agendar el diagnóstico (60 min): ${vars.bookingLink}`,
        effect: "none",
      }
    case "not_now":
      return {
        body: `Tranquilo, sin presión. Te dejo el video por si quieres retomarlo: ${vars.videoLink}\n\nSi más adelante te sirve, aquí estamos.`,
        effect: "none",
      }
    default:
      return {
        body: `Si el video no abre o quieres ir directo al diagnóstico, aquí el link: ${vars.bookingLink}\n\n¿Qué te quedó dando vueltas?`,
        effect: "none",
      }
  }
}

function replyCta(intent: ReplyIntent, vars: NurtureReplyVars, sawVideo: boolean): NurtureReply {
  if (intent === "book_now") {
    return {
      body: `Perfecto. Aquí puedes agendar el diagnóstico (60 min): ${vars.bookingLink}`,
      effect: "none",
    }
  }
  if (intent === "not_now") {
    return {
      body: `Entendido, sin presión. El link queda por si más adelante te queda mejor: ${vars.bookingLink}`,
      effect: "none",
    }
  }
  if (intent === "watched_video") {
    return {
      body: sawVideo
        ? `Qué bueno. Si quieres el diagnóstico, aquí el link: ${vars.bookingLink}`
        : `Qué bueno que lo viste. Si te hace sentido, agenda aquí: ${vars.bookingLink}`,
      effect: sawVideo ? "none" : "video_watched",
    }
  }
  return {
    body: sawVideo
      ? `El diagnóstico dura 60 min y salimos con cuellos de botella concretos. Aquí el link: ${vars.bookingLink}`
      : `Si te queda más fácil ir directo, aquí puedes agendar: ${vars.bookingLink}`,
    effect: "none",
  }
}

function replyLastNurture(intent: ReplyIntent, vars: NurtureReplyVars): NurtureReply {
  if (intent === "book_now") {
    return {
      body: `Listo. Aquí puedes agendar cuando te quede mejor: ${vars.bookingLink}`,
      effect: "none",
    }
  }
  if (intent === "not_now") {
    return {
      body: `Listo, no te escribo más por aquí. Si más adelante te sirve, aquí estamos.`,
      effect: "lost",
    }
  }
  return {
    body: `Si te sirve, aquí el link: ${vars.bookingLink}\n\nSi no es el momento, dímelo y no te escribo más por aquí.`,
    effect: "none",
  }
}

function replyColdCall(intent: ReplyIntent, vars: NurtureReplyVars): NurtureReply {
  if (intent === "book_now") {
    return {
      body: `Perfecto, aquí puedes agendar: ${vars.bookingLink}`,
      effect: "none",
    }
  }
  if (intent === "not_now") {
    return {
      body: `Listo, no te escribo más por aquí. Si más adelante te sirve, aquí estamos.`,
      effect: "lost",
    }
  }
  return {
    body: `Estaba por llamarte. Si prefieres, agenda aquí: ${vars.bookingLink}\n\nSi no es el momento, dímelo.`,
    effect: "none",
  }
}
