"use client"

import { ChevronDown } from "lucide-react"
import { scrollToSection } from "@/lib/smooth-scroll"
import { useScrollLock } from "./scroll-lock-provider"
type ScrollDownButtonProps = {
  targetId: string
}

export function ScrollDownButton({ targetId }: ScrollDownButtonProps) {
  const { unlock } = useScrollLock()

  const handleClick = () => {
    unlock()
    requestAnimationFrame(() => scrollToSection(targetId))
  }

  return (
    <button
      type="button"
      onClick={handleClick}      aria-label="Desplazarse hacia abajo"
      className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/40 text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800/70 hover:text-white animate-scroll-button-pulse motion-reduce:animate-none"
    >
      <span className="relative flex h-7 w-7 flex-col items-center justify-center">
        <ChevronDown
          className="absolute h-5 w-5 animate-scroll-arrow motion-reduce:animate-none"
          style={{ animationDelay: "0ms" }}
        />
        <ChevronDown
          className="absolute h-5 w-5 animate-scroll-arrow motion-reduce:animate-none"
          style={{ animationDelay: "350ms" }}
        />
      </span>
    </button>
  )
}
