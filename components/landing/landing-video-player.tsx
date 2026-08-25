"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from "lucide-react"
import {
  displayedProgress,
  effectiveUnlockAt,
  LANDING_VIDEO,
} from "@/lib/landing-video"
import { cn } from "@/lib/utils"
import { useScrollLock } from "./scroll-lock-provider"

const VISITOR_KEY = "ap.video.visitor.v1"
const HEARTBEAT_MS = 5000
const PAUSE_DROP_MS = 10000

type DropReason = "PAUSE" | "TAB_HIDDEN" | "PAGE_LEAVE" | "SCROLL" | "ENDED"

function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    window.localStorage.setItem(VISITOR_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function LandingVideoPlayer() {
  const { unlock } = useScrollLock()
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef<string | null>(null)
  const visitorIdRef = useRef("")
  const maxPlayedRef = useRef(0)
  const durationRef = useRef(0)
  const unlockedRef = useRef(false)
  const completedRef = useRef(false)
  const pausedByUsRef = useRef(false)
  const pauseTimerRef = useRef<number | null>(null)
  const inflightRef = useRef<Promise<void> | null>(null)

  const hasStartedRef = useRef(false)
  const playRef = useRef<() => Promise<void>>(async () => undefined)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [playbackError, setPlaybackError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const syncBar = useCallback((time: number, duration: number) => {
    if (!barRef.current) return
    const unlockAt = effectiveUnlockAt(duration || LANDING_VIDEO.unlockAtSeconds)
    barRef.current.style.width = `${displayedProgress(time, duration, unlockAt) * 100}%`
  }, [])

  const sendHeartbeat = useCallback(async (dropReason?: DropReason) => {
    const video = videoRef.current
    const visitorId = visitorIdRef.current
    if (!video || !visitorId) return

    const currentTime = Math.max(maxPlayedRef.current, video.currentTime || 0)
    const duration = durationRef.current || video.duration || 0
    const payload = {
      sessionId: sessionIdRef.current ?? undefined,
      visitorId,
      videoId: LANDING_VIDEO.id,
      currentTime,
      duration,
      unlocked: unlockedRef.current,
      completed: completedRef.current,
      dropReason,
    }

    const post = async (keepalive: boolean) => {
      const response = await fetch("/api/video/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive,
      })
      if (!response.ok) return
      const json = (await response.json().catch(() => null)) as { sessionId?: string } | null
      if (json?.sessionId) sessionIdRef.current = json.sessionId
    }

    if (dropReason === "PAGE_LEAVE") {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" })
      if (navigator.sendBeacon("/api/video/heartbeat", blob)) return
      await post(true)
      return
    }

    inflightRef.current = post(false).catch(() => undefined)
    await inflightRef.current
  }, [])

  const markUnlocked = useCallback(() => {
    if (unlockedRef.current) return
    unlockedRef.current = true
    setUnlocked(true)
    unlock()
    void sendHeartbeat()
  }, [sendHeartbeat, unlock])

  const markCompleted = useCallback(() => {
    completedRef.current = true
    unlockedRef.current = true
    setUnlocked(true)
    unlock()
    void sendHeartbeat("ENDED")
  }, [sendHeartbeat, unlock])

  const tick = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const time = video.currentTime || 0
    const duration = durationRef.current || video.duration || 0
    if (time >= maxPlayedRef.current) maxPlayedRef.current = time
    else if (time < maxPlayedRef.current - 0.35) video.currentTime = maxPlayedRef.current

    syncBar(maxPlayedRef.current, duration)

    const unlockAt = effectiveUnlockAt(duration || LANDING_VIDEO.unlockAtSeconds)
    if (!unlockedRef.current && maxPlayedRef.current >= unlockAt) markUnlocked()
    if (!completedRef.current && duration > 0 && maxPlayedRef.current >= duration * LANDING_VIDEO.completeAtRatio) {
      completedRef.current = true
    }
  }, [markUnlocked, syncBar])

  useEffect(() => {
    visitorIdRef.current = getVisitorId()
  }, [])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    const loop = () => {
      tick()
      raf = window.requestAnimationFrame(loop)
    }
    raf = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(raf)
  }, [playing, tick])

  useEffect(() => {
    if (!hasStarted) return
    const id = window.setInterval(() => {
      void sendHeartbeat()
    }, HEARTBEAT_MS)
    return () => window.clearInterval(id)
  }, [hasStarted, sendHeartbeat])

  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === "hidden") void sendHeartbeat("TAB_HIDDEN")
    }
    const onLeave = () => {
      void sendHeartbeat("PAGE_LEAVE")
    }
    document.addEventListener("visibilitychange", onHidden)
    window.addEventListener("pagehide", onLeave)
    return () => {
      document.removeEventListener("visibilitychange", onHidden)
      window.removeEventListener("pagehide", onLeave)
    }
  }, [sendHeartbeat])

  useEffect(() => {
    if (!unlocked) return
    const node = frameRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting !== false) return
        const video = videoRef.current
        if (!video || video.paused) return
        pausedByUsRef.current = true
        video.pause()
        void sendHeartbeat("SCROLL")
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [sendHeartbeat, unlocked])

  const play = async () => {
    const video = videoRef.current
    if (!video) return
    try {
      video.muted = muted
      await video.play()
      hasStartedRef.current = true
      setHasStarted(true)
      setPlaying(true)
      if (!sessionIdRef.current) void sendHeartbeat()
    } catch {
      try {
        video.muted = true
        setMuted(true)
        await video.play()
        hasStartedRef.current = true
        setHasStarted(true)
        setPlaying(true)
        if (!sessionIdRef.current) void sendHeartbeat()
      } catch {
        setPlaying(false)
        setPlaybackError(true)
      }
    }
  }
  playRef.current = play

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!hasStartedRef.current) void playRef.current()
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (playing) video.pause()
    else void play()
  }

  const toggleFullscreen = async () => {
    const node = frameRef.current
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null
    if (!node) return

    const fullscreenElement =
      document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement

    if (fullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
        return
      }
      const doc = document as Document & { webkitExitFullscreen?: () => void }
      doc.webkitExitFullscreen?.()
      return
    }

    try {
      if (node.requestFullscreen) {
        await node.requestFullscreen()
        return
      }
      const webkitNode = node as HTMLElement & { webkitRequestFullscreen?: () => void }
      if (webkitNode.webkitRequestFullscreen) {
        webkitNode.webkitRequestFullscreen()
        return
      }
      video?.webkitEnterFullscreen?.()
    } catch {
      video?.webkitEnterFullscreen?.()
    }
  }

  useEffect(() => {
    const sync = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
      setIsFullscreen(fullscreenElement === frameRef.current)
    }
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync)
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener("webkitfullscreenchange", sync)
    }
  }, [])

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative w-full overflow-hidden border-zinc-800/80 bg-black",
        isFullscreen
          ? "flex h-full flex-col border-0"
          : "border-y md:border md:rounded-none",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-black",
          isFullscreen ? "min-h-0 flex-1" : "aspect-video",
        )}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          src={LANDING_VIDEO.src}
          poster={LANDING_VIDEO.poster}
          playsInline
          preload="metadata"
          controls={false}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          onContextMenu={(event) => event.preventDefault()}
          onLoadedMetadata={(event) => {
            durationRef.current = event.currentTarget.duration || 0
            syncBar(event.currentTarget.currentTime, durationRef.current)
          }}
          onPlay={() => {
            if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
            pausedByUsRef.current = false
            hasStartedRef.current = true
            setPlaying(true)
            setHasStarted(true)
          }}
          onPause={() => {
            setPlaying(false)
            if (pausedByUsRef.current || completedRef.current) return
            if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
            pauseTimerRef.current = window.setTimeout(() => {
              void sendHeartbeat("PAUSE")
            }, PAUSE_DROP_MS)
          }}
          onEnded={() => {
            setPlaying(false)
            markCompleted()
          }}
          onSeeking={(event) => {
            if (event.currentTarget.currentTime > maxPlayedRef.current + 0.25) {
              event.currentTarget.currentTime = maxPlayedRef.current
            }
          }}
          onRateChange={(event) => {
            if (event.currentTarget.playbackRate !== 1) event.currentTarget.playbackRate = 1
          }}
          onDoubleClick={(event) => {
            event.preventDefault()
            void toggleFullscreen()
          }}
          onError={() => setPlaybackError(true)}
        >
          Tu navegador no soporta la reproducción de video.
        </video>

        <button
          type="button"
          className="absolute inset-0 z-10"
          aria-label={playing ? "Pausar video" : "Reproducir video"}
          onClick={togglePlay}
        />

        {!hasStarted ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <Image
              src={LANDING_VIDEO.poster}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur">
              <Play className="h-7 w-7 fill-white" />
            </span>
          </div>
        ) : null}

        {playbackError ? (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/70 px-6 text-center">
            <p className="max-w-sm text-sm text-zinc-300">
              Este navegador no pudo reproducir el video. Prueba en Chrome, Safari o Edge actualizado.
            </p>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-3 pb-3 pt-10">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              ref={barRef}
              className="h-full w-0 rounded-full bg-white transition-[width] duration-150 ease-linear"
            />
          </div>
        </div>

        <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
          {hasStarted ? (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pausar" : "Reproducir"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur"
            >
              {playing ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current
              const next = !muted
              setMuted(next)
              if (video) video.muted = next
            }}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
