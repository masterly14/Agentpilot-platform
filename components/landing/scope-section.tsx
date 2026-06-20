import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { DashedGrid } from "./dashed-grid"

const FORM_URL = "/qualificacion"

const phases = [
  {
    step: "01",
    title: "Cualificación",
    description:
      "Cuéntanos tu contexto en un formulario breve. Así entendemos tus objetivos antes de la llamada de descubrimiento.",
  },
  {
    step: "02",
    title: "Propuesta personalizada",
    description:
      "Tras la llamada de discovery, recibes alcance, plazos e inversión adaptados a tu proyecto — sin sorpresas.",
  },
  {
    step: "03",
    title: "Desarrollo",
    description:
      "Arrancamos cuando ambos estemos alineados. Inversión clara, entregables definidos y plazos acordados.",
  },
]

const budgetFactors = [
  "Complejidad funcional y número de módulos",
  "Integraciones con APIs, ERPs o sistemas existentes",
  "Plazos y urgencia del proyecto",
  "Mantenimiento y soporte post-lanzamiento",
  "Automatizaciones e infraestructura de IA",
  "Usuarios, roles y permisos del sistema",
]

export function ScopeSection() {
  return (
    <section id="alcance" className="scroll-mt-8">
      <DashedGrid maxWidth="6xl" padding="px-5 py-10 md:px-6 md:py-12">
        <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center md:mb-12">
          <div className="flex justify-center">
            <span className="rounded-full bg-muted px-4 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Inversión
            </span>
          </div>
          <h2 className="text-3xl font-light text-foreground md:text-5xl">
            Presupuesto <span className="font-serif italic">a medida</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            No publicamos tarifas genéricas porque cada sistema es diferente. Primero descubrimos qué necesitas.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {phases.map((phase) => (
            <div
              key={phase.title}
              className="space-y-4 rounded-3xl border border-border bg-muted/20 px-5 py-8 dark:border-2 dark:border-muted/40 dark:border-t-[3px] dark:bg-gradient-to-b dark:from-[#0D0D0F] dark:to-[#141417] md:px-6 md:py-10"
            >
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {phase.step}
              </span>
              <h3 className="text-xl font-semibold text-foreground md:text-2xl">{phase.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{phase.description}</p>
            </div>
          ))}
        </div>
      </DashedGrid>

      <DashedGrid gridId="scope-factors" maxWidth="6xl" padding="px-5 py-14 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl space-y-8 md:space-y-10">
          <div className="space-y-3 text-center">
            <h3 className="text-2xl font-light text-foreground md:text-3xl">
              Qué influye en el <span className="font-serif italic">presupuesto</span>
            </h3>
            <p className="text-base text-muted-foreground md:text-lg">
              Cada proyecto se cotiza según su alcance real, no según un plan genérico.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-4">
            {budgetFactors.map((factor) => (
              <div key={factor} className="flex gap-3">
                <div className="h-fit shrink-0 rounded-full bg-muted p-1">
                  <Check className="h-4 w-4" />
                </div>
                <span className="leading-relaxed text-foreground">{factor}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Link
              href={FORM_URL}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-700 hover:to-violet-700 md:w-auto"
            >
              Iniciar proceso
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </DashedGrid>
    </section>
  )
}
