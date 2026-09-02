export {
  initialPipelineForOrigin,
  isNurturingState,
  isPostDemoState,
  isPreDemoState,
  isPreMeetingState,
  isStateInStage,
  isTerminalState,
  NURTURING_STATES,
  POST_DEMO_STATES,
  PRE_DEMO_STATES,
  PRE_MEETING_STATES,
  STATES_BY_STAGE,
  TERMINAL_STATES,
} from "./states"

export {
  discardAfterDiscovery,
  ensureNurturingPipeline,
  enterPreDemo,
  enterPreMeeting,
  transitionPipeline,
} from "./engine"
export { nextMqlNurtureState } from "./nurture-mql"
export { upsertContactFromLead } from "./contact"
export {
  buildDiscoverySummaryMessage,
  processDiscoveryFollowup,
  sendDiscoverySummaryMessage,
} from "./discovery-summary"

export type {
  AnyPipelineState,
  FunnelOrigin,
  NurturingState,
  PipelineStage,
  PipelineState,
  PostDemoState,
  PreDemoState,
  PreMeetingState,
} from "./states"
