"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import { METRICS } from "./content"
import { AnimatedNumber, GlowCard, Reveal, SectionHeading } from "./primitives"

export function MetricsBand() {
  return (
    <section id="resultados" className="scroll-mt-8">
      <DashedGrid gridId="sp-metrics" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="Números"
          titleLead="Lo que cambia cuando la operación"
          titleAccent="se automatiza"
          description="Promedios de las empresas de renta corta con las que trabajamos durante el primer año."
          className="mb-12 md:mb-16"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.08}>
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
            </Reveal>
          ))}
        </div>
      </DashedGrid>
    </section>
  )
}
