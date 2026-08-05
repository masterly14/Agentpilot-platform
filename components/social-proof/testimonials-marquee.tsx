"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import { cn } from "@/lib/utils"
import { TESTIMONIALS } from "./content"
import { AvatarSlot, SectionHeading } from "./primitives"

type Testimonial = (typeof TESTIMONIALS)[number]

const ROW_ONE = TESTIMONIALS.slice(0, 4)
const ROW_TWO = TESTIMONIALS.slice(4)

export function TestimonialsMarquee() {
  return (
    <section id="testimonios" className="scroll-mt-8">
      <DashedGrid gridId="sp-testimonials" maxWidth="full" padding="px-0 py-16 md:py-24">
        <SectionHeading
          eyebrow="Testimonios"
          titleLead="Lo que dicen quienes ya"
          titleAccent="lo viven"
          description="Founders y equipos de operación que recuperaron el control de su tiempo."
          className="mb-12 px-4 md:mb-16"
        />

        <div className="relative space-y-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <MarqueeRow items={ROW_ONE} duration="52s" />
          <MarqueeRow items={ROW_TWO} duration="64s" reverse />
        </div>
      </DashedGrid>
    </section>
  )
}

type MarqueeRowProps = {
  items: Testimonial[]
  duration: string
  reverse?: boolean
}

function MarqueeRow({ items, duration, reverse = false }: MarqueeRowProps) {
  const loop = [...items, ...items, ...items, ...items]

  return (
    <div className="group flex w-max">
      <div
        className={cn(
          "flex w-max shrink-0 gap-5 pr-5 animate-marquee-x group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        )}
        style={{
          animationDuration: duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {loop.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.company}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative w-[300px] shrink-0 overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0D0D0F] to-[#141417] p-6 transition-colors duration-300 hover:border-zinc-700 sm:w-[380px]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/60 to-transparent"
      />
      <span className="font-serif text-4xl leading-none text-zinc-700">&ldquo;</span>
      <blockquote className="mt-2 text-pretty text-sm leading-relaxed text-zinc-300 md:text-base">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-800/80 pt-5">
        <AvatarSlot src={testimonial.avatar} name={testimonial.author} size={40} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">{testimonial.author}</p>
          <p className="truncate text-xs text-zinc-500">
            {testimonial.company
              ? `${testimonial.role} · ${testimonial.company}`
              : testimonial.role}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
