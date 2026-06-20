import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { DashedGrid } from "./dashed-grid"

const FORM_URL = "/qualificacion"

export function HeroSection() {
  return (
    <DashedGrid gridId="hero" padding="p-0" contentClassName="flex flex-col justify-center">
      <div className="pt-10 text-center md:pt-16 md:text-left">
        <div className="mx-4 my-6 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2 md:m-10">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
          <span className="text-sm text-muted-foreground">Cupos limitados</span>
        </div>

        <div className="mx-4 my-6 space-y-4 text-center md:m-10 md:text-left">
          <h1 className="bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-4xl font-light leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl dark:from-zinc-400 dark:via-zinc-200 dark:to-zinc-500">
            Desarrollamos <span className="font-serif italic font-normal">Software</span>
            <br />
            a medida
          </h1>
        </div>

        <p className="mx-auto mb-6 max-w-2xl px-4 text-center text-base text-muted-foreground md:mb-10 md:px-10 md:text-left md:text-xl lg:text-2xl">
          Colaboramos con dueños de negocio y fundadores para crear infraestructura de IA, automatizaciones y software a medida, para optimizar sus procesos y aumentar su productividad.
        </p>

        <DashedGrid
          gridId="hero-cta"
          padding="px-4 py-6 md:px-6 md:py-4"
          contentClassName="flex justify-center p-0 md:justify-start"
        >
          <Link
            href={FORM_URL}
            className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-base font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-600/30"
          >
            Iniciar proceso
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </DashedGrid>
      </div>
    </DashedGrid>
  )
}
