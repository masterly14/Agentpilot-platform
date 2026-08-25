import type { FunnelOrigin, LeadPipeline, PipelineState, Prisma } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import {
  canEnterState,
  nextNurtureState,
  nextPreMeetingJob,
  NURTURE_TIMEOUT_SECONDS,
  stageForState,
} from "@/lib/pipeline/transitions"
import { cancelPendingPipelineJobs, schedulePipelineJob } from "@/lib/pipeline/schedule"
import { sendPipelineTemplate, sendWhatsAppText } from "@/lib/whatsapp/send-template"
import { MQL_QUESTIONS } from "@/lib/pipeline/qualify-mql"
import { isTerminalState } from "@/lib/pipeline/states"
import {
  findLatestSubmissionIdByContact,
  MARKETING_TRIGGERED_BY,
  recordMarketingStage,
} from "@/lib/marketing/events"

const IMMEDIATE_FOLLOWUP: Partial<Record<PipelineState, PipelineState>> = {
  LEAD_MAGNET_DOWNLOADED: "AWAITING_CONFIRMATION",
  MEETING_SCHEDULED: "CONFIRMATION_SENT",
  NO_SHOW: "RESCHEDULE_OFFERED",
}

async function loadPipeline(contactId: string) {
  return prisma.leadPipeline.findUnique({
    where: { contactId },
    include: { contact: true },
  })
}

async function scheduleFollowup(pipeline: LeadPipeline) {
  if (isTerminalState(pipeline.currentState) && pipeline.currentState !== "SCHEDULED") {
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
) {
  const contact = await prisma.contact.findUniqueOrThrow({
    where: { id: pipeline.contactId },
  })

  if (state === "QUALIFYING_Q1" || state === "QUALIFYING_Q2" || state === "QUALIFYING_Q3") {
    try {
      await sendWhatsAppText({
        contact,
        body: MQL_QUESTIONS[state],
        pipelineState: state,
      })
    } catch (error) {
      console.error("[pipeline] fallo envío WhatsApp texto", state, pipeline.contactId, error)
    }
    return
  }

  try {
    await sendPipelineTemplate({ contact, pipeline, state })
  } catch (error) {
    console.error("[pipeline] fallo envío WhatsApp", state, pipeline.contactId, error)
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

  await deliverStateMessage(updated, input.toState)

  const followup = IMMEDIATE_FOLLOWUP[input.toState]
  if (followup) {
    return transitionPipeline({ contactId: input.contactId, toState: followup })
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

export async function ensureNurturingPipeline(contactId: string, funnelOrigin: FunnelOrigin) {
  const existing = await prisma.leadPipeline.findUnique({
    where: { contactId },
  })

  if (existing) {
    if (existing.currentStage === "NURTURING" && existing.currentState === "LEAD_MAGNET_DOWNLOADED") {
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

  return transitionPipeline({ contactId, toState: "AWAITING_CONFIRMATION" })
}

export async function enterPreMeeting(input: {
  contactId: string
  funnelOrigin?: FunnelOrigin
  meetingId?: string | null
  meetingTime: Date
  meetLink?: string | null
}) {
  const existing = await prisma.leadPipeline.findUnique({
    where: { contactId: input.contactId },
  })

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
    },
  })
  return transitionPipeline({ contactId: input.contactId, toState: "CONFIRMATION_SENT" })
}

export async function markAttended(contactId: string) {
  return transitionPipeline({ contactId, toState: "ATTENDED" })
}

export async function markVideoWatched(contactId: string) {
  const pipeline = await prisma.leadPipeline.update({
    where: { contactId },
    data: {
      videoWatched: true,
      pixelFiredAt: new Date(),
    },
  })

  const submissionId = await findLatestSubmissionIdByContact(contactId)
  if (!submissionId) {
    console.error("[marketing] ViewContent sin lead_id", contactId)
    return pipeline
  }

  await recordMarketingStage({
    submissionId,
    to: "VIDEO_SENT",
    triggeredBy: MARKETING_TRIGGERED_BY.system,
  })

  return pipeline
}
