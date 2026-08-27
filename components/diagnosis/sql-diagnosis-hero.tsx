import { ArrowRight, Check } from "lucide-react"
import { SQL_DIAGNOSIS_HERO } from "./content"
import { CtaButton, Reveal } from "@/components/social-proof/primitives"

export function SqlDiagnosisHero() {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <Reveal>
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
          {SQL_DIAGNOSIS_HERO.badge}
        </span>
      </Reveal>

      <Reveal delay={0.08}>
        <h1 className="mt-4 text-balance bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-3xl font-light leading-[1.15] tracking-tight text-zinc-100 [-webkit-background-clip:text] md:text-4xl md:text-transparent lg:text-5xl">
          {SQL_DIAGNOSIS_HERO.titleLead}
          <br />
          <span className="font-serif italic text-white">{SQL_DIAGNOSIS_HERO.titleAccent}</span>
        </h1>
      </Reveal>

      <Reveal delay={0.16}>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-zinc-200 md:text-xl">
          {SQL_DIAGNOSIS_HERO.subtitle}
        </p>
      </Reveal>

      <Reveal delay={0.22}>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {SQL_DIAGNOSIS_HERO.description}
        </p>
      </Reveal>

      <Reveal delay={0.28}>
        <div className="mx-auto mt-8 max-w-lg text-left">
          <p className="mb-3 text-sm font-medium text-zinc-300">
            {SQL_DIAGNOSIS_HERO.callAgendaTitle}
          </p>
          <ul className="space-y-2.5">
            {SQL_DIAGNOSIS_HERO.callAgenda.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400 md:text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" strokeWidth={2.5} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.34}>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href={SQL_DIAGNOSIS_HERO.ctaHref}>
            {SQL_DIAGNOSIS_HERO.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </CtaButton>
          <p className="text-sm text-zinc-500">{SQL_DIAGNOSIS_HERO.ctaMeta}</p>
        </div>
      </Reveal>
    </div>
  )
}
