"use client"

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  isValidPhoneNumber,
  PHONE_COUNTRY_OPTIONS,
} from "@/lib/booking/phone-countries"
import { cn } from "@/lib/utils"

export type BookingFormData = {
  usesPms: string
  propertyCount: string
  revenueRange: string
  fullName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  companyName: string
  websiteUrl: string
}

export const INITIAL_BOOKING_FORM: BookingFormData = {
  usesPms: "",
  propertyCount: "",
  revenueRange: "",
  fullName: "",
  email: "",
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: "",
  companyName: "",
  websiteUrl: "",
}

type FormStepId = "usesPms" | "propertyCount" | "revenueRange" | "contact"

type StepConfig = {
  id: FormStepId
  question: string
  required?: boolean
}

const FORM_STEPS: StepConfig[] = [
  { id: "usesPms", question: "¿Usas actualmente un PMS?" },
  { id: "propertyCount", question: "¿Con cuántas propiedades trabajas?" },
  { id: "revenueRange", question: "¿Cuál es tu rango de facturación actual?" },
  { id: "contact", question: "Ingresa tus datos", required: true },
]

import {
  PMS_OPTIONS,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
} from "@/lib/booking/form-options"

function CalOption({
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
          : "border-zinc-700 bg-zinc-900/30 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/40"
      )}
    >
      {label}
    </button>
  )
}

function CalInput({
  id,
  label,
  type,
  value,
  placeholder,
  required,
  optional,
  onChange,
}: {
  id: string
  label: string
  type: string
  value: string
  placeholder: string
  required?: boolean
  optional?: boolean
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
        {optional && <span className="text-zinc-500"> (opcional)</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
      />
    </div>
  )
}

function CalPhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
}: {
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (value: string) => void
  onPhoneNumberChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor="booking-phone" className="mb-2 block text-sm font-medium text-zinc-300">
        Teléfono<span className="text-red-400"> *</span>
      </label>
      <div className="flex gap-2">
        <select
          id="booking-phone-country"
          value={countryCode}
          onChange={(event) => onCountryCodeChange(event.target.value)}
          aria-label="Código de país"
          className="w-[140px] shrink-0 rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-3 text-sm text-white focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        >
          {PHONE_COUNTRY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          id="booking-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          value={phoneNumber}
          onChange={(event) => onPhoneNumberChange(event.target.value.replace(/[^\d\s-]/g, ""))}
          placeholder="300 123 4567"
          className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>
    </div>
  )
}

function isValidOptionalUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return true

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(normalized)
    return Boolean(url.hostname.includes("."))
  } catch {
    return false
  }
}

export function BookingFormWizard({
  selectedDateLabel,
  selectedTimeLabel,
  formData,
  formStep,
  isSubmitting,
  errorMessage,
  onChange,
  onStepChange,
  onBackToTimes,
  onSubmit,
}: {
  selectedDateLabel: string
  selectedTimeLabel: string
  formData: BookingFormData
  formStep: number
  isSubmitting: boolean
  errorMessage?: string | null
  onChange: (field: keyof BookingFormData, value: string) => void
  onStepChange: (step: number) => void
  onBackToTimes: () => void
  onSubmit: () => void
}) {
  const step = FORM_STEPS[formStep]
  const isLastStep = formStep === FORM_STEPS.length - 1
  const isFirstStep = formStep === 0

  const canContinue = (() => {
    if (!step) return false
    if (step.id === "usesPms") return Boolean(formData.usesPms)
    if (step.id === "propertyCount") return Boolean(formData.propertyCount)
    if (step.id === "revenueRange") return Boolean(formData.revenueRange)
    if (step.id === "contact") {
      return (
        formData.fullName.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
        isValidPhoneNumber(formData.phoneNumber) &&
        isValidOptionalUrl(formData.websiteUrl)
      )
    }
    return false
  })()

  const handleBack = () => {
    if (isFirstStep) {
      onBackToTimes()
      return
    }
    onStepChange(formStep - 1)
  }

  const handleContinue = () => {
    if (!canContinue || isSubmitting) return
    if (isLastStep) {
      onSubmit()
      return
    }
    onStepChange(formStep + 1)
  }

  return (
    <div className="flex min-h-[320px] flex-col lg:min-h-[420px]">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-50"
          aria-label={isFirstStep ? "Volver a horarios" : "Pregunta anterior"}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-500">
            {selectedDateLabel} · {selectedTimeLabel}
          </p>
          <p className="text-[11px] text-zinc-600">
            Paso {formStep + 1} de {FORM_STEPS.length}
          </p>
        </div>
      </div>

      <h3 className="mb-5 text-lg font-semibold leading-snug text-white md:text-xl">
        {step?.question}
      </h3>

      <div className="flex-1 space-y-2.5">
        {step?.id === "usesPms" &&
          PMS_OPTIONS.map((option) => (
            <CalOption
              key={option.value}
              label={option.label}
              selected={formData.usesPms === option.value}
              onSelect={() => onChange("usesPms", option.value)}
            />
          ))}

        {step?.id === "propertyCount" &&
          PROPERTY_OPTIONS.map((option) => (
            <CalOption
              key={option.value}
              label={option.label}
              selected={formData.propertyCount === option.value}
              onSelect={() => onChange("propertyCount", option.value)}
            />
          ))}

        {step?.id === "revenueRange" &&
          REVENUE_OPTIONS.map((option) => (
            <CalOption
              key={option.value}
              label={option.label}
              selected={formData.revenueRange === option.value}
              onSelect={() => onChange("revenueRange", option.value)}
            />
          ))}

        {step?.id === "contact" && (
          <div className="space-y-4">
            <CalInput
              id="booking-name"
              label="Nombre"
              type="text"
              required
              value={formData.fullName}
              placeholder="Tu nombre completo"
              onChange={(value) => onChange("fullName", value)}
            />
            <CalInput
              id="booking-email"
              label="Correo electrónico"
              type="email"
              required
              value={formData.email}
              placeholder="tu@email.com"
              onChange={(value) => onChange("email", value)}
            />
            <CalPhoneInput
              countryCode={formData.phoneCountryCode}
              phoneNumber={formData.phoneNumber}
              onCountryCodeChange={(value) => onChange("phoneCountryCode", value)}
              onPhoneNumberChange={(value) => onChange("phoneNumber", value)}
            />
            <CalInput
              id="booking-company"
              label="Nombre de la empresa"
              type="text"
              optional
              value={formData.companyName}
              placeholder="Tu empresa"
              onChange={(value) => onChange("companyName", value)}
            />
            <CalInput
              id="booking-website"
              label="Página web"
              type="url"
              optional
              value={formData.websiteUrl}
              placeholder="https://tuempresa.com"
              onChange={(value) => onChange("websiteUrl", value)}
            />
            <p className="text-xs leading-relaxed text-zinc-500">
              Enviaremos la invitación de Google Calendar con el enlace de Google Meet a este correo.
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      )}

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || isSubmitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            canContinue && !isSubmitting
              ? "bg-white text-black hover:bg-zinc-200"
              : "cursor-not-allowed bg-zinc-800 text-zinc-500"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirmando...
            </>
          ) : isLastStep ? (
            "Confirmar"
          ) : (
            <>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}