import type { Contact, FunnelOrigin, LeadPipeline, PipelineState, Prisma } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import {
  canEnterState,
  nextNurtureState,
  nextPreDemoJob,
  nextPreMeetingJob,
  NURTURE_TIMEOUT_SECONDS,
  preMeetingStateAfterReschedule,
  shouldRestartPreMeetingOnReschedule,
  stageForState,
} from "@/lib/pipeline/transitions"
import { cancelPendingPipelineJobs, schedulePipelineJob } from "@/lib/pipeline/schedule"
import { sendPipelineTemplate, sendWhatsAppText } from "@/lib/whatsapp/send-template"
import { firstNameFromFullName } from "@/lib/whatsapp/phone"
import { formatMeetingParts } from "@/lib/pipeline/vars"
import { nextMqlNurtureState } from "@/lib/pipeline/nurture-mql"
import { isTerminalState } from "@/lib/pipeline/states"
import { recordMarketingStage, MARKETING_TRIGGERED_BY } from "@/lib/marketing/events"

const IMMEDIATE_FOLLOWUP: Partial<Record<PipelineState, PipelineState>> = {
  LEAD_MAGNET_DOWNLOADED: "AWAITING_CONFIRMATION",
  MEETING_SCHEDULED: "CONFIRMATION_SENT",
  NO_SHOW: "RESCHEDULE_OFFERED",
}

type StateMessageDelivery =
  | { ok: true; awaitDeliveryReceipt: boolean }
  | { ok: false; awaitDeliveryReceipt: false }

async function loadPipeline(contactId: string) {
  return prisma.leadPipeline.findUnique({
    where: { contactId },
    include: { contact: true },
  })
}

async function hasManualOnlyNurture(pipeline: LeadPipeline) {
  const submission = await prisma.formSubmission.findFirst({
    where: { contactId: pipeline.contactId },
    orderBy: { createdAt: "desc" },
    select: { id: true, qualification: true, entrySource: true, bookedAt: true },
  })
  const disabled = submission?.qualification === "SQL" && !submission.bookedAt
  return { disabled, submission }
}

async function scheduleFollowup(pipeline: LeadPipeline) {
  const nurturePolicy = await hasManualOnlyNurture(pipeline)
  if (nurturePolicy.disabled) {
    if (
      nurturePolicy.submission?.qualification === "SQL" &&
      !nurturePolicy.submission.bookedAt &&
      pipeline.currentState === "AWAITING_CONFIRMATION"
    ) {
      await prisma.leadPipeline.update({
        where: { id: pipeline.id },
        data: { currentState: "COLD_CALL_QUEUED" },
      })
      await recordMarketingStage({
        submissionId: nurturePolicy.submission.id,
        to: "PENDING_CALL",
        triggeredBy: MARKETING_TRIGGERED_BY.system,
      })
    }
    return
  }

  if (isTerminalState(pipeline.currentState) && pipeline.currentState !== "SCHEDULED") {
    return
  }

  if (pipeline.currentState === "DISCOVERY_SUMMARY_SENT") {
    return
  }

  if (pipeline.currentState === "RESCHEDULE_OFFERED") {
    const delaySeconds = NURTURE_TIMEOUT_SECONDS.RESCHEDULE_OFFERED
    if (!delaySeconds) return
    await schedulePipelineJob({
      pipelineId: pipeline.id,
      contactId: pipeline.contactId,
      expectedState: "LONG_TERM_NURTURE",
      delaySeconds,
    })
    return
  }

  if (pipeline.currentStage === "PRE_DEMO" && pipeline.meetingTime) {
    const next = nextPreDemoJob(pipeline.currentState, pipeline.meetingTime)
    if (!next) return
    await schedulePipelineJob({
      pipelineId: pipeline.id,
      contactId: pipeline.contactId,
      expectedState: next.expectedState,
      notBefore: next.notBefore,
    })
    return
  }

  if (pipeline.currentStage === "PRE_MEETING" && pipeline.meetingTime) {
    const next = nextPreMeetingJob(pipeline.currentState, pipeline.meetingTime)
    if (!next) return
    await schedulePipelineJob({
      pipelineId: pipeline.id,
      contactId: pipeline.contactId,
      expectedState: next.expectedState,
      notBefore: next.notBefore,
    })
    return
  }

  const delaySeconds = NURTURE_TIMEOUT_SECONDS[pipeline.currentState]
  const nextState = nextNurtureState(pipeline)
  if (!delaySeconds || !nextState) return

  await schedulePipelineJob({
    pipelineId: pipeline.id,
    contactId: pipeline.contactId,
    expectedState: nextState,
    delaySeconds: pipeline.currentState === "LAST_NURTURE_SENT" && pipeline.funnelOrigin === "MQL"
      ? 24 * 60 * 60
      : delaySeconds,
  })
}

