import type { Metadata } from "next"
import { EbookFinalCta } from "@/components/ebook-landing/final-cta"
import { EbookHero } from "@/components/ebook-landing/hero"
import { EbookLeadProvider } from "@/components/ebook-landing/lead-modal"
import { EbookMetrics } from "@/components/ebook-landing/metrics"
import { EbookProof } from "@/components/ebook-landing/proof"
import { EbookUrgency } from "@/components/ebook-landing/urgency"

export const metadata: Metadata = {
  title: "Guía gratuita",
  description:
    "Descarga gratis 10 pilares para liberar +100 horas semanales y multiplicar la facturación de tus rentas cortas con IA.",
}

export default function EbookPage() {
  return (
    <EbookLeadProvider>
      <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
        <EbookHero />
        <EbookProof />
        <EbookUrgency />
        <EbookMetrics />
        <EbookFinalCta />
      </div>
    </EbookLeadProvider>
  )
}
