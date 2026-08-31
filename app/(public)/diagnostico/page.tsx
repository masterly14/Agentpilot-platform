import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { BookingWidgetLight } from "@/components/diagnosis/booking-widget-light"
import { SqlDiagnosisHero } from "@/components/diagnosis/sql-diagnosis-hero"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard } from "@/components/social-proof/primitives"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Agendar diagnóstico",
  description:
    "El libro te dice qué se puede automatizar. En 70 minutos miramos tu operación y sales con un número: cuánto te está costando no hacerlo.",
}

export default async function SqlDiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>
}) {
  const { lead } = await searchParams
  const token = lead?.trim() ?? ""
  if (!token) notFound()

  const submission = await prisma.formSubmission.findUnique({
    where: { pdfToken: token },
    select: {
      fullName: true,
      email: true,
      qualification: true,
    },
  })

  if (!submission) notFound()

  if (submission.qualification !== "SQL") {
    redirect(`/gracias?lead=${encodeURIComponent(token)}`)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
      <DashedGrid gridId="diagnostico-sql" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SqlDiagnosisHero />
        <div id="booking" className="scroll-mt-8">
          <GlowCard className="p-2 md:p-3">
            <BookingWidgetLight
              leadToken={token}
              leadName={submission.fullName ?? ""}
              leadEmail={submission.email ?? ""}
            />
          </GlowCard>
        </div>
      </DashedGrid>
    </div>
  )
}
