import type { FunnelOrigin, LeadPipeline, PipelineStage, PipelineState } from "@/prisma/generated/client"
import {
  isNurturingState,
  isPostDemoState,
  isPreMeetingState,
  isTerminalState,
  type QualificationAnswers,
} from "@/lib/pipeline/states"

export const NURTURE_TIMEOUT_SECONDS: Partial<Record<PipelineState, number>> = {
  AWAITING_CONFIRMATION: 24 * 60 * 60,
  QUALIFICATION_OFFERED: 24 * 60 * 60,
  QUALIFYING_Q1: 24 * 60 * 60,
  QUALIFYING_Q2: 24 * 60 * 60,
  QUALIFYING_Q3: 24 * 60 * 60,
  FIT_CONFIRMED: 24 * 60 * 60,
  VIDEO_SENT: 24 * 60 * 60,
  CTA_SENT_SAW_VIDEO: 24 * 60 * 60,
  CTA_SENT_NO_VIDEO: 24 * 60 * 60,
  LAST_NURTURE_SENT: 36 * 60 * 60,
  COLD_CALL_QUEUED: 20 * 24 * 60 * 60,
  RESCHEDULE_OFFERED: 20 * 24 * 60 * 60,
}

const PRE_MEETING_CHAIN: PipelineState[] = [
  "CONFIRMATION_SENT",
  "REMINDER_48H",
  "REMINDER_24H",
  "REMINDER_8AM_DAY_OF",
  "REMINDER_30MIN",
  "NO_SHOW",
]

const LAST_PROGRESS_REMINDER: PipelineState = "REMINDER_24H"

export function preMeetingStateAfterReschedule(currentState: PipelineState): PipelineState {
  const index = PRE_MEETING_CHAIN.indexOf(currentState)
  if (index < 0) return "CONFIRMATION_SENT"
  const cap = PRE_MEETING_CHAIN.indexOf(LAST_PROGRESS_REMINDER)
  return PRE_MEETING_CHAIN[Math.min(index, cap)]
}

export const ALLOWED_FROM: Partial<Record<PipelineState, PipelineState[]>> = {
  AWAITING_CONFIRMATION: ["LEAD_MAGNET_DOWNLOADED"],
  QUALIFICATION_OFFERED: ["AWAITING_CONFIRMATION"],
  QUALIFYING_Q1: ["QUALIFICATION_OFFERED"],
  QUALIFYING_Q2: ["QUALIFYING_Q1"],
  QUALIFYING_Q3: ["QUALIFYING_Q2"],
  FIT_CONFIRMED: ["QUALIFYING_Q3", "QUALIFICATION_OFFERED"],
  DISQUALIFIED: ["QUALIFYING_Q3"],
  VIDEO_SENT: [
    "AWAITING_CONFIRMATION",
    "FIT_CONFIRMED",
    "QUALIFICATION_OFFERED",
    "QUALIFYING_Q1",
    "QUALIFYING_Q2",
    "QUALIFYING_Q3",
  ],
  CTA_SENT_SAW_VIDEO: ["VIDEO_SENT"],
  CTA_SENT_NO_VIDEO: ["VIDEO_SENT"],
  LAST_NURTURE_SENT: ["CTA_SENT_SAW_VIDEO", "CTA_SENT_NO_VIDEO"],
  COLD_CALL_QUEUED: ["LAST_NURTURE_SENT"],
  LONG_TERM_NURTURE: ["COLD_CALL_QUEUED", "LAST_NURTURE_SENT", "RESCHEDULE_OFFERED"],
  SCHEDULED: [
    "AWAITING_CONFIRMATION",
    "QUALIFICATION_OFFERED",
    "QUALIFYING_Q1",
    "QUALIFYING_Q2",
    "QUALIFYING_Q3",
    "FIT_CONFIRMED",
    "VIDEO_SENT",
    "CTA_SENT_SAW_VIDEO",
    "CTA_SENT_NO_VIDEO",
    "LAST_NURTURE_SENT",
    "COLD_CALL_QUEUED",
    "LEAD_MAGNET_DOWNLOADED",
  ],
  CONFIRMATION_SENT: ["MEETING_SCHEDULED", "RESCHEDULE_OFFERED"],
  REMINDER_48H: ["CONFIRMATION_SENT"],
  REMINDER_24H: ["CONFIRMATION_SENT", "REMINDER_48H"],
  REMINDER_8AM_DAY_OF: ["CONFIRMATION_SENT", "REMINDER_48H", "REMINDER_24H"],
  REMINDER_30MIN: ["CONFIRMATION_SENT", "REMINDER_48H", "REMINDER_24H", "REMINDER_8AM_DAY_OF"],
  NO_SHOW: [
    "CONFIRMATION_SENT",
    "REMINDER_48H",
    "REMINDER_24H",
    "REMINDER_8AM_DAY_OF",
    "REMINDER_30MIN",
    "DEMO_CONFIRMATION_SENT",
    "DEMO_REMINDER_48H",
    "DEMO_REMINDER_24H",
    "DEMO_REMINDER_8AM",
    "DEMO_REMINDER_30MIN",
  ],
  RESCHEDULE_OFFERED: ["NO_SHOW"],
  ATTENDED: ["CONFIRMATION_SENT", "REMINDER_48H", "REMINDER_24H", "REMINDER_8AM_DAY_OF", "REMINDER_30MIN"],
  DISCOVERY_COMPLETED: [
    "ATTENDED",
    "CONFIRMATION_SENT",
    "REMINDER_48H",
    "REMINDER_24H",
    "REMINDER_8AM_DAY_OF",
    "REMINDER_30MIN",
    "NO_SHOW",
    "RESCHEDULE_OFFERED",
  ],
  DISCOVERY_SUMMARY_SENT: ["DISCOVERY_COMPLETED"],
  DEMO_CONFIRMATION_SENT: ["ATTENDED", "DISCOVERY_COMPLETED", "DISCOVERY_SUMMARY_SENT"],
  DEMO_REMINDER_48H: ["DEMO_CONFIRMATION_SENT"],
  DEMO_REMINDER_24H: ["DEMO_CONFIRMATION_SENT", "DEMO_REMINDER_48H"],
  DEMO_REMINDER_8AM: ["DEMO_CONFIRMATION_SENT", "DEMO_REMINDER_48H", "DEMO_REMINDER_24H"],
  DEMO_REMINDER_30MIN: [
    "DEMO_CONFIRMATION_SENT",
    "DEMO_REMINDER_48H",
    "DEMO_REMINDER_24H",
    "DEMO_REMINDER_8AM",
  ],
  LOST: [
    "LAST_NURTURE_SENT",
    "COLD_CALL_QUEUED",
    "RESCHEDULE_OFFERED",
    "ATTENDED",
    "DISCOVERY_COMPLETED",
    "DISCOVERY_SUMMARY_SENT",
    "DEMO_CONFIRMATION_SENT",
    "DEMO_REMINDER_48H",
    "DEMO_REMINDER_24H",
    "DEMO_REMINDER_8AM",
    "DEMO_REMINDER_30MIN",
  ],
}

