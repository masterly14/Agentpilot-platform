"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, ChevronUp } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { cn } from "@/lib/utils"

export const formInputCls =
  "w-full border-0 border-b-2 border-border/60 bg-transparent py-3 text-lg font-light text-foreground placeholder:text-muted-foreground/50 focus:border-indigo-500 focus:outline-none transition-colors leading-relaxed"

export const formLabelCls =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"

type FormShellProps = {
  children: React.ReactNode
  badge?: string
}

export function FormShell({ children, badge }: FormShellProps) {
  return (
    <div className="min-h-svh overflow-x-hidden bg-black text-foreground">
      <header className="relative z-20 px-4 pt-6 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
        {badge && (
          <div className="mt-6 flex justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
              {badge}
            </span>
          </div>
        )}
      </header>

      <DashedGrid
        gridId="qualification-form"
        padding="px-4 py-10 md:px-6 md:py-16"
        contentClassName="flex min-h-[calc(100vh-8rem)] flex-col justify-center pb-28"
      >
        <div className="mx-auto w-full max-w-xl">{children}</div>
      </DashedGrid>
    </div>
  )
}

export function FormTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-3xl font-light leading-tight tracking-tight text-foreground md:text-4xl">
      {children}
    </h2>
  )
}

export function FormSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-8 text-sm text-muted-foreground md:text-base">{children}</p>
}

export function StepBadge({ n }: { n: number }) {
  return (
    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-semibold text-white">
      {n}
    </span>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-base font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl hover:shadow-indigo-600/30 disabled:opacity-40"
    >
      {children}
    </button>
  )
}

export function ChoiceButton({
  letter,
  label,
  selected,
  onClick,
}: {
  letter: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-full border-2 px-4 py-3.5 text-left text-sm font-medium transition-all md:max-w-md",
        selected
          ? "border-indigo-500/80 bg-indigo-600/15 text-foreground shadow-md shadow-indigo-600/10"
          : "border-dashed border-border bg-gradient-to-b from-[#0D0D0F]/80 to-[#141417]/80 text-foreground hover:border-indigo-500/40 hover:bg-indigo-600/5"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
          selected
            ? "border-indigo-500 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
            : "border-border text-muted-foreground"
        )}
      >
        {letter}
      </span>
      {label}
    </button>
  )
}

export function FormNavigation({
  onNext,
  onPrev,
  canProceed,
  isSubmitting,
  isContact,
  stepNumber,
  totalSteps,
  showNext = true,
  showPrev = true,
}: {
  onNext: () => void
  onPrev: () => void
  canProceed: boolean
  isSubmitting: boolean
  isContact: boolean
  stepNumber: number
  totalSteps: number
  showNext?: boolean
  showPrev?: boolean
}) {
  return (
    <div className="fixed bottom-6 right-4 z-30 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {showNext && (
        <PrimaryButton onClick={onNext} disabled={!canProceed || isSubmitting}>
          {isSubmitting ? "Enviando..." : isContact ? "Enviar" : "Siguiente"}
          {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        </PrimaryButton>
      )}

      <div className="flex items-center gap-2">
        {showPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-border bg-black/80 text-foreground backdrop-blur-sm transition-colors hover:bg-muted/30"
            title="Anterior"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        )}
        <span className="rounded-full border border-border/50 bg-black/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
          {stepNumber} / {totalSteps}
        </span>
      </div>
    </div>
  )
}
