import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { BookingWidgetLight } from "@/components/diagnosis/booking-widget-light"
import { SQL_DIAGNOSIS_HERO } from "@/components/diagnosis/content"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, SectionHeading } from "@/components/social-proof/primitives"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Diagnóstico de IA",
  description:
    "Cumples los criterios para agendar un diagnóstico gratuito y ver cómo implementar IA en tu operación de rentas cortas.",
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
        <SectionHeading
          eyebrow={SQL_DIAGNOSIS_HERO.badge}
          titleLead={SQL_DIAGNOSIS_HERO.titleLead}
          titleAccent={SQL_DIAGNOSIS_HERO.titleAccent}
          description={SQL_DIAGNOSIS_HERO.description}
          className="mb-10 md:mb-14"
        />
        <GlowCard className="p-2 md:p-3">
          <BookingWidgetLight
            leadToken={token}
            leadName={submission.fullName ?? ""}
            leadEmail={submission.email ?? ""}
          />
        </GlowCard>
      </DashedGrid>
    </div>
  )
}