async function deliverStateMessage(
  pipeline: LeadPipeline & { contact: { id: string } },
  state: PipelineState,
): Promise<StateMessageDelivery> {
  const contact = await prisma.contact.findUniqueOrThrow({
    where: { id: pipeline.contactId },
  })

  if (state === "DEMO_CONFIRMATION_SENT" || state === "LOST") {
    return { ok: true, awaitDeliveryReceipt: false }
  }

  if (state === "DISCOVERY_SUMMARY_SENT") {
    try {
      const { sendDiscoverySummaryMessage } = await import("@/lib/pipeline/discovery-summary")
      const result = await sendDiscoverySummaryMessage({ contact, pipeline })
      if (result.skipped === false && result.outcome === "no_fit") {
        await transitionPipeline({ contactId: pipeline.contactId, toState: "LOST" })
      }
    } catch (error) {
      console.error("[pipeline] fallo envío resumen discovery", pipeline.contactId, error)
      return { ok: false, awaitDeliveryReceipt: false }
    }
    return { ok: true, awaitDeliveryReceipt: false }
  }

  try {
    const result = await sendPipelineTemplate({ contact, pipeline, state })
    return result.skipped
      ? { ok: true, awaitDeliveryReceipt: false }
      : { ok: true, awaitDeliveryReceipt: true }
  } catch (error) {
    console.error("[pipeline] fallo envío WhatsApp", state, pipeline.contactId, error)
    return { ok: false, awaitDeliveryReceipt: false }
  }
}

export async function transitionPipeline(input: {
  contactId: string
  toState: PipelineState
  extra?: Prisma.LeadPipelineUpdateInput
}) {
  const current = await loadPipeline(input.contactId)
  if (!current) {
    throw new Error(`No hay pipeline para el contacto ${input.contactId}`)
  }

  if (current.currentState === input.toState) {
    return current
  }

  if (!canEnterState(current.currentState, input.toState) && current.currentState !== "LEAD_MAGNET_DOWNLOADED") {
    console.warn(
      `[pipeline] transición rechazada ${current.currentState} → ${input.toState} (${input.contactId})`,
    )
    return current
  }

  await cancelPendingPipelineJobs(current.id)

  const currentStage = stageForState(input.toState, current.currentStage)
  const updated = await prisma.leadPipeline.update({
    where: { id: current.id },
    data: {
      currentState: input.toState,
      currentStage,
      ...input.extra,
    },
    include: { contact: true },
  })
  const nurturePolicy = await hasManualOnlyNurture(updated)
  if (nurturePolicy.disabled && input.toState !== "AWAITING_CONFIRMATION") {
    if (input.toState === "NO_SHOW" && nurturePolicy.submission) {
      await recordMarketingStage({
        submissionId: nurturePolicy.submission.id,
        to: "PENDING_CALL",
        triggeredBy: MARKETING_TRIGGERED_BY.system,
      })
    }
    return updated
  }

  const delivery = await deliverStateMessage(updated, input.toState)

  const followup = IMMEDIATE_FOLLOWUP[input.toState]
  if (followup) {
    return transitionPipeline({ contactId: input.contactId, toState: followup })
  }

  if (!delivery.ok || delivery.awaitDeliveryReceipt) {
    return updated
  }

  try {
    await scheduleFollowup(updated)
  } catch (error) {
    console.error("[pipeline] no se pudo programar followup", updated.currentState, error)
  }
  return updated
}

