import { Prisma, type ContractPlan, type MarketingFunnelStage } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { getAppUrl } from "@/lib/ebook/app-url"
import { applyFirstTouchAttribution } from "@/lib/marketing/attribution"
import { enqueueCapiSend } from "@/lib/marketing/enqueue"
import {
  canAdvanceMarketingStage,
  EVENT_VALUE,
  eventIdFor,
  STAGE_EVENT,
  type AttributionPayload,
  type ClientContext,
} from "@/lib/marketing/types"

const TRIGGERED_BY_SYSTEM = "system"

export const MARKETING_TRIGGERED_BY = {
  system: TRIGGERED_BY_SYSTEM,
  admin: "user:admin",
} as const

type AdvanceMarketingFunnelInput = {
  submissionId: string
  to: MarketingFunnelStage
  triggeredBy: string
  eventSourceUrl?: string
  contractValueUsd?: number
  contractPlan?: ContractPlan | null
  client?: ClientContext
}

export async function findLatestSubmissionIdByContact(contactId: string) {
  const row = await prisma.formSubmission.findFirst({
    where: { contactId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  })
  return row?.id ?? null
}

export async function advanceMarketingFunnel(input: AdvanceMarketingFunnelInput) {
  const submission = await prisma.formSubmission.findUnique({
    where: { id: input.submissionId },
  })

  if (!submission) {
    console.error("[marketing] evento sin lead_id", input.submissionId, input.to)
    return null
  }

  if (!canAdvanceMarketingStage(submission.marketingFunnelStage, input.to)) {
    return { submission, event: null, eventId: null }
  }

  const eventName = STAGE_EVENT[input.to]
  const purchaseValue =
    input.to === "PURCHASED"
      ? input.contractValueUsd ?? Number(submission.contractValueUsd ?? 0)
      : undefined

  if (input.to === "PURCHASED" && (!purchaseValue || purchaseValue <= 0)) {
    throw new Error("Purchase requiere contractValueUsd")
  }

  const updated = await prisma.formSubmission.update({
    where: { id: submission.id },
    data: {
      marketingFunnelStage: input.to,
      ...(input.to === "PURCHASED"
        ? {
            contractValueUsd: purchaseValue,
            ...(input.contractPlan ? { contractPlan: input.contractPlan } : {}),
          }
        : {}),
    },
  })

  if (!eventName) {
    return { submission: updated, event: null, eventId: null }
  }

  const value = eventName === "PURCHASE" ? purchaseValue! : EVENT_VALUE[eventName]
  const eventId = eventIdFor(submission.id, eventName)
  const eventSourceUrl =
    input.eventSourceUrl ||
    (updated.landingPath ? `${getAppUrl()}${updated.landingPath}` : getAppUrl())

  try {
    const event = await prisma.leadEvent.create({
      data: {
        id: eventId,
        submissionId: submission.id,
        eventName,
        eventSourceUrl,
        value,
        triggeredBy: input.triggeredBy,
        clientIp: input.client?.ip,
        clientUserAgent: input.client?.userAgent,
      },
    })
    await enqueueCapiSend(event.id)
    return { submission: updated, event, eventId }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await prisma.leadEvent.findUnique({ where: { id: eventId } })
      if (existing && !existing.sentToMeta) {
        await enqueueCapiSend(existing.id)
      }
      return { submission: updated, event: existing, eventId }
    }
    throw error
  }
}

export async function recordMarketingStage(
  input: AdvanceMarketingFunnelInput & { attribution?: AttributionPayload },
) {
  try {
    if (input.attribution) {
      await applyFirstTouchAttribution(input.submissionId, input.attribution)
    }
    return await advanceMarketingFunnel(input)
  } catch (error) {
    console.error("[marketing] no se pudo registrar etapa", input.to, input.submissionId, error)
    return null
  }
}
