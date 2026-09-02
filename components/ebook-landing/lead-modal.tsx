"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import { ArrowLeft, Check, Loader2, Lock, ShieldCheck, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BOOKING_FORM_STEPS,
  CONTACT_PROMPT_EBOOK,
  CONTACT_SURVEY_THANKS,
  INITIAL_BOOKING_FORM,
  isValidOptionalUrl,
  PMS_OPTIONS,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/booking/form-options"
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  isValidPhoneNumber,
  PHONE_COUNTRY_OPTIONS,
} from "@/lib/booking/phone-countries"
import { FormProgressBar, FormStepTransition } from "@/components/qualification/form-progress"
import { trackEbookLead } from "@/lib/facebook-pixel"
import { collectAttribution } from "@/lib/marketing/attribution-client"
import { usePartialSubmission } from "@/hooks/use-partial-submission"
import { getVisitorId } from "@/lib/visitor-id"
import type { LeadFormPayload } from "@/lib/booking/types"
import { cn } from "@/lib/utils"

const TRUST_POINTS = [
  "Sin spam",
  "No vendemos tus datos",
  "Descarga inmediata",
] as const

type EbookLeadContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const EbookLeadContext = createContext<EbookLeadContextValue | null>(null)

export function useEbookLeadModal() {
  const context = useContext(EbookLeadContext)
  if (!context) {
    throw new Error("useEbookLeadModal must be used within EbookLeadProvider")
  }
  return context
}

export function EbookLeadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ open, setOpen }), [open])

  return (
    <EbookLeadContext.Provider value={value}>
      {children}
      <EbookLeadModal open={open} onOpenChange={setOpen} />
    </EbookLeadContext.Provider>
  )
}

const inputClassName =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900/40 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
const selectClassName =
  "w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-900/40 bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3.5 py-2.5 pr-10 text-sm text-white outline-none transition-colors [color-scheme:dark] focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 disabled:text-zinc-500"

function ChevronBg() {
  return {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  }
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium leading-snug text-zinc-300">
      {children}
      {required ? <span className="text-zinc-500"> *</span> : null}
    </label>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            {title}
          </h3>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>
        {description ? (
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[11px] leading-snug text-zinc-500">{children}</p>
}

function LeadOption({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg border px-4 py-3.5 text-left text-sm transition-all",
        selected
          ? "border-white bg-zinc-800 text-white shadow-sm"
          : "border-zinc-700 bg-zinc-900/40 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/40"
      )}
    >
      {label}
    </button>
  )
}

function LeadInput({
  id,
  label,
  type,
  value,
  placeholder,
  required,
  hint,
  onChange,
  onBlur,
}: {
  id: string
  label: string
  type: string
  value: string
  placeholder: string
  required?: boolean
  hint?: string
  onChange: (value: string) => void
  onBlur?: () => void
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={inputClassName}
      />
      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </div>
  )
}

function LeadPhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  onBlur,
}: {
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (value: string) => void
  onPhoneNumberChange: (value: string) => void
  onBlur?: () => void
}) {
  return (
    <div>
      <FieldLabel htmlFor="lead-phone" required>
        Número de teléfono
      </FieldLabel>
      <div className="flex gap-2">
        <select
          id="lead-phone-country"
          value={countryCode}
          onChange={(event) => onCountryCodeChange(event.target.value)}
          aria-label="Código de país"
          className={cn(selectClassName, "w-[148px] shrink-0")}
          style={ChevronBg()}
        >
          {PHONE_COUNTRY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          id="lead-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          value={phoneNumber}
          placeholder="Ej: 300 123 4567"
          onChange={(event) => onPhoneNumberChange(event.target.value.replace(/[^\d\s-]/g, ""))}
          onBlur={onBlur}
          className={inputClassName}
        />
      </div>
      <FieldHint>Por si hay un problema con el envío de la guía. No te llamamos a venderte.</FieldHint>
    </div>
  )
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function EbookLeadModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [formStep, setFormStep] = useState(0)
  const directionRef = useRef(1)
  const [form, setForm] = useState<LeadFormPayload>(INITIAL_BOOKING_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const { getToken, sync, flush, clear } = usePartialSubmission({
    entrySource: "EBOOK",
    enabled: open && !submitted,
  })

  const step = BOOKING_FORM_STEPS[formStep]
  const isLastStep = formStep === BOOKING_FORM_STEPS.length - 1
  const isFirstStep = formStep === 0

  const update = useCallback(
    <K extends keyof LeadFormPayload>(field: K, value: LeadFormPayload[K]) => {
      const next = { ...form, [field]: value }
      setForm(next)
      sync(next, field)
    },
    [form, sync]
  )

  const goTo = useCallback((next: number) => {
    directionRef.current = next > formStep ? 1 : -1
    setFormStep(next)
  }, [formStep])

  const reset = useCallback(() => {
    setFormStep(0)
    setForm(INITIAL_BOOKING_FORM)
    setIsSubmitting(false)
    setErrorMessage(null)
    setSubmitted(false)
  }, [])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        void flush()
      }
      onOpenChange(nextOpen)
      if (!nextOpen) {
        window.setTimeout(reset, 200)
      }
    },
    [flush, onOpenChange, reset]
  )

  const canContinueContact =
    form.fullName.trim().length > 0 &&
    isValidEmail(form.email) &&
    form.companyName.trim().length > 0 &&
    isValidPhoneNumber(form.phoneNumber)

  const questionsComplete =
    Boolean(form.propertyCount) &&
    Boolean(form.revenueRange) &&
    Boolean(form.usesPms) &&
    Boolean(form.isTodero) &&
    Boolean(form.teamSize) &&
    Boolean(form.wantsToScale) &&
    Boolean(form.usesAi) &&
    isValidOptionalUrl(form.websiteUrl)

  const canAdvance =
    step?.id === "contact"
      ? canContinueContact && questionsComplete && !isSubmitting
      : Boolean(step)

  const selectAndAdvance = (field: keyof LeadFormPayload, value: string) => {
    update(field, value)
    if (isSubmitting || isLastStep) return
    goTo(formStep + 1)
  }

  const handleSubmit = useCallback(async () => {
    if (!questionsComplete || !canContinueContact || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await flush()
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          leadToken: getToken() || undefined,
          attribution: collectAttribution(),
          visitorId: getVisitorId() || undefined,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? "No se pudo enviar el formulario")
      }

      const payload = (await response.json()) as {
        token?: string
        qualification?: string
        redirectTo?: string
        eventId?: string | null
      }
      if (payload.eventId) {
        trackEbookLead({
          email: form.email,
          fullName: form.fullName,
          eventID: payload.eventId,
        })
      }
      clear()
      if (payload.token) {
        const downloadUrl = `/api/ebook/download?lead=${encodeURIComponent(payload.token)}`
        try {
          const fileResponse = await fetch(downloadUrl)
          if (fileResponse.ok) {
            const blob = await fileResponse.blob()
            const objectUrl = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = objectUrl
            link.download = "guia-agent-pilot.pdf"
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
          }
        } catch {
          window.open(downloadUrl, "_blank", "noopener,noreferrer")
        }
      }
      window.location.assign(payload.redirectTo || "/gracias")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo enviar el formulario")
    } finally {
      setIsSubmitting(false)
    }
  }, [canContinueContact, clear, flush, form, getToken, isSubmitting, questionsComplete])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] gap-0 overflow-y-auto border border-zinc-800/80 bg-gradient-to-b from-[#0D0D0F] to-[#141417] p-6 text-white shadow-[0_0_60px_-12px_rgba(0,0,0,0.8)] sm:max-w-[540px] sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center px-2 py-10 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <DialogTitle className="bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-2xl font-light tracking-tight text-transparent">
              Guía descargada
            </DialogTitle>
            <DialogDescription className="mt-3 max-w-sm text-sm text-zinc-400">
              Si la descarga no empezó, revisa tu bandeja en {form.email}. También te enviamos el enlace para volver a bajarla.
            </DialogDescription>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white py-3.5 text-sm font-medium tracking-wide text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
            >
              Listo
            </button>
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">Descarga la guía gratis</DialogTitle>
            <DialogDescription className="sr-only">
              Responde unas preguntas y déjanos tus datos para enviarte el Ebook.
            </DialogDescription>
            <FormProgressBar
              stepIndex={formStep}
              totalSteps={BOOKING_FORM_STEPS.length}
              tone="dark"
            />
            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (isFirstStep) return
                  goTo(formStep - 1)
                }}
                disabled={isSubmitting || isFirstStep}
                className="-ml-1 flex h-6 w-6 shrink-0 items-center justify-center text-zinc-500 transition-colors hover:text-white disabled:opacity-40"
                aria-label="Pregunta anterior"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <p className="text-[11px] leading-snug text-zinc-500">
                Entendamos si el Ebook te servirá y no perderás tiempo, responde estas preguntas antes
              </p>
            </div>

            <FormStepTransition stepKey={step?.id ?? "step"} direction={directionRef.current}>
              <h3
                className={cn(
                  "mt-5 text-lg font-semibold leading-snug text-white md:text-xl",
                  step?.id === "contact" ? "mb-2" : "mb-5"
                )}
              >
                {step?.id === "contact" ? CONTACT_SURVEY_THANKS : step?.question}
              </h3>
              {step?.id === "contact" ? (
                <p className="mb-5 text-sm leading-relaxed text-zinc-400">{CONTACT_PROMPT_EBOOK}</p>
              ) : null}

              <div className="space-y-2.5">
                {step?.id === "propertyCount" &&
                  PROPERTY_OPTIONS.map((option) => (
                    <LeadOption
                      key={option.value}
                      label={option.label}
                      selected={form.propertyCount === option.value}
                      onSelect={() => selectAndAdvance("propertyCount", option.value)}
                    />
                  ))}

                {step?.id === "usesPms" &&
                  PMS_OPTIONS.map((option) => (
                    <LeadOption
                      key={option.value}
                      label={option.label}
                      selected={form.usesPms === option.value}
                      onSelect={() => selectAndAdvance("usesPms", option.value)}
                    />
                  ))}

                {step?.id === "isTodero" &&
                  YES_NO_OPTIONS.map((option) => (
                    <LeadOption
                      key={option.value}
                      label={option.label}
                      selected={form.isTodero === option.value}
                      onSelect={() => selectAndAdvance("isTodero", option.value)}
                    />
                  ))}

                {step?.id === "teamSize" &&
                  TEAM_SIZE_OPTIONS.map((option) => (
                    <LeadOption
                      key={option.value}
                      label={option.label}
                      selected={form.teamSize === option.value}
                      onSelect={() => selectAndAdvance("teamSize", option.value)}
                    />
                  ))}

                {step?.id === "wantsToScale" &&
                  YES_NO_OPTIONS.map((option) => (
                    <LeadOption
                      key={option.value}
                      label={option.label}
                      selected={form.wantsToScale === option.value}
                      onSelect={() => selectAndAdvance("wantsToScale", option.value)}
                    />
                  ))}

                {step?.id === "usesAi" &&
                  YES_NO_OPTIONS.map((option) => (
                    <LeadOption
                      key={option.value}
                      label={option.label}
                      selected={form.usesAi === option.value}
                      onSelect={() => selectAndAdvance("usesAi", option.value)}
                    />
                  ))}

                {step?.id === "revenueRange" &&
                  REVENUE_OPTIONS.map((option) => (
                    <LeadOption
                      key={option.value}
                      label={option.label}
                      selected={form.revenueRange === option.value}
                      onSelect={() => selectAndAdvance("revenueRange", option.value)}
                    />
                  ))}

                {step?.id === "contact" && (
                  <div className="space-y-4">
                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-500">
                      {TRUST_POINTS.map((point) => (
                        <li key={point} className="inline-flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400/80" strokeWidth={2} />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <LeadInput
                      id="lead-name"
                      label="Nombre completo"
                      type="text"
                      required
                      value={form.fullName}
                      placeholder="Ej: María García"
                      onChange={(value) => update("fullName", value)}
                      onBlur={() => {
                        void flush()
                      }}
                    />
                    <LeadInput
                      id="lead-email"
                      label="Email profesional"
                      type="email"
                      required
                      value={form.email}
                      placeholder="Ej: maria@tuinmobiliaria.es"
                      hint="Ahí te enviamos la guía y el enlace por si quieres volver a descargarla."
                      onChange={(value) => update("email", value)}
                      onBlur={() => {
                        void flush()
                      }}
                    />
                    <LeadInput
                      id="lead-company"
                      label="Nombre de tu empresa"
                      type="text"
                      required
                      value={form.companyName}
                      placeholder="Ej: Inmobiliaria Sol"
                      onChange={(value) => update("companyName", value)}
                      onBlur={() => {
                        void flush()
                      }}
                    />
                    <LeadPhoneInput
                      countryCode={form.phoneCountryCode || DEFAULT_PHONE_COUNTRY_CODE}
                      phoneNumber={form.phoneNumber}
                      onCountryCodeChange={(value) => update("phoneCountryCode", value)}
                      onPhoneNumberChange={(value) => update("phoneNumber", value)}
                      onBlur={() => {
                        void flush()
                      }}
                    />
                    <FormSection
                      title="Redes sociales"
                      description="Opcional. Si las dejas, nos ayuda a entender tu marca. Si no, igual descargas la guía."
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <LeadInput
                          id="lead-instagram"
                          label="Instagram (opcional)"
                          type="text"
                          value={form.instagramUrl}
                          placeholder="@tuempresa"
                          onChange={(value) => update("instagramUrl", value)}
                        />
                        <LeadInput
                          id="lead-website"
                          label="Sitio web (opcional)"
                          type="url"
                          value={form.websiteUrl}
                          placeholder="https://tuempresa.com"
                          onChange={(value) => update("websiteUrl", value)}
                        />
                      </div>
                    </FormSection>
                  </div>
                )}
              </div>
            </FormStepTransition>

            {errorMessage ? <p className="mt-4 text-center text-sm text-red-400">{errorMessage}</p> : null}

            {isLastStep ? (
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={!canAdvance}
                  className={cn(
                    "group relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-full py-3 transition-all",
                    canAdvance
                      ? "bg-white text-black hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
                      : "cursor-not-allowed bg-zinc-800 text-zinc-500"
                  )}
                >
                  {canAdvance ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                  ) : null}
                  {isSubmitting ? (
                    <span className="relative inline-flex items-center gap-2 text-sm font-medium tracking-wide">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <>
                      <span className="relative text-sm font-medium tracking-wide">Enviar y descargar</span>
                      <span className="relative mt-0.5 text-[11px] font-normal text-zinc-600">
                        La guía llega a tu email al instante
                      </span>
                    </>
                  )}
                </button>
              </div>
            ) : null}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
              <Lock className="h-3.5 w-3.5 text-zinc-500" />
              100% Privacidad. No hacemos spam.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
