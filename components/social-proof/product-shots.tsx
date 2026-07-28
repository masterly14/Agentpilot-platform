"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { cn } from "@/lib/utils"
import { PRODUCT_SHOTS } from "./content"
import { MediaSlot, Reveal, SectionHeading } from "./primitives"

export function ProductShots() {
  const [activeId, setActiveId] = useState(PRODUCT_SHOTS[0].id)
  const active = PRODUCT_SHOTS.find((shot) => shot.id === activeId) ?? PRODUCT_SHOTS[0]

  return (
    <section id="producto" className="scroll-mt-8">
      <DashedGrid gridId="sp-product" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="El sistema"
          titleLead="Una sola pantalla para"
          titleAccent="toda la operación"
          description="Así se ve por dentro lo que reemplaza hojas de cálculo, grupos de WhatsApp y calendarios sueltos."
          className="mb-10 md:mb-14"
        />

        <Reveal>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {PRODUCT_SHOTS.map((shot) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => setActiveId(shot.id)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors duration-200",
                  activeId === shot.id ? "text-black" : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {activeId === shot.id ? (
                  <motion.span
                    layoutId="product-tab"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{shot.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0D0D0F] to-[#141417] p-3 md:p-4">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[80px]"
            />

            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-black">
              <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-950 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 truncate rounded-md border border-zinc-800 bg-black px-3 py-1 text-[11px] text-zinc-500">
                  app.tuoperacion.com/{active.id}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MediaSlot
                    src={active.src || undefined}
                    alt={`Captura de ${active.label}`}
                    label={`Espacio para la captura de ${active.label}`}
                    rounded="rounded-none"
                    className="border-0"
                    imageClassName="object-contain object-top bg-zinc-950"
                    sizes="(max-width: 1024px) 100vw, 1100px"
                    priority={active.id === PRODUCT_SHOTS[0].id}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="px-2 py-4 text-center text-sm text-zinc-500">{active.caption}</p>
          </div>
        </Reveal>
      </DashedGrid>
    </section>
  )
}
