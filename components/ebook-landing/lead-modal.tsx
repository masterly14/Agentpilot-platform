"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { ArrowLeft, Check, Loader2, Lock, ShieldCheck, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  INDUSTRY_TIME_OPTIONS,
  INITIAL_BOOKING_FORM,
  isValidOptionalUrl,
  PMS_OPTIONS,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/booking/form-options"
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  isValidPhoneNumber,
  PHONE_COUNTRY_OPTIONS,
} from "@/lib/booking/phone-countries"
import { trackEbookLead } from "@/lib/facebook-pixel"
import { collectAttribution } from "@/lib/marketing/attribution-client"
import { usePartialSubmission } from "@/hooks/use-partial-submission"
import type { LeadFormPayload } from "@/lib/booking/types"
import { cn } from "@/lib/utils"

const TOTAL_STEPS = 2
const STEP_CONTACT = 1
const STEP_QUESTIONS = 2

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

function LeadSelect({
  id,
  label,
  value,
  placeholder,
  options,
  required,
  hint,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder: string
  options: readonly { value: string; label: string }[]
  required?: boolean
  hint?: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <select
        id={id}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(selectClassName, !value && "text-zinc-500")}
        style={ChevronBg()}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<LeadFormPayload>(INITIAL_BOOKING_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const { getToken, sync, flush, clear } = usePartialSubmission({
    entrySource: "EBOOK",
    enabled: open && !submitted,
  })

  const update = useCallback(
    <K extends keyof LeadFormPayload>(field: K, value: LeadFormPayload[K]) => {
      const next = { ...form, [field]: value }
      setForm(next)
      sync(next, field)
    },
    [form, sync]
  )

  const reset = useCallback(() => {
    setStep(1)
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

  const canSubmitQuestions =
    Boolean(form.propertyCount) &&
    Boolean(form.revenueRange) &&
    Boolean(form.usesPms) &&
    Boolean(form.isTodero) &&
    Boolean(form.wantsToScale) &&
    Boolean(form.usesAi) &&
    Boolean(form.industryTime) &&
    isValidOptionalUrl(form.websiteUrl)

  const canAdvance =
    (step === STEP_CONTACT && canContinueContact) ||
    (step === STEP_QUESTIONS && canSubmitQuestions && !isSubmitting)

  const handleSubmit = useCallback(async () => {
    if (!canSubmitQuestions || isSubmitting) return

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
  }, [canSubmitQuestions, clear, flush, form, getToken, isSubmitting])

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
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/35 px-5 py-5 pr-8 text-center sm:px-6">
              <DialogTitle className="bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-2xl font-light leading-tight tracking-tight text-transparent sm:text-3xl">
                {step === STEP_CONTACT ? (
                  <>
                    Descarga la{" "}
                    <span className="font-serif italic font-normal text-white">guía gratis</span>
                  </>
                ) : (
                  "Para que la guía te sirva de verdad"
                )}
              </DialogTitle>
              <DialogDescription className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                {step === STEP_CONTACT
                  ? "Los 10 pilares llegan a tu email en segundos. Pedimos tu contacto solo para enviártela: no hacemos spam, no vendemos tus datos y nadie te va a llamar a venderte."
                  : "No es un filtro comercial ni una calificación. Con estas respuestas sabemos qué pilares aterrizar a tu operación. Toma menos de un minuto y la descarga empieza al instante."}
              </DialogDescription>
              {step === STEP_CONTACT ? (
                <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-500">
                  {TRUST_POINTS.map((point) => (
                    <li key={point} className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400/80" strokeWidth={2} />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                  <Lock className="h-3.5 w-3.5" />
                  Tus respuestas quedan entre nosotros. Nunca las compartimos.
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    step === index + 1 ? "bg-cyan-400" : "bg-zinc-700"
                  )}
                />
              ))}
              <span className="ml-1 text-xs font-medium text-zinc-500">
                Paso {step} de {TOTAL_STEPS}
              </span>
            </div>

            {step === STEP_CONTACT ? (
              <div className="mt-6 space-y-4">
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
              </div>
            ) : (
              <div className="mt-6 space-y-7">
                <FormSection
                  title="Tu operación"
                  description="Sirven para aterrizar los 10 pilares a cómo trabajas hoy."
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <LeadSelect
                      id="lead-properties"
                      label="¿Con cuántas propiedades trabajas?"
                      value={form.propertyCount}
                      placeholder="Selecciona"
                      options={PROPERTY_OPTIONS}
                      onChange={(value) => update("propertyCount", value)}
                    />
                    <LeadSelect
                      id="lead-pms"
                      label="¿Tienes implementado un PMS?"
                      value={form.usesPms}
                      placeholder="Selecciona"
                      options={PMS_OPTIONS}
                      onChange={(value) => update("usesPms", value)}
                    />
                    <LeadSelect
                      id="lead-industry"
                      label="¿Cuánto tiempo llevas en la industria?"
                      value={form.industryTime}
                      placeholder="Selecciona"
                      options={INDUSTRY_TIME_OPTIONS}
                      onChange={(value) => update("industryTime", value)}
                    />
                    <LeadSelect
                      id="lead-ai"
                      label="¿Usas ChatGPT u otra IA para tareas de tu negocio?"
                      value={form.usesAi}
                      placeholder="Selecciona"
                      options={YES_NO_OPTIONS}
                      onChange={(value) => update("usesAi", value)}
                    />
                    <LeadSelect
                      id="lead-todero"
                      label="¿Te consideras el todero o coordinador del negocio?"
                      value={form.isTodero}
                      placeholder="Selecciona"
                      options={YES_NO_OPTIONS}
                      onChange={(value) => update("isTodero", value)}
                    />
                    <LeadSelect
                      id="lead-scale"
                      label="¿Quieres escalar el número de propiedades que operas?"
                      value={form.wantsToScale}
                      placeholder="Selecciona"
                      options={YES_NO_OPTIONS}
                      onChange={(value) => update("wantsToScale", value)}
                    />
                  </div>
                  <LeadSelect
                    id="lead-revenue"
                    label="¿Cuál es tu rango de facturación mensual?"
                    value={form.revenueRange}
                    placeholder="Selecciona un rango"
                    options={REVENUE_OPTIONS}
                    hint="Rango aproximado. Solo lo usamos internamente para dimensionar ejemplos. Nadie más lo ve."
                    onChange={(value) => update("revenueRange", value)}
                  />
                </FormSection>

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

            {errorMessage ? <p className="mt-4 text-center text-sm text-red-400">{errorMessage}</p> : null}

            <div className="mt-6 flex items-center gap-3">
              {step === STEP_QUESTIONS ? (
                <button
                  type="button"
                  onClick={() => setStep(STEP_CONTACT)}
                  disabled={isSubmitting}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/40 text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                  aria-label="Volver"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  if (step === STEP_CONTACT) {
                    if (canContinueContact) setStep(STEP_QUESTIONS)
                    return
                  }
                  void handleSubmit()
                }}
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
                ) : step === STEP_CONTACT ? (
                  <>
                    <span className="relative text-sm font-medium tracking-wide">Siguiente</span>
                    <span className="relative mt-0.5 text-[11px] font-normal text-zinc-600">
                      Un paso más y descargas
                    </span>
                  </>
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
