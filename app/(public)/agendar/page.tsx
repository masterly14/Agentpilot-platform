import type { Metadata } from "next"
import Link from "next/link"
import { BookingWidget } from "@/components/landing/booking-widget"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, SectionHeading } from "@/components/social-proof/primitives"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Agendar diagnóstico",
  description: "Elige fecha y hora para tu reunión con Agent Pilot.",
}

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>
}) {
  const { lead } = await searchParams
  const token = lead?.trim() ?? ""
  const submission = token
    ? await prisma.formSubmission.findUnique({
        where: { pdfToken: token },
        select: { fullName: true, email: true },
      })
    : null

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
      <DashedGrid gridId="agendar" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        {submission ? (
          <>
            <SectionHeading
              eyebrow="Diagnóstico"
              titleLead="Elige el horario"
              titleAccent="y lo confirmamos"
              description={
                submission.fullName?.trim()
                  ? `Hola ${submission.fullName.trim().split(/\s+/)[0]}, ya tenemos tus datos de la guía. Solo falta la fecha.`
                  : "Ya tenemos tus datos de la guía. Solo falta la fecha."
              }
              className="mb-10 md:mb-14"
            />
            <GlowCard className="p-2 md:p-3">
              <BookingWidget
                leadToken={token}
                leadName={submission.fullName ?? ""}
                leadEmail={submission.email ?? ""}
              />
            </GlowCard>
          </>
        ) : (
          <div className="mx-auto max-w-lg text-center">
            <SectionHeading
              titleLead="Este enlace"
              titleAccent="ya no es válido"
              description="Abre el PDF que descargaste desde la guía o agenda tu diagnóstico desde la página pública."
              className="mb-8"
            />
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium tracking-wide text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
            >
              Ir a agendar
            </Link>
          </div>
        )}
      </DashedGrid>
    </div>
  )
}
