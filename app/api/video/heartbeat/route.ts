import { z } from "zod"
import { NextResponse } from "next/server"
import { VideoDropReason } from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"
import { LANDING_VIDEO } from "@/lib/landing-video"
import { markVideoWatched } from "@/lib/pipeline/engine"

export const runtime = "nodejs"

const VIDEO_IDS = new Set<string>([LANDING_VIDEO.id])
const DROP_REASONS = new Set<string>(Object.values(VideoDropReason))
const VIDEO_WATCHED_RATIO = 0.5

const heartbeatSchema = z.object({
  sessionId: z.string().trim().min(1).max(64).optional(),
  visitorId: z.string().trim().min(8).max(80),
  leadToken: z.string().trim().min(1).max(128).optional(),
  videoId: z.string().trim().min(1).max(64),
  currentTime: z.number().finite().min(0).max(60 * 60 * 6),
  duration: z.number().finite().min(0).max(60 * 60 * 6),
  unlocked: z.boolean().optional(),
  completed: z.boolean().optional(),
  dropReason: z.string().optional(),
})

function asDropReason(value: string | undefined): VideoDropReason | undefined {
  if (!value || !DROP_REASONS.has(value)) return undefined
  return value as VideoDropReason
}

async function markLeadVideoWatched(token: string | undefined, watchedSeconds: number, durationSeconds: number) {
  if (!token || durationSeconds <= 0 || watchedSeconds < durationSeconds * VIDEO_WATCHED_RATIO) return

  const submission = await prisma.formSubmission.findUnique({
    where: { pdfToken: token },
    select: { contactId: true },
  })
  if (submission?.contactId) {
    await markVideoWatched(submission.contactId)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = heartbeatSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const payload = parsed.data
    if (!VIDEO_IDS.has(payload.videoId)) {
      return NextResponse.json({ error: "Video desconocido" }, { status: 400 })
    }

    const maxSecond = Math.floor(payload.currentTime)
    const durationSeconds = Math.floor(payload.duration)
    const dropReason = asDropReason(payload.dropReason)
    const completed = Boolean(payload.completed) || (durationSeconds > 0 && maxSecond >= durationSeconds * 0.95)
    const unlocked = Boolean(payload.unlocked) || completed

    const data = {
      visitorId: payload.visitorId,
      videoId: payload.videoId,
      lastHeartbeatAt: new Date(),
      maxSecond,
      durationSeconds,
      unlocked,
      completed,
      droppedAtSecond: dropReason ? maxSecond : undefined,
      dropReason: completed ? VideoDropReason.ENDED : dropReason,
    }

    if (payload.sessionId) {
      const existing = await prisma.videoWatchSession.findUnique({
        where: { id: payload.sessionId },
        select: {
          id: true,
          maxSecond: true,
          durationSeconds: true,
          unlocked: true,
          completed: true,
        },
      })

      if (existing) {
        const nextCompleted = existing.completed || data.completed
        const session = await prisma.videoWatchSession.update({
          where: { id: existing.id },
          data: {
            lastHeartbeatAt: data.lastHeartbeatAt,
            maxSecond: Math.max(existing.maxSecond, data.maxSecond),
            durationSeconds: Math.max(existing.durationSeconds, data.durationSeconds),
            unlocked: existing.unlocked || data.unlocked || nextCompleted,
            completed: nextCompleted,
            ...(nextCompleted
              ? {
                  droppedAtSecond: Math.max(existing.durationSeconds, data.durationSeconds),
                  dropReason: VideoDropReason.ENDED,
                }
              : data.dropReason
                ? {
                    droppedAtSecond: data.droppedAtSecond,
                    dropReason: data.dropReason,
                  }
                : {}),
          },
          select: { id: true, maxSecond: true, durationSeconds: true },
        })
        await markLeadVideoWatched(payload.leadToken, session.maxSecond, session.durationSeconds)
        return NextResponse.json({ sessionId: session.id })
      }
    }

    const session = await prisma.videoWatchSession.create({
      data,
      select: { id: true, maxSecond: true, durationSeconds: true },
    })
    await markLeadVideoWatched(payload.leadToken, session.maxSecond, session.durationSeconds)
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("[video/heartbeat]", error)
    return NextResponse.json({ error: "No se pudo registrar" }, { status: 500 })
  }
}
