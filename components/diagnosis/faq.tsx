"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { GlowCard, Reveal, SectionHeading } from "@/components/social-proof/primitives"
import { DIAGNOSIS_FAQ } from "./content"

export function DiagnosisFaq() {
  return (
    <section id="faq" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.08),transparent_55%)]"
      />

      <DashedGrid gridId="diag-faq" maxWidth="4xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow={DIAGNOSIS_FAQ.badge}
          titleLead={DIAGNOSIS_FAQ.titleLead}
          titleAccent={DIAGNOSIS_FAQ.titleAccent}
          className="mb-12 md:mb-16"
        />

        <Reveal>
          <GlowCard className="p-2 md:p-3">
            <Accordion type="single" collapsible className="w-full">
              {DIAGNOSIS_FAQ.items.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="border-zinc-800/80 px-4 last:border-b-0 md:px-5"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-medium text-zinc-100 hover:text-white hover:no-underline md:text-lg">
                    <span className="flex items-start gap-3 pr-2">
                      <span className="mt-0.5 font-serif text-sm italic text-cyan-400/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-9 text-sm leading-relaxed text-zinc-400 md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlowCard>
        </Reveal>
      </DashedGrid>
    </section>
  )
}
