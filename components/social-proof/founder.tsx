"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { CTA, FOUNDER } from "./content"
import { Reveal, SectionHeading } from "./primitives"

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function FounderSection() {
  return (
    <section id="founder" className="relative scroll-mt-8 overflow-hidden">
      <DashedGrid gridId="sp-founder" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow={FOUNDER.badge}
          titleLead={FOUNDER.titleLead}
          titleAccent={FOUNDER.titleAccent}
          className="mb-12 md:mb-16"
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="flex justify-center lg:justify-start">
            <FounderPortrait />
          </Reveal>

          <div className="space-y-8">
            <Reveal delay={0.1}>
              <div className="space-y-4">
                {FOUNDER.intro.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-pretty text-base leading-relaxed text-zinc-300 md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <Timeline />
            </Reveal>

            <Reveal delay={0.26}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-zinc-800/80 pt-7">
                <div>
                  <p className="font-serif text-2xl italic text-white">{FOUNDER.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {FOUNDER.role} · {FOUNDER.company}
                  </p>
                </div>
                <a
                  href={CTA.primary.href}
                  className="group inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
                >
                  {FOUNDER.closing}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </DashedGrid>
    </section>
  )
}

const CHIP_POSITIONS = ["left-0 top-[36%]", "bottom-[12%] left-[6%]"]

// El recorte de la foto llega hasta los bordes del encuadre, así que la máscara
// disuelve el asiento por abajo y suaviza los laterales para que no se vea el corte.
const BOTTOM_FADE =
  "linear-gradient(to bottom, black 85%, rgba(0,0,0,0.35) 91%, transparent 96%)"
const SIDE_FADE =
  "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)"

function FounderPortrait() {
  return (
    <div className="relative w-full max-w-[400px]">
      <span
        aria-hidden
        className="pointer-events-none absolute left-[62%] top-[6%] h-[62%] w-[80%] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[90px]"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-[68%] top-[27%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-zinc-700/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-[68%] top-[27%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-800/70"
      />

      {/* La foto ya viene recortada con canal alfa, pero el recorte incluye el asiento.
          El encuadre deja la mano completa y la máscara disuelve todo lo que hay debajo. */}
      <div
        className="relative aspect-[5/7] w-full"
        style={{
          maskImage: `${BOTTOM_FADE}, ${SIDE_FADE}`,
          WebkitMaskImage: `${BOTTOM_FADE}, ${SIDE_FADE}`,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <Image
          src={FOUNDER.photo}
          alt={`${FOUNDER.name}, ${FOUNDER.role} de ${FOUNDER.company}`}
          fill
          sizes="(max-width: 1024px) 80vw, 400px"
          className="object-cover"
          style={{ objectPosition: "50% 76%" }}
        />
      </div>

      {FOUNDER.highlights.map((item, index) => (
        <motion.span
          key={item.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.35 + index * 0.12, ease: EASE_OUT }}
          className={`pointer-events-none absolute inline-flex items-baseline gap-1.5 rounded-full border border-zinc-800 bg-black/70 px-3.5 py-1.5 backdrop-blur ${CHIP_POSITIONS[index]}`}
        >
          <span className="text-sm font-medium text-white">{item.value}</span>
          <span className="text-xs text-zinc-500">{item.label}</span>
        </motion.span>
      ))}
    </div>
  )
}

function Timeline() {
  return (
    <ol className="relative space-y-6 border-l border-zinc-800/80 pl-7">
      {FOUNDER.timeline.map((item, index) => (
        <motion.li
          key={item.title}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: index * 0.09, ease: EASE_OUT }}
          className="relative"
        >
          <span className="absolute -left-[34px] top-1.5 flex h-3.5 w-3.5 items-center justify-center">
            <span className="h-3.5 w-3.5 rounded-full border border-zinc-700 bg-black" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>

          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">{item.period}</p>
          <p className="mt-1 text-base font-medium text-zinc-100">{item.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{item.description}</p>
        </motion.li>
      ))}
    </ol>
  )
}