export function canEnterState(from: PipelineState, to: PipelineState) {
  if (from === to) return false
  const allowed = ALLOWED_FROM[to]
  if (!allowed) return true
  return allowed.includes(from)
}

export function stageForState(state: PipelineState, currentStage: PipelineStage): PipelineStage {
  if (state === "LOST" || state === "LONG_TERM_NURTURE") return currentStage
  if (isPostDemoState(state)) return "POST_DEMO"
  if (
    currentStage === "PRE_DEMO" &&
    (state === "NO_SHOW" || state === "RESCHEDULE_OFFERED" || state === "ATTENDED")
  ) {
    return "PRE_DEMO"
  }
  if (
    state === "DISCOVERY_COMPLETED" ||
    state === "DISCOVERY_SUMMARY_SENT" ||
    state === "DEMO_CONFIRMATION_SENT" ||
    state === "DEMO_REMINDER_48H" ||
    state === "DEMO_REMINDER_24H" ||
    state === "DEMO_REMINDER_8AM" ||
    state === "DEMO_REMINDER_30MIN"
  ) {
    return "PRE_DEMO"
  }
  if (isPreMeetingState(state)) return "PRE_MEETING"
  if (isNurturingState(state)) return "NURTURING"
  return currentStage
}

export function nextNurtureState(pipeline: LeadPipeline): PipelineState | null {
  const { currentState, funnelOrigin } = pipeline

  switch (currentState) {
    case "LEAD_MAGNET_DOWNLOADED":
      return "AWAITING_CONFIRMATION"
    case "AWAITING_CONFIRMATION":
      return funnelOrigin === "MQL" ? "QUALIFICATION_OFFERED" : "VIDEO_SENT"
    case "QUALIFICATION_OFFERED":
    case "QUALIFYING_Q1":
    case "QUALIFYING_Q2":
    case "QUALIFYING_Q3":
    case "FIT_CONFIRMED":
      return "VIDEO_SENT"
    case "VIDEO_SENT":
      return "CTA_SENT_SAW_VIDEO"
    case "CTA_SENT_SAW_VIDEO":
    case "CTA_SENT_NO_VIDEO":
      return "LAST_NURTURE_SENT"
    case "LAST_NURTURE_SENT":
      return "COLD_CALL_QUEUED"
    case "COLD_CALL_QUEUED":
      return "LONG_TERM_NURTURE"
    case "RESCHEDULE_OFFERED":
      return "LONG_TERM_NURTURE"
    default:
      return null
  }
}

function eightAmBogota(meetingTime: Date) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(meetingTime)
  return new Date(`${date}T08:00:00-05:00`)
}

const PRE_MEETING_RESTART_STATES = new Set<PipelineState>([
  "MEETING_SCHEDULED",
  "NO_SHOW",
  "RESCHEDULE_OFFERED",
  "ATTENDED",
  "LONG_TERM_NURTURE",
  "LOST",
  "DISQUALIFIED",
])

