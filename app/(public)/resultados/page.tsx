import type { Metadata } from "next"
import { AirplaneModeSection } from "@/components/social-proof/airplane-mode"
import { CaseStudy } from "@/components/social-proof/case-study"
import { FinalCta } from "@/components/social-proof/final-cta"
import { FounderSection } from "@/components/social-proof/founder"
import { SocialProofHero } from "@/components/social-proof/hero"
import { LeanTeam } from "@/components/social-proof/lean-team"
import { LogoCloud } from "@/components/social-proof/logo-cloud"
import { MetricsBand } from "@/components/social-proof/metrics"
import { ProductShots } from "@/components/social-proof/product-shots"
import { FeaturedTestimonial } from "@/components/social-proof/testimonial-featured"
import { TestimonialsMarquee } from "@/components/social-proof/testimonials-marquee"

export const metadata: Metadata = {
  title: "Resultados",
  description:
    "Casos, testimonios y métricas de property managers que automatizaron su operación con infraestructura de IA.",
}

export default function ResultadosPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
      <SocialProofHero />
      <LogoCloud />
      <MetricsBand />
      <LeanTeam />
      <AirplaneModeSection />
      <FeaturedTestimonial />
      <TestimonialsMarquee />
      <CaseStudy />
      <ProductShots />
      <FounderSection />
      <FinalCta />
    </div>
  )
}
