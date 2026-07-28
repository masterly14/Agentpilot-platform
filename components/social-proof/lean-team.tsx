"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import { LEAN_TEAM } from "./content"
import { Reveal, SectionHeading } from "./primitives"

export function LeanTeam() {
  return (
    <section id="equipo-liviano" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.08),transparent_55%)]"
      />

      <DashedGrid gridId="sp-lean" maxWidth="5xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow={LEAN_TEAM.badge}
          titleLead={LEAN_TEAM.titleLead}
          titleAccent={LEAN_TEAM.titleAccent}
          description={LEAN_TEAM.description}
          className="mb-12 md:mb-16"
        />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-800/50 md:grid-cols-2">
          {LEAN_TEAM.contrast.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.1}>
              <div className="relative h-full bg-black px-6 py-8 md:px-8 md:py-10">
                {index === 1 ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.12),transparent_55%)]"
                  />
                ) : null}

                <div className="relative space-y-4">
                  <p
                    className={
                      index === 1
                        ? "text-xs uppercase tracking-[0.22em] text-cyan-400/80"
                        : "text-xs uppercase tracking-[0.22em] text-zinc-500"
                    }
                  >
                    {item.label}
                  </p>
                  <p
                    className={
                      index === 1
                        ? "text-xl font-light text-white md:text-2xl"
                        : "text-xl font-light text-zinc-400 md:text-2xl"
                    }
                  >
                    {item.value}
                  </p>
                  <p className="max-w-sm text-sm leading-relaxed text-zinc-500">{item.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </DashedGrid>
    </section>
  )
}
