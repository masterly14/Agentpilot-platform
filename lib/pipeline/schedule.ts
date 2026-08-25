import type { PipelineState } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { getPipelineBaseUrl, getQstashClient, isQstashConfigured } from "@/lib/qstash/client"

const EXECUTE_PATH = "/api/pipeline/execute"

export function makeDedupKey(contactId: string, expectedState: PipelineState) {
  // QStash rejects ':' in deduplicationId
  return `${contactId}-${expectedState}-${Date.now()}`
}

export async function deleteQstashMessage(messageId: string | null | undefined) {
  if (!messageId) return
  const qstash = getQstashClient()
  if (!qstash) return
  try {
    await qstash.messages.delete(messageId)
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status?: number }).status)
        : null
    if (status === 404) return
    console.warn("[qstash] no se pudo borrar mensaje", messageId, error)
  }
}

export async function findPendingPipelineJob(pipelineId: string) {
  return prisma.pipelineJob.findFirst({
    where: { pipelineId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  })
}

export async function cancelPendingPipelineJobs(pipelineId: string) {
  const pipeline = await prisma.leadPipeline.findUnique({
    where: { id: pipelineId },
    select: { scheduledJobId: true, scheduledJobDedupKey: true },
  })

  const pending = await prisma.pipelineJob.findMany({
    where: { pipelineId, status: "PENDING" },
  })

  const messageIds = new Set(
    [pipeline?.scheduledJobId, ...pending.map((job) => job.qstashMessageId)].filter(
      (id): id is string => Boolean(id),
    ),
  )

  await Promise.all([...messageIds].map((messageId) => deleteQstashMessage(messageId)))

  if (pending.length) {
    await prisma.pipelineJob.updateMany({
      where: { pipelineId, status: "PENDING" },
      data: { status: "CANCELLED" },
    })
  }

  await prisma.leadPipeline.update({
    where: { id: pipelineId },
    data: {
      scheduledJobId: null,
      scheduledJobDedupKey: null,
    },
  })
}

export async function schedulePipelineJob(input: {
  pipelineId: string
  contactId: string
  expectedState: PipelineState
  delaySeconds?: number
  notBefore?: Date
}) {
  if (!isQstashConfigured()) {
    console.warn("[qstash] no configurado: se omite schedule de", input.expectedState)
    return null
  }

  const qstash = getQstashClient()
  if (!qstash) return null

  const now = Date.now()
  if (input.notBefore && input.notBefore.getTime() <= now + 15_000) {
    return null
  }
  if (input.delaySeconds != null && input.delaySeconds <= 0) {
    return null
  }

  await cancelPendingPipelineJobs(input.pipelineId)

  const dedupKey = makeDedupKey(input.contactId, input.expectedState)
  const body = {
    contactId: input.contactId,
    expectedState: input.expectedState,
    dedupKey,
  }

  let published: { messageId: string }
  try {
    published = await qstash.publishJSON({
      url: `${getPipelineBaseUrl()}${EXECUTE_PATH}`,
      body,
      deduplicationId: dedupKey.slice(0, 128),
      ...(input.notBefore
        ? { notBefore: Math.floor(input.notBefore.getTime() / 1000) }
        : { delay: input.delaySeconds ?? 0 }),
    })
  } catch (error) {
    console.error("[qstash] no se pudo publicar job", input.expectedState, error)
    return null
  }

  await prisma.pipelineJob.create({
    data: {
      pipelineId: input.pipelineId,
      dedupKey,
      expectedState: input.expectedState,
      qstashMessageId: published.messageId,
      status: "PENDING",
    },
  })

  await prisma.leadPipeline.update({
    where: { id: input.pipelineId },
    data: {
      scheduledJobId: published.messageId,
      scheduledJobDedupKey: dedupKey,
    },
  })

  return published.messageId
}
