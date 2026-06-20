import { Check } from "lucide-react"
import { DashedGrid } from "./dashed-grid"

const steps = [
  {
    title: "Cualificación",
    description:
      "Completas un breve formulario para ayudarnos a entender tus objetivos y preparar a tu equipo para nuestra llamada de descubrimiento. Si cumples con nuestros criterios, serás redirigido a nuestro calendario.",
    visual: "requirements" as const,
  },
  {
    title: "Llamada de descubrimiento",
    description:
      "En esta llamada, revisaremos los requisitos de tu proyecto y el alcance para obtener una comprensión clara de lo que significa el éxito para ti.",
    visual: "calendar" as const,
  },
  {
    title: "Pago",
    description:
      "Al final de la llamada de descubrimiento, tu pago será procesado en la llamada para comenzar a cumplir con los plazos inmediatamente!",
    visual: "payment" as const,
  },
]

const calendarDays = [
  { day: "Dom", date: "20", month: "Jun" },
  { day: "Lun", date: "12", month: "Ene" },
  { day: "Mar", date: "20", month: "Mar" },
  { day: "Mié", date: "18", month: "Mar" },
  { day: "Jue", date: "15", month: "Mar" },
  { day: "Vie", date: "19", month: "Feb" },
  { day: "Mié", date: "9", month: "Ene" },
  { day: "Vie", date: "7", month: "Mar" },
  { day: "Sáb", date: "1", month: "Feb" },
  { day: "Dom", date: "16", month: "May" },
  { day: "Lun", date: "12", month: "Ene" },
  { day: "Mar", date: "18", month: "Abr" },
]

const requirementStyles = {
  mobile: [
    { translate: "translate(8px, 20px) scale(0.55)", opacity: 0.2, zIndex: 10, marginTop: 0 },
    { translate: "translate(6px, 14px) scale(0.65)", opacity: 0.4, zIndex: 20, marginTop: 30 },
    { translate: "translate(4px, 8px) scale(0.78)", opacity: 0.65, zIndex: 30, marginTop: 60 },
    { translate: "translate(0px, 0px) scale(0.9)", opacity: 1, zIndex: 40, marginTop: 90 },
  ],
  desktop: [
    { translate: "translate(30px, 44px) scale(0.6)", opacity: 0.2, zIndex: 10, marginTop: 0 },
    { translate: "translate(20px, 26px) scale(0.7)", opacity: 0.4, zIndex: 20, marginTop: 50 },
    { translate: "translate(10px, 13px) scale(0.85)", opacity: 0.65, zIndex: 30, marginTop: 100 },
    { translate: "translate(0px, 0px) scale(1)", opacity: 1, zIndex: 40, marginTop: 150 },
  ],
}

function RequirementsVisual() {
  const requirements = ["Requisito 4", "Requisito 3", "Requisito 2", "Requisito 1"]

  return (
    <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden px-2 pb-8 pt-4 backdrop-blur-2xl md:ml-16 md:min-h-[320px] md:px-6">
      <div className="relative h-[200px] w-full max-w-[280px] md:h-[240px] md:max-w-md">
        {requirements.map((label, index) => (
          <div
            key={label}
            className="absolute left-0 right-0 md:hidden"
            style={{
              transform: requirementStyles.mobile[index].translate,
              marginTop: requirementStyles.mobile[index].marginTop,
              zIndex: requirementStyles.mobile[index].zIndex,
              opacity: requirementStyles.mobile[index].opacity,
            }}
          >
            <div className="absolute -left-6 top-1/2 -translate-y-1/2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full">
                <Check className="h-5 w-5" />
              </div>
            </div>
            <div className="w-full max-w-[260px] rounded-full border-b-2 border-muted/70 border-t-2 border-t-accent bg-gradient-to-t from-zinc-100 to-zinc-200 px-5 py-3 shadow-xl backdrop-blur-2xl dark:from-[#0D0D0F] dark:to-[#141417]">
              <span className="text-base font-light text-zinc-600 dark:text-zinc-300">{label}</span>
            </div>
          </div>
        ))}
        {requirements.map((label, index) => (
          <div
            key={`${label}-desktop`}
            className="absolute left-0 right-0 hidden md:block"
            style={{
              transform: requirementStyles.desktop[index].translate,
              marginTop: requirementStyles.desktop[index].marginTop,
              zIndex: requirementStyles.desktop[index].zIndex,
              opacity: requirementStyles.desktop[index].opacity,
            }}
          >
            <div className="absolute -left-10 top-1/2 -translate-y-1/2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full">
                <Check className="h-6 w-6" />
              </div>
            </div>
            <div className="w-[600px] rounded-full border-b-2 border-muted/70 border-t-2 border-t-accent bg-gradient-to-t from-zinc-100 to-zinc-200 px-8 py-5 shadow-xl backdrop-blur-2xl dark:from-[#0D0D0F] dark:to-[#141417]">
              <span className="text-2xl font-light text-zinc-600 dark:text-zinc-300">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarVisual() {
  return (
    <div className="flex min-h-[260px] items-center justify-center px-4 pb-8 pt-4 md:min-h-[320px] md:px-6">
      <div className="grid max-w-sm grid-cols-3 gap-2 md:gap-3">
        {calendarDays.map((item) => (
          <div
            key={`${item.day}-${item.date}-${item.month}`}
            className="flex flex-col items-center rounded-2xl border border-border/40 bg-gradient-to-b from-[#0D0D0F] to-[#141417] px-2 py-3 text-center md:px-3 md:py-4"
          >
            <span className="text-xs text-muted-foreground">{item.day}</span>
            <span className="text-xl font-light text-foreground md:text-2xl">{item.date}</span>
            <span className="text-xs text-muted-foreground">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaymentVisual() {
  return (
    <div className="flex min-h-[260px] items-center justify-center px-4 pb-8 pt-4 md:min-h-[320px] md:px-6">
      <div className="w-full   max-w-sm space-y-4">
        <div className="rounded-full border border-border/50 bg-gradient-to-b from-[#0D0D0F] to-[#141417] px-6 py-3 text-center text-sm text-muted-foreground">
          Pago procesado
          <div className="text-xs">ID de transacción: #11554578</div>
        </div>
        <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-[#0D0D0F] to-[#141417] px-8 py-10 text-center shadow-xl">
          <span className="text-4xl font-light text-foreground md:text-5xl">$1.000</span>
        </div>
      </div>
    </div>
  )
}

function StepVisual({ type }: { type: (typeof steps)[number]["visual"] }) {
  if (type === "requirements") return <RequirementsVisual />
  if (type === "calendar") return <CalendarVisual />
  return <PaymentVisual />
}

export function ProcessSection() {
  return (
    <DashedGrid maxWidth="6xl">
      <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center md:mb-12">
        <div className="flex justify-center">
          <span className="rounded-full bg-muted px-4 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Proceso
          </span>
        </div>
        <h2 className="text-3xl font-light text-foreground md:text-5xl">
          Como <span className="font-serif italic">trabajamos</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Hacemos el proceso super fácil!
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.title}
            className="space-y-4 rounded-3xl border border-border bg-muted/20 dark:border-2 dark:border-muted/40 dark:border-t-[3px] dark:bg-gradient-to-b dark:from-[#0D0D0F] dark:to-[#141417]"
          >
            <div className="space-y-3 px-4 pt-6 md:px-6 md:pt-8">
              <h3 className="text-xl font-semibold text-foreground md:text-2xl">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{step.description}</p>
            </div>
            <div className="relative overflow-hidden">
              <StepVisual type={step.visual} />
            </div>
          </div>
        ))}
      </div>
    </DashedGrid>
  )
}