export async function executeScheduledStep(input: {
  contactId: string
  expectedState: PipelineState
  dedupKey: string
}) {
  const job = await prisma.pipelineJob.findUnique({
    where: { dedupKey: input.dedupKey },
  })

  if (job?.status === "EXECUTED") {
    return { status: "duplicate" as const }
  }

  const pipeline = await loadPipeline(input.contactId)
  if (!pipeline) {
    return { status: "missing" as const }
  }

  let target = input.expectedState
  if (
    pipeline.currentState === "VIDEO_SENT" &&
    (input.expectedState === "CTA_SENT_SAW_VIDEO" || input.expectedState === "CTA_SENT_NO_VIDEO")
  ) {
    target = pipeline.videoWatched ? "CTA_SENT_SAW_VIDEO" : "CTA_SENT_NO_VIDEO"
  }

  if (!canEnterState(pipeline.currentState, target)) {
    if (job) {
      await prisma.pipelineJob.update({
        where: { id: job.id },
        data: { status: "STALE", executedAt: new Date() },
      })
    }
    console.info("[pipeline] job stale", {
      contactId: input.contactId,
      currentState: pipeline.currentState,
      expectedState: input.expectedState,
      dedupKey: input.dedupKey,
    })
    return { status: "stale" as const }
  }

  if (job) {
    await prisma.pipelineJob.update({
      where: { id: job.id },
      data: { status: "EXECUTED", executedAt: new Date() },
    })
  }

  await transitionPipeline({ contactId: input.contactId, toState: target })
  return { status: "executed" as const, toState: target }
}

export async function scheduleFollowupAfterMessageDelivery(waMessageId: string) {
  const message = await prisma.conversationMessage.findUnique({
    where: { waMessageId },
    include: { conversation: true },
  })
  if (
    !message ||
    message.direction !== "OUTBOUND" ||
    message.status !== "DELIVERED" ||
    !message.pipelineState
  ) {
    return { status: "ignored" as const }
  }

  const pipeline = await loadPipeline(message.conversation.contactId)
  if (
    !pipeline ||
    pipeline.currentState !== message.pipelineState ||
    pipeline.scheduledJobId
  ) {
    return { status: "stale" as const }
  }

  await scheduleFollowup(pipeline)
  return { status: "scheduled" as const }
}

export async function ensureNurturingPipeline(contactId: string, funnelOrigin: FunnelOrigin) {
  const existing = await prisma.leadPipeline.findUnique({
    where: { contactId },
  })

  if (existing) {
    if (
      existing.currentStage === "NURTURING" &&
      existing.currentState === "LEAD_MAGNET_DOWNLOADED"
    ) {
      if (funnelOrigin === "MQL") {
        const next = nextMqlNurtureState(existing)
        if (!next) return existing
        return transitionPipeline({ contactId, toState: next })
      }
      return transitionPipeline({ contactId, toState: "AWAITING_CONFIRMATION" })
    }
    return existing
  }

  await prisma.leadPipeline.create({
    data: {
      contactId,
      funnelOrigin,
      currentStage: "NURTURING",
      currentState: "LEAD_MAGNET_DOWNLOADED",
    },
  })

  if (funnelOrigin === "MQL") {
    const created = await prisma.leadPipeline.findUniqueOrThrow({ where: { contactId } })
    const next = nextMqlNurtureState(created)
    if (!next) return created
    return transitionPipeline({ contactId, toState: next })
  }
  return transitionPipeline({ contactId, toState: "AWAITING_CONFIRMATION" })
}

