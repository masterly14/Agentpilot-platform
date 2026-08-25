import type { VideoDropReason, VideoWatchSession } from "@/prisma/generated/client"
import { effectiveUnlockAt, formatVideoClock } from "@/lib/landing-video"

export type VideoRetentionBucket = {
  second: number
  label: string
  reached: number
  rate: number
}

export type VideoRetentionReport = {
  started: number
  uniqueVisitors: number
  unlocked: number
  completed: number
  unlockRate: number
  completeRate: number
  durationSeconds: number
  unlockAtSeconds: number
  medianDropSecond: number | null
  buckets: VideoRetentionBucket[]
  dropReasons: { reason: VideoDropReason; count: number }[]
}

const REASON_ORDER: VideoDropReason[] = ["SCROLL", "PAUSE", "TAB_HIDDEN", "PAGE_LEAVE", "ENDED"]

export function buildVideoRetention(
  sessions: Pick<
    VideoWatchSession,
    | "visitorId"
    | "maxSecond"
    | "durationSeconds"
    | "unlocked"
    | "completed"
    | "droppedAtSecond"
    | "dropReason"
  >[],
): VideoRetentionReport {
  const started = sessions.length
  const uniqueVisitors = new Set(sessions.map((session) => session.visitorId)).size
  const unlocked = sessions.filter((session) => session.unlocked).length
  const completed = sessions.filter((session) => session.completed).length
  const durationSeconds = Math.max(0, ...sessions.map((session) => session.durationSeconds), 0)
  const unlockAtSeconds = effectiveUnlockAt(durationSeconds || 77)
  const bucketSize = durationSeconds > 180 ? 10 : 5

  const buckets: VideoRetentionBucket[] = []
  if (started > 0 && durationSeconds > 0) {
    for (let second = 0; second <= durationSeconds; second += bucketSize) {
      const reached = sessions.filter((session) => session.maxSecond >= second).length
      buckets.push({
        second,
        label: formatVideoClock(second),
        reached,
        rate: reached / started,
      })
    }
    const last = buckets.at(-1)
    if (!last || last.second < durationSeconds) {
      const reached = sessions.filter((session) => session.maxSecond >= durationSeconds).length
      buckets.push({
        second: durationSeconds,
        label: formatVideoClock(durationSeconds),
        reached,
        rate: reached / started,
      })
    }
  }

  const dropSamples = sessions
    .filter((session) => !session.completed)
    .map((session) => session.droppedAtSecond ?? session.maxSecond)
    .sort((a, b) => a - b)
  const medianDropSecond = dropSamples.length ? dropSamples[Math.floor(dropSamples.length / 2)]! : null

  const reasonCounts = new Map<VideoDropReason, number>()
  for (const session of sessions) {
    if (!session.dropReason) continue
    reasonCounts.set(session.dropReason, (reasonCounts.get(session.dropReason) ?? 0) + 1)
  }

  return {
    started,
    uniqueVisitors,
    unlocked,
    completed,
    unlockRate: started ? unlocked / started : 0,
    completeRate: started ? completed / started : 0,
    durationSeconds,
    unlockAtSeconds,
    medianDropSecond,
    buckets,
    dropReasons: REASON_ORDER.filter((reason) => reasonCounts.has(reason)).map((reason) => ({
      reason,
      count: reasonCounts.get(reason) ?? 0,
    })),
  }
}
