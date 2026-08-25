"use client"

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import {
  BOOKING_FORM_STEPS,
  INDUSTRY_TIME_OPTIONS,
  INITIAL_BOOKING_FORM,
  isValidOptionalUrl,
  PMS_OPTIONS,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/booking/form-options"
import {
  isValidPhoneNumber,
  PHONE_COUNTRY_OPTIONS,
} from "@/lib/booking/phone-countries"
import type { BookingFormData } from "@/lib/booking/types"
import { cn } from "@/lib/utils"

export type { BookingFormData }
export { INITIAL_BOOKING_FORM }

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
          ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
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
  onBlur,
}: {
  id: string
  label: string
  type: string
  value: string
  placeholder: string
  required?: boolean
  optional?: boolean
  onChange: (value: string) => void
  onBlur?: () => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {optional && <span className="text-zinc-500"> (opcional)</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />
    </div>
  )
}

function CalPhoneInput({
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
      <label htmlFor="booking-phone" className="mb-2 block text-sm font-medium text-zinc-700">
        Teléfono<span className="text-red-500"> *</span>
      </label>
      <div className="flex gap-2">
        <select
          id="booking-phone-country"
          value={countryCode}
          onChange={(event) => onCountryCodeChange(event.target.value)}
          aria-label="Código de país"
          className="w-[140px] shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
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
          onBlur={onBlur}
          placeholder="300 123 4567"
          className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>
    </div>
  )
}

function stepIsComplete(stepId: (typeof BOOKING_FORM_STEPS)[number]["id"], formData: BookingFormData) {
  if (stepId === "usesPms") return Boolean(formData.usesPms)
  if (stepId === "propertyCount") return Boolean(formData.propertyCount)
  if (stepId === "revenueRange") return Boolean(formData.revenueRange)
  if (stepId === "isTodero") return Boolean(formData.isTodero)
  if (stepId === "wantsToScale") return Boolean(formData.wantsToScale)
  if (stepId === "usesAi") return Boolean(formData.usesAi)
  if (stepId === "industryTime") return Boolean(formData.industryTime)
  if (stepId === "contact") {
    return (
      formData.fullName.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
      isValidPhoneNumber(formData.phoneNumber) &&
      isValidOptionalUrl(formData.websiteUrl)
    )
  }
  return false
}

export function BookingFormWizardLight({
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
  onFieldBlur,
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
  onFieldBlur?: () => void
}) {
  const step = BOOKING_FORM_STEPS[formStep]
  const isLastStep = formStep === BOOKING_FORM_STEPS.length - 1
  const isFirstStep = formStep === 0
  const canContinue = step ? stepIsComplete(step.id, formData) : false

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
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
          aria-label={isFirstStep ? "Volver a horarios" : "Pregunta anterior"}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-500">
            {selectedDateLabel} · {selectedTimeLabel}
          </p>
          <p className="text-[11px] text-zinc-400">
            Paso {formStep + 1} de {BOOKING_FORM_STEPS.length}
          </p>
        </div>
      </div>

      <h3 className="mb-5 text-lg font-semibold leading-snug text-zinc-900 md:text-xl">
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

        {step?.id === "isTodero" &&
          YES_NO_OPTIONS.map((option) => (
            <CalOption
              key={option.value}
              label={option.label}
              selected={formData.isTodero === option.value}
              onSelect={() => onChange("isTodero", option.value)}
            />
          ))}

        {step?.id === "wantsToScale" &&
          YES_NO_OPTIONS.map((option) => (
            <CalOption
              key={option.value}
              label={option.label}
              selected={formData.wantsToScale === option.value}
              onSelect={() => onChange("wantsToScale", option.value)}
            />
          ))}

        {step?.id === "usesAi" &&
          YES_NO_OPTIONS.map((option) => (
            <CalOption
              key={option.value}
              label={option.label}
              selected={formData.usesAi === option.value}
              onSelect={() => onChange("usesAi", option.value)}
            />
          ))}

        {step?.id === "industryTime" &&
          INDUSTRY_TIME_OPTIONS.map((option) => (
            <CalOption
              key={option.value}
              label={option.label}
              selected={formData.industryTime === option.value}
              onSelect={() => onChange("industryTime", option.value)}
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
              onBlur={onFieldBlur}
            />
            <CalInput
              id="booking-email"
              label="Correo electrónico"
              type="email"
              required
              value={formData.email}
              placeholder="tu@email.com"
              onChange={(value) => onChange("email", value)}
              onBlur={onFieldBlur}
            />
            <CalPhoneInput
              countryCode={formData.phoneCountryCode}
              phoneNumber={formData.phoneNumber}
              onCountryCodeChange={(value) => onChange("phoneCountryCode", value)}
              onPhoneNumberChange={(value) => onChange("phoneNumber", value)}
              onBlur={onFieldBlur}
            />
            <CalInput
              id="booking-company"
              label="Nombre de la empresa"
              type="text"
              optional
              value={formData.companyName}
              placeholder="Tu empresa"
              onChange={(value) => onChange("companyName", value)}
              onBlur={onFieldBlur}
            />
            <CalInput
              id="booking-instagram"
              label="Instagram"
              type="text"
              optional
              value={formData.instagramUrl}
              placeholder="@tuempresa"
              onChange={(value) => onChange("instagramUrl", value)}
              onBlur={onFieldBlur}
            />
            <CalInput
              id="booking-website"
              label="Página web"
              type="url"
              optional
              value={formData.websiteUrl}
              placeholder="https://tuempresa.com"
              onChange={(value) => onChange("websiteUrl", value)}
              onBlur={onFieldBlur}
            />
            <p className="text-xs leading-relaxed text-zinc-500">
              Enviaremos la invitación de Google Calendar con el enlace de Google Meet a este correo.
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
      )}

      <div className="mt-6 border-t border-zinc-200 pt-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || isSubmitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            canContinue && !isSubmitting
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "cursor-not-allowed bg-zinc-100 text-zinc-400"
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
