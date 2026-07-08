import { ScrollDownButton } from "./scroll-down-button"
import { DashedGrid } from "./dashed-grid"

export function HeroSection() {
  return (
    <DashedGrid
      gridId="hero"
      padding="p-0"
      contentClassName="flex min-h-svh flex-col md:min-h-0"
    >
      <div className="flex min-h-svh flex-col justify-between px-4 pb-16 pt-20 text-center md:min-h-0 md:block md:px-0 md:pb-0 md:pt-16 md:text-left">
        <div className="flex flex-col items-center gap-8 md:items-start md:gap-0">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2 md:m-10">
            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
            <span className="text-sm text-muted-foreground">Cupos limitados</span>
          </div>

          <div className="space-y-4 md:m-10 md:space-y-4">
            <h1 className="bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-4xl font-light leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl dark:from-zinc-400 dark:via-zinc-200 dark:to-zinc-500">
              Infraestructura de IA para
              <br />
              <span className="font-serif italic font-normal">Property</span> Managers
              <br />
              y empresas de <span className="font-serif italic font-normal">Renta Corta</span>
            </h1>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground md:mb-10 md:px-10 md:text-left md:text-xl lg:text-2xl">
            La logística de varias propiedades no debería consumirte el día ni frenar tu crecimiento.
            Nuestro sistema automatiza lo crítico de tu operación para que recuperes +100 horas a la semana, aumentes capacidad operativa y reseñas positivas — sin un
            equipo gigante.
          </p>
        </div>
        <DashedGrid
          gridId="hero-cta"
          padding="px-0 py-0 md:px-6 md:py-4"
          contentClassName="flex justify-center p-0 md:justify-start"
        >
          <ScrollDownButton targetId="booking" />
        </DashedGrid>
      </div>
    </DashedGrid>
  )
}
