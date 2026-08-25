"use client"

import { Check, ChevronDown } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, Reveal } from "@/components/social-proof/primitives"
import { scrollToSection } from "@/lib/smooth-scroll"
import { EBOOK_BANNER, EBOOK_HERO } from "./content"
import { DownloadCta } from "./download-cta"
import { EbookStage } from "./ebook-stage"

export function EbookHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 w-full border-b border-zinc-800 bg-zinc-900 px-4 py-3 text-center md:px-8 md:py-3.5">
        <p className="mx-auto max-w-4xl text-pretty text-sm leading-relaxed text-zinc-300 md:text-base">
          <strong className="font-semibold text-white">Descarga Gratis:</strong>{" "}
          {EBOOK_BANNER.replace("Descarga Gratis: ", "")}
        </p>
      </div>

      <AuroraBackdrop />

      <DashedGrid gridId="ebook-hero" maxWidth="5xl" padding="p-0" contentClassName="flex flex-col">
        <div className="relative flex flex-col items-center px-4 pb-16 pt-6 text-center md:px-6 md:pb-24 md:pt-8">
          <div className="mb-2 w-full">
            <EbookStage size="hero" intro />
          </div>

          <span
            className="ap-fade-up mb-4 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500"
            style={{ animationDelay: "0.16s" }}
          >
            {EBOOK_HERO.badge}
          </span>

          <h1
            className="ap-fade-up mb-4 max-w-4xl text-balance bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-4xl font-light leading-[1.1] tracking-tight text-zinc-100 [-webkit-background-clip:text] sm:text-5xl md:text-6xl md:text-transparent"
            style={{ animationDelay: "0.2s" }}
          >
            {EBOOK_HERO.titleLead}{" "}
            <span className="font-serif italic font-normal text-white">{EBOOK_HERO.titleAccent}</span>
          </h1>

          <p
            className="ap-fade-up mb-6 text-sm text-zinc-500 md:text-base"
            style={{ animationDelay: "0.26s" }}
          >
            ({EBOOK_HERO.audience})
          </p>

          <p
            className="ap-fade-up mb-10 max-w-2xl text-pretty text-base text-zinc-400 md:text-xl"
            style={{ animationDelay: "0.3s" }}
          >
            {EBOOK_HERO.description}{" "}
            <span className="font-serif italic text-white">{EBOOK_HERO.accentWord}</span>
          </p>

          <Reveal delay={0.12} className="mb-10 w-full max-w-3xl">
            <div className="relative z-0">
              <GlowCard className="p-5 text-left md:p-7">
                <p className="mb-4 text-sm font-medium text-white md:text-base">
                  {EBOOK_HERO.painsHeading}
                </p>
                <ul className="space-y-3.5">
                  {EBOOK_HERO.pains.map((pain) => (
                    <li key={pain} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" strokeWidth={2.5} />
                      <span className="text-sm leading-relaxed text-zinc-300 md:text-base">{pain}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </div>
          </Reveal>

          <div className="ap-fade-up mb-16" style={{ animationDelay: "0.4s" }}>
            <DownloadCta />
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("prueba-real")}
            aria-label="Ver la prueba real"
            className="ap-fade-up group inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/40 text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800/70 hover:text-white animate-scroll-button-pulse motion-reduce:animate-none"
            style={{ animationDelay: "0.48s" }}
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
      <div
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"
      />
      <div
        className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]"
      />
    </div>
  )
}
