export const LANDING_VIDEO = {
  id: "diagnosis-hero",
  src: "https://2txoh5q7vu.ucarecd.net/e095e9ce-cdee-4dd3-a9a5-9d35e5be4ecd/videoh264.mp4",
  poster: "/landing/diagnosis-hero-poster.jpg",
  unlockAtSeconds: 77,
  fastProgressShare: 0.7,
  completeAtRatio: 0.95,
} as const

export function effectiveUnlockAt(durationSeconds: number) {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return LANDING_VIDEO.unlockAtSeconds
  }
  return Math.min(LANDING_VIDEO.unlockAtSeconds, durationSeconds * LANDING_VIDEO.completeAtRatio)
}

export function displayedProgress(
  currentTime: number,
  duration: number,
  unlockAt = LANDING_VIDEO.unlockAtSeconds,
) {
  if (!Number.isFinite(duration) || duration <= 0) return 0
  const time = clamp(currentTime, 0, duration)
  const hookEndsAt = Math.min(unlockAt, duration)

  if (hookEndsAt >= duration - 0.05) {
    const p = time / duration
    return easeOutQuad(p)
  }

  const fastShare = LANDING_VIDEO.fastProgressShare
  if (time <= hookEndsAt) {
    return fastShare * easeOutQuad(time / hookEndsAt)
  }

  return fastShare + (1 - fastShare) * ((time - hookEndsAt) / (duration - hookEndsAt))
}

export function formatVideoClock(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, "0")}`
}

function easeOutQuad(t: number) {
  const p = clamp(t, 0, 1)
  return 1 - (1 - p) * (1 - p)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
