"use client"

import { motion } from "framer-motion"
import { ArrowRight, Plane } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { CTA, FINAL_CTA } from "./content"
import { CtaButton, Reveal } from "./primitives"

export function FinalCta() {
  return (
    <section id="agendar" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(6,182,212,0.18),transparent_60%)]"
      />

      <DashedGrid gridId="sp-cta" maxWidth="5xl" padding="px-4 py-20 md:px-6 md:py-28">
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 motion-reduce:animate-none"
            >
              <Plane className="h-6 w-6 text-cyan-400" />
            </motion.span>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-balance bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-3xl font-light leading-[1.15] tracking-tight text-transparent md:text-5xl">
              {FINAL_CTA.titleLead}{" "}
              <span className="font-serif italic text-white">{FINAL_CTA.titleAccent}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
              {FINAL_CTA.description}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton href={CTA.primary.href}>
                {CTA.primary.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </CtaButton>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-6 text-xs text-zinc-600">{FINAL_CTA.note}</p>
          </Reveal>
        </div>
      </DashedGrid>
    </section>
  )
}