export async function enterPreMeeting(input: {
  contactId: string
  funnelOrigin?: FunnelOrigin
  meetingId?: string | null
  meetingTime: Date
  meetLink?: string | null
  visitorTimezone?: string | null
}) {
  const existing = await prisma.leadPipeline.findUnique({
    where: { contactId: input.contactId },
  })

  const visitorTimezone = input.visitorTimezone ?? existing?.visitorTimezone ?? null

  if (!existing) {
    await prisma.leadPipeline.create({
      data: {
        contactId: input.contactId,
        funnelOrigin: input.funnelOrigin ?? "DIRECT_BOOKING",
        currentStage: "PRE_MEETING",
        currentState: "MEETING_SCHEDULED",
        meetingId: input.meetingId ?? null,
        meetingTime: input.meetingTime,
        meetLink: input.meetLink ?? null,
        visitorTimezone,
      },
    })
    return transitionPipeline({ contactId: input.contactId, toState: "CONFIRMATION_SENT" })
  }

  if (existing.currentStage === "NURTURING") {
    await cancelPendingPipelineJobs(existing.id)
    await prisma.leadPipeline.update({
      where: { id: existing.id },
      data: {
        currentStage: "PRE_MEETING",
        currentState: "SCHEDULED",
        meetingId: input.meetingId ?? null,
        meetingTime: input.meetingTime,
        meetLink: input.meetLink ?? null,
        visitorTimezone,
      },
    })
    await prisma.leadPipeline.update({
      where: { id: existing.id },
      data: {
        currentState: "MEETING_SCHEDULED",
      },
    })
    return transitionPipeline({ contactId: input.contactId, toState: "CONFIRMATION_SENT" })
  }

  await cancelPendingPipelineJobs(existing.id)
  await prisma.leadPipeline.update({
    where: { id: existing.id },
    data: {
      currentStage: "PRE_MEETING",
      currentState: "MEETING_SCHEDULED",
      meetingId: input.meetingId ?? existing.meetingId,
      meetingTime: input.meetingTime,
      meetLink: input.meetLink ?? existing.meetLink,
      visitorTimezone,
    },
  })
  return transitionPipeline({ contactId: input.contactId, toState: "CONFIRMATION_SENT" })
}

async function notifyMeetingRescheduled(
  pipeline: LeadPipeline & { contact: Contact },
) {
  if (!pipeline.meetingTime) return
  const meeting = formatMeetingParts(pipeline.meetingTime, pipeline.visitorTimezone || undefined)
  const nombre = firstNameFromFullName(pipeline.contact.fullName)
  const kind = pipeline.currentStage === "PRE_DEMO" ? "demo" : "diagnóstico"
  const lines = [
    `Hola ${nombre}, tu ${kind} quedó reagendado para el ${meeting.fecha} a las ${meeting.hora}.`,
  ]
  if (pipeline.meetLink) {
    lines.push(`Link de la reunión: ${pipeline.meetLink}`)
  }

  await sendWhatsAppText({
    contact: pipeline.contact,
    body: lines.join("\n\n"),
    pipelineState: pipeline.currentState,
  })
}

