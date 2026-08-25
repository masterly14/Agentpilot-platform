"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { EBOOK_CTA } from "./content"
import { useEbookLeadModal } from "./lead-modal"

type DownloadCtaProps = {
  className?: string
  compact?: boolean
}

export function DownloadCta({ className, compact = false }: DownloadCtaProps) {
  const { setOpen } = useEbookLeadModal()

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "group relative inline-flex flex-col items-center justify-center overflow-hidden rounded-full bg-white px-8 text-black transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]",
        compact ? "min-h-12 py-2.5" : "min-h-14 py-3",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative text-sm font-medium tracking-wide">{EBOOK_CTA.label}</span>
      <span className="relative mt-0.5 text-[11px] font-normal text-zinc-600">
        ({EBOOK_CTA.note})
      </span>
    </button>
  )
}

export function DownloadCtaRow({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {children ?? <DownloadCta />}
    </div>
  )
}
