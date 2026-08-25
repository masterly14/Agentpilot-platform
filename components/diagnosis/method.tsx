"use client"

import { Cpu, RefreshCw, Rocket, Search } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, Reveal, SectionHeading } from "@/components/social-proof/primitives"
import { DIAGNOSIS_METHOD } from "./content"

const STEP_ICONS = [Search, Cpu, RefreshCw, Rocket] as const

export function DiagnosisMethod() {
  return (
    <section id="metodo" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.08),transparent_55%)]"
      />

      <DashedGrid gridId="diag-method" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow={DIAGNOSIS_METHOD.badge}
          titleLead={DIAGNOSIS_METHOD.titleLead}
          titleAccent={DIAGNOSIS_METHOD.titleAccent}
          description={DIAGNOSIS_METHOD.description}
          className="mb-12 md:mb-16"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DIAGNOSIS_METHOD.steps.map((step, index) => {
            const Icon = STEP_ICONS[index]
            return (
              <Reveal key={step.number} delay={index * 0.08}>
                <GlowCard className="h-full p-6 md:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-black/60">
                      <Icon className="h-4 w-4 text-cyan-400" />
                    </span>
                    <span className="font-serif text-3xl italic text-zinc-700/80">{step.number}</span>
                  </div>
                  <p className="text-lg font-medium text-zinc-100 md:text-xl">{step.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500 md:text-base">
                    {step.description}
                  </p>
                  <span
                    aria-hidden
                    className="mt-6 block h-px w-full bg-gradient-to-r from-cyan-500/40 via-zinc-800 to-transparent"
                  />
                </GlowCard>
              </Reveal>
            )
          })}
        </div>
      </DashedGrid>
    </section>
  )
}
