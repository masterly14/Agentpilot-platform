"use client"

import { LandingVisitTracker } from "@/components/analytics/landing-visit-tracker"
import { DiagnosisBookingSection } from "@/components/diagnosis/booking-section"
import { DiagnosisFaq } from "@/components/diagnosis/faq"
import { DiagnosisHero } from "@/components/diagnosis/hero"
import { DiagnosisMethod } from "@/components/diagnosis/method"
import { DiagnosisTestimonial } from "@/components/diagnosis/testimonial"
import { ScrollLockProvider, useScrollLock } from "@/components/landing/scroll-lock-provider"

export function DiagnosisPage() {
  return (
    <ScrollLockProvider lockScroll={false}>
      <DiagnosisBody />
    </ScrollLockProvider>
  )
}

function DiagnosisBody() {
  const { isLocked } = useScrollLock()

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
      <LandingVisitTracker landingPath="/diagnosis" />
      <DiagnosisHero />
      {isLocked ? null : (
        <div className="ap-fade-up">
          <DiagnosisTestimonial />
          <DiagnosisMethod />
          <DiagnosisBookingSection />
          <DiagnosisFaq />
        </div>
      )}
    </div>
  )
}
