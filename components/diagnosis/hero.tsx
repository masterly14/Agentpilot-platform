"use client"

import { ArrowRight, ChevronDown, Stethoscope } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { scrollToSection } from "@/lib/smooth-scroll"
import { CtaButton } from "@/components/social-proof/primitives"
import { DIAGNOSIS_CTA, DIAGNOSIS_HERO } from "./content"

type DiagnosisHeroCopy = {
  badge: string
  titleLead: string
  titleAccent: string
  description: string
}

export function DiagnosisHero({
  copy = DIAGNOSIS_HERO,
  ctaLabel = DIAGNOSIS_CTA.label,
}: {
  copy?: DiagnosisHeroCopy
  ctaLabel?: string
} = {}) {
  return (
    <section className="relative overflow-x-hidden">
      <AuroraBackdrop />

      <DashedGrid gridId="diag-hero" maxWidth="full" padding="p-0" contentClassName="flex flex-col">
        <div className="relative flex flex-col items-center px-4 pb-8 pt-16 text-center md:px-6 md:pb-16 md:pt-24">
          <div
            className="ap-fade-up mb-5 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2 md:mb-8"
            style={{ animationDelay: "0s" }}
          >
            <Stethoscope className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-sm text-zinc-400">{copy.badge}</span>
          </div>

          <h1
            className="ap-fade-up mb-4 max-w-4xl text-balance bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-3xl font-light leading-[1.1] tracking-tight text-zinc-100 [-webkit-background-clip:text] sm:text-4xl md:mb-6 md:text-6xl md:text-transparent lg:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            {copy.titleLead}
            <br />
            <span className="font-serif italic font-normal text-white">
              {copy.titleAccent}
            </span>
          </h1>

          <p
            className="ap-fade-up mb-8 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 md:mb-10 md:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            {copy.description}
          </p>

          <div className="ap-fade-up mb-8 md:mb-10" style={{ animationDelay: "0.28s" }}>
            <CtaButton href={DIAGNOSIS_CTA.href}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </CtaButton>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("prueba-real")}
            aria-label="Ver la prueba real"
            className="ap-fade-up group inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/40 text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800/70 hover:text-white animate-scroll-button-pulse motion-reduce:animate-none"
            style={{ animationDelay: "0.4s" }}
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
        </div>
      </DashedGrid>
    </section>
  )
}

function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(6,182,212,0.16),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 72%)",
        }}
      />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]" />
    </div>
  )
}