export function shouldRestartPreMeetingOnReschedule(
  stage: PipelineStage,
  state: PipelineState,
) {
  if (stage === "NURTURING") return true
  if (stage !== "PRE_MEETING") return false
  return PRE_MEETING_RESTART_STATES.has(state)
}

export function nextPreMeetingJob(
  currentState: PipelineState,
  meetingTime: Date,
  now = new Date(),
): { expectedState: PipelineState; notBefore: Date } | null {
  const currentIndex = PRE_MEETING_CHAIN.indexOf(currentState)
  const start = currentIndex >= 0 ? currentIndex + 1 : 0

  const fireAt: Partial<Record<PipelineState, Date>> = {
    REMINDER_48H: new Date(meetingTime.getTime() - 48 * 60 * 60 * 1000),
    REMINDER_24H: new Date(meetingTime.getTime() - 24 * 60 * 60 * 1000),
    REMINDER_8AM_DAY_OF: eightAmBogota(meetingTime),
    REMINDER_30MIN: new Date(meetingTime.getTime() - 30 * 60 * 1000),
    NO_SHOW: new Date(meetingTime.getTime() + 15 * 60 * 1000),
  }

  for (let index = start; index < PRE_MEETING_CHAIN.length; index += 1) {
    const expectedState = PRE_MEETING_CHAIN[index]
    const notBefore = fireAt[expectedState]
    if (!notBefore) continue
    if (notBefore.getTime() > now.getTime() + 15_000) {
      return { expectedState, notBefore }
    }
  }

  return null
}

const PRE_DEMO_CHAIN: PipelineState[] = [
  "DEMO_CONFIRMATION_SENT",
  "DEMO_REMINDER_48H",
  "DEMO_REMINDER_24H",
  "DEMO_REMINDER_8AM",
  "DEMO_REMINDER_30MIN",
  "NO_SHOW",
]

export function nextPreDemoJob(
  currentState: PipelineState,
  meetingTime: Date,
  now = new Date(),
): { expectedState: PipelineState; notBefore: Date } | null {
  const currentIndex = PRE_DEMO_CHAIN.indexOf(currentState)
  const start = currentIndex >= 0 ? currentIndex + 1 : 0

  const fireAt: Partial<Record<PipelineState, Date>> = {
    DEMO_REMINDER_48H: new Date(meetingTime.getTime() - 48 * 60 * 60 * 1000),
    DEMO_REMINDER_24H: new Date(meetingTime.getTime() - 24 * 60 * 60 * 1000),
    DEMO_REMINDER_8AM: eightAmBogota(meetingTime),
    DEMO_REMINDER_30MIN: new Date(meetingTime.getTime() - 30 * 60 * 1000),
    NO_SHOW: new Date(meetingTime.getTime() + 15 * 60 * 1000),
  }

  for (let index = start; index < PRE_DEMO_CHAIN.length; index += 1) {
    const expectedState = PRE_DEMO_CHAIN[index]
    const notBefore = fireAt[expectedState]
    if (!notBefore) continue
    if (notBefore.getTime() > now.getTime() + 15_000) {
      return { expectedState, notBefore }
    }
  }

  return null
}

export const BUTTON_ACTIONS: Record<string, string> = {
  guide_received: "guide_received",
  "sí, la recibí": "guide_received",
  "si, la recibí": "guide_received",
  "ya la tengo": "guide_received",
  "me llegó": "guide_received",
  "me llego": "guide_received",
  guide_missing: "guide_missing",
  "no me llegó": "guide_missing",
  "no me llego": "guide_missing",
  "no la recibí": "guide_missing",
  "no la recibi": "guide_missing",
  reenvía: "guide_missing",
  reenvia: "guide_missing",
  guide_questions: "guide_questions",
  "tengo dudas": "guide_questions",
  qualify_now: "qualify_now",
  "dale, pregunta": "qualify_now",
  book_direct: "book_direct",
  "prefiero agendar directo": "book_direct",
  book_now: "book_now",
  "sí, quiero agendar": "book_now",
  "si, quiero agendar": "book_now",
  "quiero agendar": "book_now",
  agendar: "book_now",
  not_now: "not_now",
  "no es el momento": "not_now",
  "no me interesa": "not_now",
  stop: "not_now",
  watched_video: "watched_video",
  "ya lo vi": "watched_video",
  "vi el video": "watched_video",
}

export function normalizeButtonAction(value: string) {
  const key = value.trim().toLowerCase()
  return BUTTON_ACTIONS[key] ?? BUTTON_ACTIONS[value] ?? null
}

export function mergeQualificationAnswer(
  current: QualificationAnswers,
  state: PipelineState,
  answer: string,
): QualificationAnswers {
  if (state === "QUALIFYING_Q1") return { ...current, properties: answer }
  if (state === "QUALIFYING_Q2") return { ...current, biggestTimeSink: answer }
  if (state === "QUALIFYING_Q3") return { ...current, hasSystem: answer }
  return current
}

export function originFromQualification(
  qualification: "SQL" | "MQL" | "DISQUALIFIED",
): FunnelOrigin | null {
  if (qualification === "SQL" || qualification === "MQL") return qualification
  return null
}

export { isTerminalState }
