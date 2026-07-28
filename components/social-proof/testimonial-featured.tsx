"use client"

import { motion } from "framer-motion"
import { Play, Star } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { FEATURED_TESTIMONIAL } from "./content"
import { AvatarSlot, MediaSlot, Reveal } from "./primitives"

export function FeaturedTestimonial() {
  const testimonial = FEATURED_TESTIMONIAL

  return (
    <section id="testimonio" className="scroll-mt-8">
      <DashedGrid gridId="sp-featured" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0D0D0F] to-[#141417] p-5 md:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-6 top-2 font-serif text-7xl leading-none text-zinc-700/40 md:text-9xl"
            >
              &ldquo;
            </span>

            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              <VideoSlot src={testimonial.videoSrc} company={testimonial.company} />

              <div className="space-y-7">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-3.5 py-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
                  {testimonial.badge}
                </span>

                <div className="flex gap-1" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </motion.span>
                  ))}
                </div>

                <p className="text-pretty text-xl font-light leading-relaxed text-zinc-100 md:text-2xl lg:text-[1.7rem]">
                  {testimonial.quote}
                </p>

                <div className="flex flex-wrap gap-3">
                  {testimonial.stats.map((stat) => (
                    <span
                      key={stat.label}
                      className="inline-flex items-baseline gap-1.5 rounded-full border border-zinc-800 bg-black/50 px-3.5 py-1.5"
                    >
                      <span className="text-sm font-medium text-white">{stat.value}</span>
                      <span className="text-xs text-zinc-500">{stat.label}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 border-t border-zinc-800/80 pt-6">
                  <AvatarSlot src={testimonial.avatar} name={testimonial.author} size={56} />
                  <div>
                    <p className="text-base font-medium text-white">{testimonial.author}</p>
                    <p className="text-sm text-zinc-500">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </DashedGrid>
    </section>
  )
}

type VideoSlotProps = {
  src?: string
  company: string
}

function VideoSlot({ src, company }: VideoSlotProps) {
  if (src) {
    return (
      <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-zinc-800/80 bg-black lg:mx-0 xl:max-w-[320px]">
        <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            controls
            playsInline
            preload="metadata"
            title={`Testimonio de ${company}`}
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      </div>
    )
  }

  return (
    <MediaSlot
      alt={`Video testimonio de ${company}`}
      aspect="aspect-[9/16]"
      className="group mx-auto max-w-[280px] lg:mx-0 xl:max-w-[320px]"
      sizes="320px"
      hidePlaceholderContent
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <motion.span
          className="relative flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-black/70 backdrop-blur transition-colors duration-300 group-hover:border-cyan-400/60"
          whileHover={{ scale: 1.06 }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-cyan-400/40"
            animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <Play className="h-5 w-5 translate-x-0.5 fill-white text-white" />
        </motion.span>
        <span className="text-xs text-zinc-600">Espacio para el video del testimonio</span>
      </div>
    </MediaSlot>
  )
}
