"use client"

import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, Reveal, SectionHeading } from "@/components/social-proof/primitives"
import { BookingWidgetLight } from "./booking-widget-light"
import { DIAGNOSIS_BOOKING } from "./content"

export function DiagnosisBookingSection({
  leadToken,
  leadName,
  leadEmail,
}: {
  leadToken?: string
  leadName?: string
  leadEmail?: string
} = {}) {
  return (
    <section id="booking" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(6,182,212,0.18),transparent_60%)]"
      />

      <DashedGrid gridId="diag-booking" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow={DIAGNOSIS_BOOKING.badge}
          titleLead={DIAGNOSIS_BOOKING.titleLead}
          titleAccent={DIAGNOSIS_BOOKING.titleAccent}
          description={DIAGNOSIS_BOOKING.description}
          className="mb-10 md:mb-14"
        />

        <Reveal>
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_50%_50%,rgba(6,182,212,0.16),transparent_70%)] blur-2xl"
            />
            <div className="relative">
              <BookingWidgetLight
                leadToken={leadToken}
                leadName={leadName}
                leadEmail={leadEmail}
              />
            </div>
          </div>
        </Reveal>
      </DashedGrid>
    </section>
  )
}
