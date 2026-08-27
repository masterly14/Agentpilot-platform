import type { Metadata } from "next"
import Link from "next/link"
import { LandingVideoPlayer } from "@/components/landing/landing-video-player"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { GlowCard, SectionHeading } from "@/components/social-proof/primitives"

export const metadata: Metadata = {
  title: "El proceso de diagnóstico",
  description: "Conoce cómo funciona el proceso de diagnóstico de Agent Pilot.",
}

export default async function VideoPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>
}) {
  const token = (await searchParams).lead?.trim() ?? ""
  const bookingHref = token ? `/agendar?lead=${encodeURIComponent(token)}` : "/diagnosis"

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-zinc-800">
      <DashedGrid gridId="video-nutricion" maxWidth="5xl" padding="px-4 py-10 md:px-6 md:py-16">
        <SectionHeading
          eyebrow="Proceso de diagnóstico"
          titleLead="Te dejo el video que"
          titleAccent="te prometí por WhatsApp"
          description="En pocos minutos te explico cómo revisamos tu operación y qué puedes llevarte de una sesión de diagnóstico."
          className="mb-6 md:mb-8"
        />

        <div className="mb-6 flex justify-center">
          <Link
            href={bookingHref}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium tracking-wide text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
          >
            Agendar mi diagnóstico
          </Link>
        </div>

        <GlowCard className="overflow-hidden p-0">
          <LandingVideoPlayer leadToken={token || undefined} />
        </GlowCard>

        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Si ya ves claro que quieres revisar tu operación, podemos hablar cuando te quede mejor.
          </p>
          <Link
            href={bookingHref}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium tracking-wide text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
          >
            Agendar mi diagnóstico
          </Link>
        </div>
      </DashedGrid>
    </div>
  )
}