export async function rescheduleMeeting(input: {
  contactId: string
  meetingTime: Date
  meetingId?: string | null
  meetLink?: string | null
  visitorTimezone?: string | null
  notify?: boolean
}) {
  const existing = await prisma.leadPipeline.findUnique({
    where: { contactId: input.contactId },
    include: { contact: true },
  })

  if (!existing || shouldRestartPreMeetingOnReschedule(existing.currentStage, existing.currentState)) {
    return enterPreMeeting({
      contactId: input.contactId,
      funnelOrigin: existing?.funnelOrigin,
      meetingId: input.meetingId ?? existing?.meetingId,
      meetingTime: input.meetingTime,
      meetLink: input.meetLink ?? existing?.meetLink,
      visitorTimezone: input.visitorTimezone ?? existing?.visitorTimezone,
    })
  }

  const previousTime = existing.meetingTime
  const previousState = existing.currentState

  await cancelPendingPipelineJobs(existing.id)

  const rewindPreMeeting = existing.currentStage === "PRE_MEETING"
  const restartPreDemo = existing.currentStage === "PRE_DEMO" && existing.currentState === "NEED_RESCHEDULE"
  const updated = await prisma.leadPipeline.update({
    where: { id: existing.id },
    data: {
      ...(rewindPreMeeting
        ? {
            currentStage: "PRE_MEETING" as const,
            currentState: preMeetingStateAfterReschedule(existing.currentState),
          }
        : restartPreDemo
          ? { currentState: "DEMO_CONFIRMATION_SENT" as const }
          : {}),
      meetingId: input.meetingId !== undefined ? input.meetingId : existing.meetingId,
      meetingTime: input.meetingTime,
      meetLink: input.meetLink !== undefined ? input.meetLink : existing.meetLink,
      visitorTimezone:
        input.visitorTimezone !== undefined ? input.visitorTimezone : existing.visitorTimezone,
    },
    include: { contact: true },
  })

  console.info("[pipeline] reunión reagendada", {
    contactId: input.contactId,
    previousState,
    previousTime: previousTime?.toISOString() ?? null,
    meetingTime: input.meetingTime.toISOString(),
    visitorTimezone: updated.visitorTimezone,
  })

  try {
    await scheduleFollowup(updated)
  } catch (error) {
    console.error("[pipeline] no se pudo reprogramar followup tras reagendar", error)
  }

  if (input.notify !== false) {
    try {
      await notifyMeetingRescheduled(updated)
    } catch (error) {
      console.error("[pipeline] no se pudo notificar reagendamiento", input.contactId, error)
    }
  }

  return updated
}

export async function markAttended(contactId: string) {
  return transitionPipeline({ contactId, toState: "ATTENDED" })
}

export async function enterPreDemo(input: {
  contactId: string
  meetingTime: Date
  painPoint: string
  meetingId?: string | null
  meetLink?: string | null
}) {
  const existing = await prisma.leadPipeline.findUnique({
    where: { contactId: input.contactId },
  })

  const extra = {
    painPoint: input.painPoint,
    meetingTime: input.meetingTime,
    meetingId: input.meetingId !== undefined ? input.meetingId : (existing?.meetingId ?? null),
    meetLink: input.meetLink !== undefined ? input.meetLink : (existing?.meetLink ?? null),
  }

  if (!existing) {
    await prisma.leadPipeline.create({
      data: {
        contactId: input.contactId,
        funnelOrigin: "DIRECT_BOOKING",
        currentStage: "PRE_DEMO",
        currentState: "ATTENDED",
        ...extra,
      },
    })
    return transitionPipeline({
      contactId: input.contactId,
      toState: "DEMO_CONFIRMATION_SENT",
    })
  }

  await prisma.leadPipeline.update({
    where: { id: existing.id },
    data: extra,
  })

  if (existing.currentState === "DEMO_CONFIRMATION_SENT") {
    await cancelPendingPipelineJobs(existing.id)
    const refreshed = await prisma.leadPipeline.findUniqueOrThrow({
      where: { id: existing.id },
    })
    try {
      await scheduleFollowup(refreshed)
    } catch (error) {
      console.error("[pipeline] no se pudo programar followup de demo", error)
    }
    return refreshed
  }

  return transitionPipeline({
    contactId: input.contactId,
    toState: "DEMO_CONFIRMATION_SENT",
    extra,
  })
}

export async function discardAfterDiscovery(contactId: string) {
  return transitionPipeline({ contactId, toState: "LOST" })
}

export async function markVideoWatched(contactId: string) {
  await prisma.leadPipeline.updateMany({
    where: { contactId, videoWatched: false },
    data: {
      videoWatched: true,
      pixelFiredAt: new Date(),
    },
  })

  return prisma.leadPipeline.findUnique({
    where: { contactId },
  })
}
