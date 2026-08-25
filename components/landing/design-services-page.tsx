import { BookingSection } from "./booking-section"
import { HeroSection } from "./hero-section"
import { ScrollLockProvider } from "./scroll-lock-provider"

export function DesignServicesPage() {
  return (
    <ScrollLockProvider>
      <div className="min-h-svh overflow-x-hidden bg-black text-foreground">
        <HeroSection />
        <BookingSection />
      </div>
    </ScrollLockProvider>
  )
}
