import { BookingWidget } from "./booking-widget"
import { DashedGrid } from "./dashed-grid"

export function BookingSection() {
  return (
    <section id="booking">
      <DashedGrid maxWidth="6xl" padding="px-4 py-6 md:px-6 md:py-14">
        <BookingWidget />
      </DashedGrid>
    </section>
  )
}
