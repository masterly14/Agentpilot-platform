import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, SectionHeading } from "@/components/social-proof/primitives"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Guía enviada",
  description: "Ya tienes los 10 pilares. Revisa tu correo y el archivo descargado.",
}

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>
}) {
  const { lead } = await searchParams
  const token = lead?.trim() ?? ""
  const submission = token
    ? await prisma.formSubmission.findUnique({
        where: { pdfToken: token },
        select: { fullName: true, email: true, qualification: true },
      })
    : null

  const firstName = submission?.fullName?.trim().split(/\s+/)[0] ?? ""
  const isMql = submission?.qualification === "MQL"

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
      <DashedGrid gridId="gracias" maxWidth="2xl" padding="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <SectionHeading
            eyebrow="Guía descargada"
            titleLead={firstName ? `${firstName}, ya tienes` : "Ya tienes"}
            titleAccent="los 10 pilares"
            description={
              isMql
                ? "Revisa el PDF y tu correo. En los próximos días te vamos a escribir por WhatsApp para entender mejor tu operación antes de pedirte una reunión."
                : "Revisa el PDF y tu correo. Si más adelante tu operación crece y quieres ver si el sistema aplica, puedes volver a esta página."
            }
            className="mb-8"
          />
          {submission?.email ? (
            <GlowCard className="mb-8 w-full p-5 text-left md:p-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                También enviamos la guía a{" "}
                <span className="font-medium text-white">{submission.email}</span>. Si no la ves,
                revisa spam o la sección de adjuntos.
              </p>
            </GlowCard>
          ) : null}
          <Link
            href="/ebook"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium tracking-wide text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
          >
            Volver a la guía
          </Link>
        </div>
      </DashedGrid>
    </div>
  )
}
