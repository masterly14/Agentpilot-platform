import { DesignMarquee } from "./design-marquee"
import { DesignsFlowSection, TestimonialSection } from "./designs-testimonial-section"
import { HeroSection } from "./hero-section"
import { LandingFooter } from "./landing-footer"
import { ScopeSection } from "./scope-section"
import { ProcessSection } from "./process-section"

export function DesignServicesPage() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-black text-foreground">
      <HeroSection />
      <DesignMarquee />
      <ProcessSection />
      <DesignsFlowSection />
      <TestimonialSection />
      <ScopeSection />
      <LandingFooter />
    </div>
  )
}
