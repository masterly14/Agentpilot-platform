"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, Reveal, SectionHeading } from "@/components/social-proof/primitives"
import { EBOOK_FINAL } from "./content"
import { DownloadCta } from "./download-cta"
import { EbookStage } from "./ebook-stage"

export function EbookFinalCta() {
  return (
    <section id="descargar" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(6,182,212,0.18),transparent_60%)]"
      />

      <DashedGrid gridId="ebook-final" maxWidth="5xl" padding="px-4 py-16 md:px-6 md:py-28">
        <div className="relative">
          <EbookStage size="section" className="relative z-10 -mb-28 md:-mb-36" />

          <Reveal className="relative z-0">
            <GlowCard className="px-6 pb-8 pt-32 md:px-10 md:pb-10 md:pt-40">
              <SectionHeading
                eyebrow={EBOOK_FINAL.badge}
                titleLead={EBOOK_FINAL.titleLead}
                titleAccent={EBOOK_FINAL.titleAccent}
                description={EBOOK_FINAL.description}
                className="mb-8"
              />

              <div className="flex justify-center">
                <DownloadCta />
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </DashedGrid>
    </section>
  )
}
