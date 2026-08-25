"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import { Reveal, SectionHeading } from "@/components/social-proof/primitives"
import { EBOOK_URGENCY } from "./content"
import { DownloadCta } from "./download-cta"
import { EbookStage } from "./ebook-stage"

export function EbookUrgency() {
  return (
    <section id="guia" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.08),transparent_55%)]"
      />

      <DashedGrid gridId="ebook-urgency" maxWidth="5xl" padding="px-4 py-16 md:px-6 md:py-24">
        <EbookStage size="section" className="mb-8 md:mb-10" />

        <SectionHeading
          eyebrow={EBOOK_URGENCY.badge}
          titleLead={EBOOK_URGENCY.titleLead}
          titleAccent={EBOOK_URGENCY.titleAccent}
          className="mb-8 md:mb-10"
        />

        <Reveal>
          <div className="mx-auto mb-10 max-w-2xl space-y-5 text-center">
            {EBOOK_URGENCY.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex justify-center">
            <DownloadCta />
          </div>
        </Reveal>
      </DashedGrid>
    </section>
  )
}
