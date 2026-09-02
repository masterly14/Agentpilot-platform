import type {
  FunnelOrigin,
  PipelineStage,
  PipelineState,
} from "@/prisma/generated/client"

export type { FunnelOrigin, PipelineStage, PipelineState }

export type NurturingState =
  | "LEAD_MAGNET_DOWNLOADED"
  | "AWAITING_CONFIRMATION"
  | "QUALIFICATION_OFFERED"
  | "QUALIFYING_Q1"
  | "QUALIFYING_Q2"
  | "QUALIFYING_Q3"
  | "FIT_CONFIRMED"
  | "DISQUALIFIED"
  | "VIDEO_SENT"
  | "CTA_SENT_SAW_VIDEO"
  | "CTA_SENT_NO_VIDEO"
  | "LAST_NURTURE_SENT"
  | "COLD_CALL_QUEUED"
  | "SCHEDULED"
  | "LOST"
  | "LONG_TERM_NURTURE"

export type PreMeetingState =
  | "MEETING_SCHEDULED"
  | "CONFIRMATION_SENT"
  | "REMINDER_48H"
  | "REMINDER_24H"
  | "REMINDER_8AM_DAY_OF"
  | "REMINDER_30MIN"
  | "NEED_RESCHEDULE"
  | "ATTENDED"
  | "NO_SHOW"
  | "RESCHEDULE_OFFERED"

export type PreDemoState =
  | "DISCOVERY_COMPLETED"
  | "DISCOVERY_SUMMARY_SENT"
  | "DEMO_CONFIRMATION_SENT"
  | "DEMO_REMINDER_48H"
  | "DEMO_REMINDER_24H"
  | "DEMO_REMINDER_8AM"
  | "DEMO_REMINDER_30MIN"
  | "ATTENDED"
  | "NO_SHOW"
  | "RESCHEDULE_OFFERED"

export type PostDemoState =
  | "QUOTE_PRESENTED"
  | "WON"
  | "FORMAL_PROPOSAL_SENT"
  | "FOLLOWUP_48H"
  | "FOLLOWUP_5_7_DAYS"
  | "CUTOFF_20_DAYS"
  | "LONG_TERM_NURTURE"
  | "LOST"

export type AnyPipelineState = PipelineState

export const NURTURING_STATES = [
  "LEAD_MAGNET_DOWNLOADED",
  "AWAITING_CONFIRMATION",
  "QUALIFICATION_OFFERED",
  "QUALIFYING_Q1",
  "QUALIFYING_Q2",
  "QUALIFYING_Q3",
  "FIT_CONFIRMED",
  "DISQUALIFIED",
  "VIDEO_SENT",
  "CTA_SENT_SAW_VIDEO",
  "CTA_SENT_NO_VIDEO",
  "LAST_NURTURE_SENT",
  "COLD_CALL_QUEUED",
  "SCHEDULED",
  "LOST",
  "LONG_TERM_NURTURE",
] as const satisfies readonly NurturingState[]

export const PRE_MEETING_STATES = [
  "MEETING_SCHEDULED",
  "CONFIRMATION_SENT",
  "REMINDER_48H",
  "REMINDER_24H",
  "REMINDER_8AM_DAY_OF",
  "REMINDER_30MIN",
  "NEED_RESCHEDULE",
  "ATTENDED",
  "NO_SHOW",
  "RESCHEDULE_OFFERED",
] as const satisfies readonly PreMeetingState[]

export const PRE_DEMO_STATES = [
  "DISCOVERY_COMPLETED",
  "DISCOVERY_SUMMARY_SENT",
  "DEMO_CONFIRMATION_SENT",
  "DEMO_REMINDER_48H",
  "DEMO_REMINDER_24H",
  "DEMO_REMINDER_8AM",
  "DEMO_REMINDER_30MIN",
  "ATTENDED",
  "NO_SHOW",
  "RESCHEDULE_OFFERED",
] as const satisfies readonly PreDemoState[]

export const POST_DEMO_STATES = [
  "QUOTE_PRESENTED",
  "WON",
  "FORMAL_PROPOSAL_SENT",
  "FOLLOWUP_48H",
  "FOLLOWUP_5_7_DAYS",
  "CUTOFF_20_DAYS",
  "LONG_TERM_NURTURE",
  "LOST",
] as const satisfies readonly PostDemoState[]

export const STATES_BY_STAGE = {
  NURTURING: NURTURING_STATES,
  PRE_MEETING: PRE_MEETING_STATES,
  PRE_DEMO: PRE_DEMO_STATES,
  POST_DEMO: POST_DEMO_STATES,
} as const satisfies Record<PipelineStage, readonly PipelineState[]>

export const TERMINAL_STATES = [
  "DISQUALIFIED",
  "SCHEDULED",
  "LOST",
  "LONG_TERM_NURTURE",
  "ATTENDED",
  "WON",
] as const satisfies readonly PipelineState[]

const TERMINAL_STATE_SET = new Set<PipelineState>(TERMINAL_STATES)

export function isNurturingState(state: PipelineState): state is NurturingState {
  return (NURTURING_STATES as readonly PipelineState[]).includes(state)
}

export function isPreMeetingState(state: PipelineState): state is PreMeetingState {
  return (PRE_MEETING_STATES as readonly PipelineState[]).includes(state)
}

export function isPreDemoState(state: PipelineState): state is PreDemoState {
  return (PRE_DEMO_STATES as readonly PipelineState[]).includes(state)
}

export function isPostDemoState(state: PipelineState): state is PostDemoState {
  return (POST_DEMO_STATES as readonly PipelineState[]).includes(state)
}

export function isStateInStage(stage: PipelineStage, state: PipelineState) {
  return (STATES_BY_STAGE[stage] as readonly PipelineState[]).includes(state)
}

export function isTerminalState(state: PipelineState) {
  return TERMINAL_STATE_SET.has(state)
}

export function initialPipelineForOrigin(funnelOrigin: FunnelOrigin): {
  funnelOrigin: FunnelOrigin
  currentStage: PipelineStage
  currentState: PipelineState
} {
  if (funnelOrigin === "DIRECT_BOOKING") {
    return {
      funnelOrigin,
      currentStage: "PRE_MEETING",
      currentState: "MEETING_SCHEDULED",
    }
  }

  return {
    funnelOrigin,
    currentStage: "NURTURING",
    currentState: "LEAD_MAGNET_DOWNLOADED",
  }
}
