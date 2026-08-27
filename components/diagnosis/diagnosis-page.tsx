"use client"

import { LandingVisitTracker } from "@/components/analytics/landing-visit-tracker"
import { DiagnosisBookingSection } from "@/components/diagnosis/booking-section"
import { DiagnosisFaq } from "@/components/diagnosis/faq"
import { DiagnosisHero } from "@/components/diagnosis/hero"
import { DiagnosisMethod } from "@/components/diagnosis/method"
import { DiagnosisTestimonial } from "@/components/diagnosis/testimonial"

export function DiagnosisPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
      <LandingVisitTracker landingPath="/diagnosis" />
      <DiagnosisHero />
      <div className="ap-fade-up">
        <DiagnosisTestimonial />
        <DiagnosisMethod />
        <DiagnosisBookingSection />
        <DiagnosisFaq />
      </div>
    </div>
  )
}
