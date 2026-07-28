"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, TriangleAlert } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { CASE_STUDY } from "./content"
import { GlowCard, Reveal, SectionHeading } from "./primitives"

export function CaseStudy() {
  return (
    <section id="caso" className="scroll-mt-8">
      <DashedGrid gridId="sp-case" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow={CASE_STUDY.badge}
          titleLead={CASE_STUDY.headline}
          description={CASE_STUDY.summary}
          className="mb-12 md:mb-16"
        />

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Reveal>
            <GlowCard className="h-full p-6 md:p-8" glowColor="rgba(244, 63, 94, 0.10)">
              <ListBlock
                icon={<TriangleAlert className="h-4 w-4 text-rose-400" />}
                title="Antes"
                subtitle="Operación manual"
                items={CASE_STUDY.challenge}
                tone="rose"
              />
            </GlowCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlowCard className="h-full p-6 md:p-8">
              <ListBlock
                icon={<Check className="h-4 w-4 text-cyan-400" />}
                title="Después"
                subtitle="Infraestructura de IA"
                items={CASE_STUDY.solution}
                tone="cyan"
              />
            </GlowCard>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0D0D0F] to-[#141417] p-6 md:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-200">Impacto medido</p>
              <span className="rounded-full border border-zinc-800 bg-black/50 px-3 py-1 text-xs text-zinc-400">
                {CASE_STUDY.company}
              </span>
            </div>

            <div className="space-y-8">
              {CASE_STUDY.comparison.map((row, index) => (
                <ComparisonRow key={row.label} row={row} delay={index * 0.12} />
              ))}
            </div>
          </div>
        </Reveal>
      </DashedGrid>
    </section>
  )
}

type ListBlockProps = {
  icon: ReactNode
  title: string
  subtitle: string
  items: readonly string[]
  tone: "rose" | "cyan"
}

function ListBlock({ icon, title, subtitle, items, tone }: ListBlockProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-black/60">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-zinc-100">{title}</p>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
      </div>

      <ul className="space-y-3.5">
        {items.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3"
          >
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                tone === "rose" ? "bg-rose-500/70" : "bg-cyan-400"
              }`}
            />
            <span
              className={`text-sm leading-relaxed ${
                tone === "rose" ? "text-zinc-500" : "text-zinc-300"
              }`}
            >
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

type ComparisonRowProps = {
  row: { label: string; before: number; after: number; unit: string }
  delay: number
}

function ComparisonRow({ row, delay }: ComparisonRowProps) {
  const max = Math.max(row.before, row.after)
  const beforeWidth = `${Math.max((row.before / max) * 100, 4)}%`
  const afterWidth = `${Math.max((row.after / max) * 100, 4)}%`

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-zinc-400">{row.label}</p>
        <p className="flex items-center gap-2 text-sm">
          <span className="text-zinc-600 line-through">
            {row.before}
            {row.unit}
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
          <span className="font-medium text-white">
            {row.after}
            {row.unit}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <Bar width={beforeWidth} delay={delay} className="bg-zinc-700/60" />
        <Bar
          width={afterWidth}
          delay={delay + 0.15}
          className="bg-gradient-to-r from-cyan-500 to-cyan-300"
        />
      </div>
    </div>
  )
}

function Bar({ width, delay, className }: { width: string; delay: number; className: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full rounded-full ${className}`}
      />
    </div>
  )
}
