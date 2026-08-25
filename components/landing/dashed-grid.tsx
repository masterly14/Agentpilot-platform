import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type DashedGridProps = {
  children: ReactNode
  gridId?: string
  className?: string
  contentClassName?: string
  maxWidth?: "2xl" | "4xl" | "5xl" | "6xl" | "full"
  padding?: string
  fillHeight?: boolean
}

const maxWidthClass = {
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
}

export function DashedGrid({
  children,
  gridId = "grid",
  className,
  contentClassName,
  maxWidth = "2xl",
  padding = "px-4 py-8 md:px-6 md:py-12",
  fillHeight = false,
}: DashedGridProps) {
  const patternId = `dash-${gridId}`

  return (
    <div className={cn("relative w-full", fillHeight && "flex min-h-0 flex-1 flex-col", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <pattern id={`${patternId}-h`} width="20" height="2" patternUnits="userSpaceOnUse">
            <rect width="10" height="2" fill={`url(#${patternId}-g)`} />
          </pattern>
          <pattern id={`${patternId}-v`} width="2" height="20" patternUnits="userSpaceOnUse">
            <rect width="2" height="10" fill={`url(#${patternId}-g)`} />
          </pattern>
          <linearGradient id={`${patternId}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#999" />
            <stop offset="100%" stopColor="#ccc" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute left-0 top-0 h-px w-full opacity-20">
        <svg width="100%" height="2" className="block">
          <rect width="100%" height="2" fill={`url(#${patternId}-h)`} />
        </svg>
      </div>

      <div className={cn("relative mx-auto w-full", maxWidthClass[maxWidth], fillHeight && "flex min-h-0 flex-1 flex-col")}>
        <div className="absolute left-0 top-0 h-full w-0.5 opacity-20">
          <svg width="2" height="100%" className="block" preserveAspectRatio="none">
            <rect width="2" height="100%" fill={`url(#${patternId}-v)`} />
          </svg>
        </div>
        <div className="absolute right-0 top-0 h-full w-0.5 opacity-20">
          <svg width="2" height="100%" className="block" preserveAspectRatio="none">
            <rect width="2" height="100%" fill={`url(#${patternId}-v)`} />
          </svg>
        </div>

        <div className={cn("relative", padding, fillHeight && "flex min-h-0 flex-1 flex-col", contentClassName)}>{children}</div>
      </div>
    </div>
  )
}
