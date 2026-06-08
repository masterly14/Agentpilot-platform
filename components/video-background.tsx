"use client"

import { useEffect, useRef } from "react"

const VIDEOS = {
  pink: "https://video.wixstatic.com/video/c837a6_2d33fb2501c84d4ea2c69248b1a24b79/1080p/mp4/file.mp4",
  green: "https://video.wixstatic.com/video/c837a6_44d0324e1b43487fa9ec09991f13881d/1080p/mp4/file.mp4",
  white: "https://video.wixstatic.com/video/c837a6_b2e887dc2d3b45eaa02092ebbde117d8/1080p/mp4/file.mp4",
}

type VideoTheme = keyof typeof VIDEOS

interface VideoBackgroundProps {
  theme?: VideoTheme
  opacity?: number
}

export function VideoBackground({ theme = "white", opacity = 0.35 }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
    video.play().catch(() => {
      // Autoplay blocked — silent fail, video stays paused
    })
  }, [theme])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        key={theme}
        src={VIDEOS[theme]}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        style={{ opacity }}
      />
    </div>
  )
}
