import type { Prisma } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import {
  ATTRIBUTION_FIELDS,
  type AttributionPayload,
  type ClientContext,
} from "@/lib/marketing/types"
import {
  attributionFromCookies,
  compactAttribution,
  mergeAttribution,
  trimToUndefined,
} from "@/lib/marketing/cookies"

export function parseAttributionInput(value: unknown): AttributionPayload {
  if (!value || typeof value !== "object") return {}
  const record = value as Record<string, unknown>
  const payload: AttributionPayload = {}
  for (const field of ATTRIBUTION_FIELDS) {
    const raw = record[field]
    if (typeof raw === "string") {
      const trimmed = trimToUndefined(raw)
      if (trimmed) payload[field] = trimmed
    }
  }
  return compactAttribution(payload)
}

export function attributionFromRequest(request: Request, body?: unknown): AttributionPayload {
  const bodyAttribution =
    body && typeof body === "object"
      ? parseAttributionInput((body as Record<string, unknown>).attribution)
      : {}
  const cookieAttribution = attributionFromCookies(request.headers.get("cookie"))
  return mergeAttribution(bodyAttribution, cookieAttribution)
}

export function clientContextFromRequest(request: Request): ClientContext {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip =
    trimToUndefined(forwarded?.split(",")[0]) ||
    trimToUndefined(request.headers.get("x-real-ip"))
  const userAgent = trimToUndefined(request.headers.get("user-agent"))
  return { ip, userAgent }
}

export function firstTouchAttributionData(
  existing: Partial<Record<keyof AttributionPayload, string | null>> | null | undefined,
  incoming: AttributionPayload,
): AttributionPayload {
  const next: AttributionPayload = {}
  for (const field of ATTRIBUTION_FIELDS) {
    if (trimToUndefined(existing?.[field] ?? undefined)) continue
    const value = trimToUndefined(incoming[field])
    if (value) next[field] = value
  }
  return next
}

export function toAttributionUpdate(
  incoming: AttributionPayload,
): Prisma.FormSubmissionUpdateInput {
  const data: Prisma.FormSubmissionUpdateInput = {}
  for (const field of ATTRIBUTION_FIELDS) {
    const value = incoming[field]
    if (value) data[field] = value
  }
  return data
}

export async function applyFirstTouchAttribution(
  submissionId: string,
  incoming: AttributionPayload,
) {
  const existing = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    select: {
      fbclid: true,
      fbp: true,
      fbc: true,
      utmSource: true,
      utmMedium: true,
      utmCampaign: true,
      utmContent: true,
      utmTerm: true,
      landingPath: true,
      referrer: true,
    },
  })
  if (!existing) return
  const patch = firstTouchAttributionData(existing, incoming)
  const data = toAttributionUpdate(patch)
  if (Object.keys(data).length === 0) return
  await prisma.formSubmission.update({
    where: { id: submissionId },
    data,
  })
}
