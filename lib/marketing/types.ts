import type {
  ContractPlan,
  MarketingEventName,
  MarketingFunnelStage,
} from "@/prisma/generated/client"
import type { AttributionPayload } from "@/lib/marketing/cookies"

export type { AttributionPayload, ContractPlan, MarketingEventName, MarketingFunnelStage }

export type ClientContext = {
  ip?: string
  userAgent?: string
}

export const ATTRIBUTION_FIELDS = [
  "fbclid",
  "fbp",
  "fbc",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "landingPath",
  "referrer",
] as const satisfies readonly (keyof AttributionPayload)[]

export const META_EVENT_NAME: Record<MarketingEventName, string> = {
  VIEW_CONTENT: "ViewContent",
  LEAD: "Lead",
  SCHEDULE: "Schedule",
  SHOW_UP: "ShowUp",
  PURCHASE: "Purchase",
}

export const EVENT_VALUE: Record<Exclude<MarketingEventName, "PURCHASE">, number> = {
  VIEW_CONTENT: 1,
  LEAD: 0,
  SCHEDULE: 25,
  SHOW_UP: 60,
}

export const STAGE_EVENT: Partial<Record<MarketingFunnelStage, MarketingEventName>> = {
  LEAD_MAGNET_SENT: "LEAD",
  VIDEO_SENT: "VIEW_CONTENT",
  SCHEDULED: "SCHEDULE",
  SHOWED_UP: "SHOW_UP",
  PURCHASED: "PURCHASE",
}

export const STAGE_RANK: Record<MarketingFunnelStage, number> = {
  LEAD_MAGNET_SENT: 1,
  VIDEO_SENT: 2,
  SCHEDULED: 3,
  SHOWED_UP: 4,
  NO_SHOW: 4,
  PURCHASED: 5,
}

export const CONTRACT_PLANS = ["THREE_MONTH", "FIVE_MONTH", "OTHER"] as const

export function isContractPlan(value: unknown): value is ContractPlan {
  return typeof value === "string" && CONTRACT_PLANS.includes(value as ContractPlan)
}

export function eventIdFor(submissionId: string, eventName: MarketingEventName) {
  return `${submissionId}-${META_EVENT_NAME[eventName]}`
}

export function canAdvanceMarketingStage(
  current: MarketingFunnelStage | null | undefined,
  next: MarketingFunnelStage,
) {
  if (!current) return true
  if (current === next) return true
  if (current === "PURCHASED") return false
  if (
    (current === "NO_SHOW" && next === "SHOWED_UP") ||
    (current === "SHOWED_UP" && next === "NO_SHOW")
  ) {
    return true
  }
  if (next === "VIDEO_SENT" && STAGE_RANK[current] >= STAGE_RANK.SCHEDULED) {
    return false
  }
  return STAGE_RANK[next] >= STAGE_RANK[current]
}
