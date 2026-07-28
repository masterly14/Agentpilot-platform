"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronDown, Plane } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { scrollToSection } from "@/lib/smooth-scroll"
import { CTA, HERO } from "./content"
import { CtaButton } from "./primitives"

const EASE_OUT = [0.22, 1, 0.36, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT },
  }
}

export function SocialProofHero() {
  return (
    <section className="relative overflow-hidden">
      <AuroraBackdrop />

      <DashedGrid gridId="sp-hero" maxWidth="5xl" padding="p-0" contentClassName="flex flex-col">
        <div className="relative flex flex-col items-center px-4 pb-16 pt-24 text-center md:px-6 md:pb-24 md:pt-32">
          <motion.div
            {...fadeUp(0)}
            className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2"
          >
            <Plane className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-sm text-muted-foreground">{HERO.badge}</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mb-6 max-w-4xl text-balance bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-4xl font-light leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {HERO.titleLead}
            <br />
            <span className="font-serif italic font-normal text-white">{HERO.titleAccent}</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mb-10 max-w-2xl text-pretty text-base text-muted-foreground md:text-xl"
          >
            {HERO.description}
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="mb-16 flex flex-col items-center gap-3 sm:flex-row"
          >
            <CtaButton href={CTA.primary.href}>
              {CTA.primary.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </CtaButton>
          </motion.div>

          <motion.button
            {...fadeUp(0.45)}
            type="button"
            onClick={() => scrollToSection("clientes")}
            aria-label="Ver resultados"
            className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/40 text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800/70 hover:text-white animate-scroll-button-pulse motion-reduce:animate-none"
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
          </motion.button>
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
      <motion.div
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]"
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <FlightPath />
    </div>
  )
}

function FlightPath() {
  return (
    <svg
      className="absolute inset-x-0 top-24 mx-auto hidden h-64 w-full max-w-5xl opacity-40 md:block"
      viewBox="0 0 1000 260"
      fill="none"
    >
      <motion.path
        d="M -20 220 C 220 220, 320 40, 560 60 C 760 78, 880 30, 1020 20"
        stroke="url(#sp-flight-gradient)"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: EASE_OUT, delay: 0.4 }}
      />
      <defs>
        <linearGradient id="sp-flight-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(6,182,212,0)" />
          <stop offset="45%" stopColor="rgba(6,182,212,0.75)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
