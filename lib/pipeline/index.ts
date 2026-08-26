export {
  initialPipelineForOrigin,
  isMqlOnlyState,
  isNurturingState,
  isPostDemoState,
  isPreDemoState,
  isPreMeetingState,
  isStateInStage,
  isTerminalState,
  MQL_ONLY_STATES,
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
  QualificationAnswers,
} from "./states"
