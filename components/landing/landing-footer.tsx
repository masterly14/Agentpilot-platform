import { DashedGrid } from "./dashed-grid"

export function LandingFooter() {
  return (
    <DashedGrid maxWidth="5xl" padding="px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
        <span className="text-lg font-semibold text-foreground md:text-xl">Santiago Cano Varón</span>
      </div>
    </DashedGrid>
  )
}
