"use client"

import { EbookCover3D } from "@/components/three/ebook-cover-3d"
import { cn } from "@/lib/utils"
import { EBOOK_COVER, EBOOK_COVER_TEXTURE } from "./content"

type EbookStageProps = {
  size?: "hero" | "section"
  intro?: boolean
  className?: string
}

const SIZE_CLASS = {
  hero: "h-[620px] max-w-[560px] md:h-[780px] md:max-w-[680px] lg:h-[860px] lg:max-w-[740px]",
  section: "h-[520px] max-w-[460px] md:h-[640px] md:max-w-[560px]",
}

export function EbookStage({ size = "section", intro = false, className }: EbookStageProps) {
  return (
    <div className={cn("relative mx-auto w-full", SIZE_CLASS[size], className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] bottom-[2%] h-[32%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.28)_0%,rgba(0,0,0,0.55)_38%,transparent_72%)] blur-xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[18%] bottom-[6%] h-[18%] rounded-[100%] bg-black/70 blur-md"
      />
      <EbookCover3D
        cover={EBOOK_COVER_TEXTURE}
        poster={EBOOK_COVER}
        intro={intro}
        className="relative h-full w-full"
      />
    </div>
  )
}
