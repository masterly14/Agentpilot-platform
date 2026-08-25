"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import { METRICS } from "@/components/social-proof/content"
import { AnimatedNumber, GlowCard, Reveal, SectionHeading } from "@/components/social-proof/primitives"
import { EBOOK_METRICS_HEADING } from "./content"
import { DownloadCta } from "./download-cta"

export function EbookMetrics() {
  return (
    <section id="numeros" className="relative scroll-mt-8 overflow-hidden">
      <DashedGrid gridId="ebook-metrics" maxWidth="6xl" padding="px-4 pb-16 pt-4 md:px-6 md:pb-24 md:pt-6">
        <SectionHeading
          eyebrow={EBOOK_METRICS_HEADING.badge}
          titleLead={EBOOK_METRICS_HEADING.titleLead}
          titleAccent={EBOOK_METRICS_HEADING.titleAccent}
          className="mb-12 md:mb-16"
        />

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.08}>
              <MetricCard metric={metric} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center md:mt-12">
            <DownloadCta />
          </div>
        </Reveal>
      </DashedGrid>
    </section>
  )
}

function MetricCard({
  metric,
}: {
  metric: (typeof METRICS)[number]
}) {
  return (
    <GlowCard className="h-full p-6 md:p-7">
      <AnimatedNumber
        value={metric.value}
        prefix={metric.prefix}
        suffix={metric.suffix}
        className="block bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-4xl font-light text-transparent md:text-5xl"
      />
      <p className="mt-4 text-sm font-medium text-zinc-200">{metric.label}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{metric.description}</p>
      <span
        aria-hidden
        className="mt-6 block h-px w-full bg-gradient-to-r from-cyan-500/40 via-zinc-800 to-transparent"
      />
    </GlowCard>
  )
}
