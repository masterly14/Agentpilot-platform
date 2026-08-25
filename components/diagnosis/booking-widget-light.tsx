"use client"

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Info,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  BookingFormWizardLight,
  INITIAL_BOOKING_FORM,
  type BookingFormData,
} from "./booking-form-wizard-light"
import { DIAGNOSIS_BOOKING } from "./content"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { usePartialSubmission } from "@/hooks/use-partial-submission"
import { BOOKING_MONTH, BOOKING_YEAR, bookingConfig, bookingMonthLabel, bookingMonthName } from "@/lib/booking/config"
import { getUnbookableDaysInMonth } from "@/lib/booking/rules"
import { applyLiveSlotRules, filterPastSlots } from "@/lib/booking/slots"
import type { BookingSlot, MonthAvailabilityResponse } from "@/lib/booking/types"
import { trackSchedule } from "@/lib/facebook-pixel"
import { collectAttribution } from "@/lib/marketing/attribution-client"
import { scrollToElement } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

const CEO_PHOTO_URL =
  "https://3auasoi81o.ucarecd.net/bb605086-50c5-4a5c-bdc0-cf5cba44620b/IMG_0758.png"

function buildMonthWeeks(year: number, month: number) {
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: Array<Array<number | null>> = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }
  return weeks
}

const MONTH_WEEKS = buildMonthWeeks(BOOKING_YEAR, BOOKING_MONTH)

const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]
const DAY_NAMES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]

type BookingStep =
  | "idle"
  | "loading-times"
  | "times"
  | "form"
  | "submitting"
  | "submitted"
  | "error"

function toBookingDate(day: number) {
  return `${BOOKING_YEAR}-${String(BOOKING_MONTH).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function getFallbackUnavailableDays() {
  return getUnbookableDaysInMonth(BOOKING_YEAR, BOOKING_MONTH)
}

function BookingRecommendations() {
  const [open, setOpen] = useState(false)
  const [first, ...rest] = DIAGNOSIS_BOOKING.recommendations

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-zinc-200">
      <div className="px-4 pt-3.5 md:px-6">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
            <Info className="h-3.5 w-3.5 text-cyan-600" />
          </span>
          <span className="text-sm font-medium text-zinc-800">
            {DIAGNOSIS_BOOKING.recommendationsTitle}
          </span>
        </div>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-medium text-cyan-700">
              1
            </span>
            <p className="text-xs leading-relaxed text-zinc-600 md:text-sm">{first}</p>
          </li>
        </ol>
      </div>
      <CollapsibleContent>
        <ol className="space-y-3 px-4 pt-3 md:px-6" start={2}>
          {rest.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-medium text-cyan-700">
                {index + 2}
              </span>
              <p className="text-xs leading-relaxed text-zinc-600 md:text-sm">{item}</p>
            </li>
          ))}
        </ol>
      </CollapsibleContent>
      <CollapsibleTrigger className="group flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800 md:px-6">
        {open ? "Ocultar recomendaciones" : `Ver ${rest.length} recomendaciones más`}
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
    </Collapsible>
  )
}

function GoogleMeetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#00832D"
        d="M12 10.9c-.7 0-1.3.6-1.3 1.3s.6 1.3 1.3 1.3 1.3-.6 1.3-1.3-.6-1.3-1.3-1.3z"
      />
      <path
        fill="#0066DA"
        d="M19.6 8.5h-3.1V6.4c0-.5-.4-.9-.9-.9H4.3c-.5 0-.9.4-.9.9v11.2c0 .5.4.9.9.9h11.3c.5 0 .9-.4.9-.9v-2.1h3.1c.5 0 .9-.4.9-.9V9.4c0-.5-.4-.9-.9-.9z"
      />
      <path fill="#EA4335" d="M19.6 8.5L16.5 11.6l3.1 3.1V8.5z" />
      <path fill="#FFBA00" d="M16.5 11.6L19.6 8.5h-3.1v3.1z" />
      <path fill="#00AC47" d="M16.5 11.6v3.1h3.1l-3.1-3.1z" />
    </svg>
  )
}

function formatSelectedDate(day: number) {
  const date = new Date(BOOKING_YEAR, BOOKING_MONTH - 1, day)
  return `${DAY_NAMES[date.getDay()]} ${String(day).padStart(2, "0")}`
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-8 text-center lg:min-h-[280px]">
      <p className="text-sm text-red-500">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

function NoSlotsPanel() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-4 py-8 text-center lg:min-h-[280px]">
      <p className="text-sm text-zinc-500">No hay horarios disponibles para este día.</p>
    </div>
  )
}

function CalendarDay({
  day,
  isSelected,
  isUnavailable,
  isDisabled,
  onSelect,
}: {
  day: number | null
  isSelected: boolean
  isUnavailable: boolean
  isDisabled?: boolean
  onSelect: (day: number) => void
}) {
  if (day === null) {
    return <div className="aspect-square w-full" aria-hidden="true" />
  }

  if (isUnavailable || isDisabled) {
    return (
      <div className="flex aspect-square w-full items-center justify-center">
        <span className="text-sm text-zinc-400">{day}</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-label={`Seleccionar ${day} de ${bookingMonthName()}`}
      aria-pressed={isSelected}
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center rounded-xl transition-colors lg:rounded-lg",
        isSelected
          ? "bg-zinc-900 text-white"
          : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
      )}
    >
      <span className="text-sm font-medium leading-none">{day}</span>
      {isSelected && <span className="mt-0.5 h-1 w-1 rounded-full bg-white" />}
    </button>
  )
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 py-8 text-center lg:min-h-[280px]">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  )
}

function EmptyPanel() {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-4 py-8 text-center lg:min-h-[280px]">
      <p className="text-sm text-zinc-500">Selecciona una fecha para ver los horarios disponibles</p>
    </div>
  )
}

function TimeSlotsPanel({
  selectedDay,
  selectedSlotStart,
  use24h,
  slots,
  onSelectTime,
  onToggleFormat,
}: {
  selectedDay: number
  selectedSlotStart: string | null
  use24h: boolean
  slots: BookingSlot[]
  onSelectTime: (slot: BookingSlot) => void
  onToggleFormat: (use24h: boolean) => void
}) {
  const visibleSlots = applyLiveSlotRules(slots)
  if (visibleSlots.length === 0) return <NoSlotsPanel />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-900">{formatSelectedDate(selectedDay)}</span>
        <div className="flex rounded-lg border border-zinc-200 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onToggleFormat(false)}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              !use24h ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            12 h
          </button>
          <button
            type="button"
            onClick={() => onToggleFormat(true)}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              use24h ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            24hs
          </button>
        </div>
      </div>

      <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1 [scrollbar-color:rgb(228_228_231)_transparent] [scrollbar-width:thin] lg:max-h-[280px]">
        {visibleSlots.map((slot) => {
          const label = use24h ? slot.label24h : slot.label12h

          if (!slot.available) {
            return (
              <div
                key={slot.start}
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-400"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-300" />
                <span className="line-through decoration-zinc-300">{label}</span>
                <span className="ml-auto text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                  Lleno
                </span>
              </div>
            )
          }

          return (
            <button
              key={slot.start}
              type="button"
              onClick={() => onSelectTime(slot)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                selectedSlotStart === slot.start
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              )}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              {label}
            </button>
          )
        })}
      </div>
    </>
  )
}

function BookingSidePanel({
  step,
  selectedDay,
  selectedSlotStart,
  selectedTimeLabel,
  use24h,
  timeSlots,
  formData,
  formStep,
  errorMessage,
  attendeeEmail,
  meetLink,
  leadMode,
  onSelectTime,
  onToggleFormat,
  onFormChange,
  onFormStepChange,
  onFormSubmit,
  onBackToTimes,
  onRetry,
  onFieldBlur,
}: {
  step: BookingStep
  selectedDay: number | null
  selectedSlotStart: string | null
  selectedTimeLabel: string | null
  use24h: boolean
  timeSlots: BookingSlot[]
  formData: BookingFormData
  formStep: number
  errorMessage: string | null
  attendeeEmail: string
  meetLink: string | null
  leadMode?: { name: string; email: string }
  onSelectTime: (slot: BookingSlot) => void
  onToggleFormat: (use24h: boolean) => void
  onFormChange: (field: keyof BookingFormData, value: string) => void
  onFormStepChange: (step: number) => void
  onFormSubmit: () => void
  onBackToTimes: () => void
  onRetry?: () => void
  onFieldBlur?: () => void
}) {
  if (!selectedDay) return <EmptyPanel />
  if (step === "loading-times") return <LoadingPanel label="Cargando horarios disponibles..." />
  if (step === "error") return <ErrorPanel message={errorMessage ?? "Ocurrió un error"} onRetry={onRetry} />
  if (step === "times")
    return (
      <TimeSlotsPanel
        selectedDay={selectedDay}
        selectedSlotStart={selectedSlotStart}
        use24h={use24h}
        slots={timeSlots}
        onSelectTime={onSelectTime}
        onToggleFormat={onToggleFormat}
      />
    )
  if ((step === "form" || step === "submitting") && selectedTimeLabel)
    return leadMode ? (
      <LeadConfirmPanel
        selectedDateLabel={formatSelectedDate(selectedDay)}
        selectedTimeLabel={selectedTimeLabel}
        leadName={leadMode.name}
        leadEmail={leadMode.email}
        isSubmitting={step === "submitting"}
        errorMessage={errorMessage}
        onBackToTimes={onBackToTimes}
        onSubmit={onFormSubmit}
      />
    ) : (
      <BookingFormWizardLight
        selectedDateLabel={formatSelectedDate(selectedDay)}
        selectedTimeLabel={selectedTimeLabel}
        formData={formData}
        formStep={formStep}
        isSubmitting={step === "submitting"}
        errorMessage={errorMessage}
        onChange={onFormChange}
        onStepChange={onFormStepChange}
        onBackToTimes={onBackToTimes}
        onSubmit={onFormSubmit}
        onFieldBlur={onFieldBlur}
      />
    )
  if (step === "submitted" && selectedTimeLabel)
    return (
      <SuccessPanel
        selectedDay={selectedDay}
        selectedTimeLabel={selectedTimeLabel}
        attendeeEmail={attendeeEmail}
        meetLink={meetLink}
      />
    )

  return <EmptyPanel />
}

function SuccessPanel({
  selectedDay,
  selectedTimeLabel,
  attendeeEmail,
  meetLink,
}: {
  selectedDay: number
  selectedTimeLabel: string
  attendeeEmail: string
  meetLink?: string | null
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-8 text-center lg:min-h-[280px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        ✓
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-900">Reunión agendada</p>
        <p className="mt-1 text-xs text-zinc-500">
          {formatSelectedDate(selectedDay)} · {selectedTimeLabel}
        </p>
      </div>
      <p className="max-w-xs text-sm text-zinc-600">
        Enviamos la invitación de Google Calendar a{" "}
        <span className="font-medium text-zinc-900">{attendeeEmail}</span> con el enlace de Google Meet.
      </p>
      {meetLink && (
        <a
          href={meetLink}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-indigo-600 underline-offset-4 hover:text-indigo-700 hover:underline"
        >
          Abrir videollamada
        </a>
      )}
    </div>
  )
}

function LeadConfirmPanel({
  selectedDateLabel,
  selectedTimeLabel,
  leadName,
  leadEmail,
  isSubmitting,
  errorMessage,
  onBackToTimes,
  onSubmit,
}: {
  selectedDateLabel: string
  selectedTimeLabel: string
  leadName: string
  leadEmail: string
  isSubmitting: boolean
  errorMessage?: string | null
  onBackToTimes: () => void
  onSubmit: () => void
}) {
  return (
    <div className="flex min-h-[320px] flex-col lg:min-h-[420px]">
      <button
        type="button"
        onClick={onBackToTimes}
        disabled={isSubmitting}
        className="mb-5 self-start text-xs text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-50"
      >
        ← Volver a horarios
      </button>
      <h3 className="mb-2 text-lg font-semibold leading-snug text-zinc-900 md:text-xl">
        Confirma tu diagnóstico
      </h3>
      <p className="mb-6 text-sm text-zinc-500">
        {selectedDateLabel} · {selectedTimeLabel}
      </p>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
        <p className="font-medium text-zinc-900">{leadName}</p>
        <p className="mt-1 text-zinc-500">{leadEmail}</p>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        Usaremos los datos de la guía. La invitación de Google Meet llega a este correo.
      </p>
      {errorMessage ? <p className="mt-4 text-sm text-red-500">{errorMessage}</p> : null}
      <div className="mt-auto border-t border-zinc-200 pt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            isSubmitting
              ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirmando...
            </>
          ) : (
            "Confirmar reunión"
          )}
        </button>
      </div>
    </div>
  )
}

export function BookingWidgetLight({
  leadToken,
  leadName,
  leadEmail,
}: {
  leadToken?: string
  leadName?: string
  leadEmail?: string
} = {}) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlotStart, setSelectedSlotStart] = useState<string | null>(null)
  const [selectedTimeLabel, setSelectedTimeLabel] = useState<string | null>(null)
  const [step, setStep] = useState<BookingStep>("idle")
  const [timeSlots, setTimeSlots] = useState<BookingSlot[]>([])
  const [slotsByDate, setSlotsByDate] = useState<Record<string, BookingSlot[]>>({})
  const [unavailableDays, setUnavailableDays] = useState<Set<number>>(new Set())
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true)
  const [calendarError, setCalendarError] = useState<string | null>(null)
  const [use24h, setUse24h] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_BOOKING_FORM)
  const [formStep, setFormStep] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [meetLink, setMeetLink] = useState<string | null>(null)
  const loadTimeoutRef = useRef<number | null>(null)
  const mobileTimesPanelRef = useRef<HTMLDivElement>(null)
  const existingLead = Boolean(leadToken)
  const { getToken, sync, flush, clear } = usePartialSubmission({
    entrySource: "DIAGNOSIS",
    bookingFlow: "DIAGNOSIS_PUBLIC",
    enabled: !existingLead,
  })

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearLoadTimeout, [clearLoadTimeout])

  const loadMonthAvailability = useCallback(async () => {
    setIsLoadingCalendar(true)
    setCalendarError(null)

    try {
      const response = await fetch(`/api/booking/month?year=${BOOKING_YEAR}&month=${BOOKING_MONTH}`)
      if (!response.ok) throw new Error("No se pudo cargar el calendario")

      const data = (await response.json()) as MonthAvailabilityResponse
      setUnavailableDays(new Set(data.unavailableDays))
      setSlotsByDate(data.slotsByDate ?? {})
    } catch (error) {
      console.error(error)
      setCalendarError(
        error instanceof Error ? error.message : "No se pudo consultar la disponibilidad"
      )
      setUnavailableDays(new Set(getFallbackUnavailableDays()))
      setSlotsByDate({})
    } finally {
      setIsLoadingCalendar(false)
    }
  }, [])

  useEffect(() => {
    loadMonthAvailability()
  }, [loadMonthAvailability])

  useEffect(() => {
    if (selectedDay === null) return
    if (!window.matchMedia("(max-width: 1023px)").matches) return

    requestAnimationFrame(() => {
      if (mobileTimesPanelRef.current) {
        scrollToElement(mobileTimesPanelRef.current, 700)
      }
    })
  }, [selectedDay])

  const handleSelectDay = useCallback(
    async (day: number) => {
      if (isLoadingCalendar || unavailableDays.has(day)) return

      clearLoadTimeout()
      setSelectedDay(day)
      setSelectedSlotStart(null)
      setSelectedTimeLabel(null)
      setMeetLink(null)
      setErrorMessage(null)
      setStep("loading-times")

      const dateKey = toBookingDate(day)

      try {
        const response = await fetch(`/api/booking/availability?date=${dateKey}`)
        if (!response.ok) throw new Error("No se pudieron cargar los horarios")

        const data = (await response.json()) as { slots: BookingSlot[] }
        const slots = filterPastSlots(dateKey, data.slots)
        setTimeSlots(slots)
        setSlotsByDate((current) => ({ ...current, [dateKey]: slots }))
        setStep("times")
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar los horarios")
        setStep("error")
      }
    },
    [clearLoadTimeout, isLoadingCalendar, unavailableDays]
  )

  const handleSelectTime = useCallback(
    (slot: BookingSlot) => {
      if (!slot.available) return
      clearLoadTimeout()
      setSelectedSlotStart(slot.start)
      setSelectedTimeLabel(use24h ? slot.label24h : slot.label12h)
      setErrorMessage(null)
      setStep("form")
    },
    [clearLoadTimeout, use24h]
  )

  const handleBackToTimes = useCallback(() => {
    clearLoadTimeout()
    setSelectedSlotStart(null)
    setSelectedTimeLabel(null)
    setFormStep(0)
    setErrorMessage(null)
    setStep("times")
  }, [clearLoadTimeout])

  const handleFormChange = useCallback(
    (field: keyof BookingFormData, value: string) => {
      const next = { ...formData, [field]: value }
      setFormData(next)
      sync(next, field)
    },
    [formData, sync]
  )

  const handleFormSubmit = useCallback(async () => {
    if (!selectedDay || !selectedSlotStart) return

    setStep("submitting")
    setErrorMessage(null)

    try {
      await flush()
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          leadToken
            ? {
                date: toBookingDate(selectedDay),
                slotStart: selectedSlotStart,
                leadToken,
                bookingFlow: "EBOOK_SQL",
                attribution: collectAttribution(),
              }
            : {
                date: toBookingDate(selectedDay),
                slotStart: selectedSlotStart,
                ...formData,
                bookingFlow: "DIAGNOSIS_PUBLIC",
                leadToken: getToken() || undefined,
                attribution: collectAttribution(),
              }
        ),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? "No se pudo confirmar la reunión")
      }

      const result = (await response.json()) as { meetLink?: string; marketingEventId?: string | null }
      setMeetLink(result.meetLink ?? null)
      if (result.marketingEventId) {
        trackSchedule({
          email: leadEmail || formData.email,
          fullName: leadName || formData.fullName,
          eventID: result.marketingEventId,
        })
      }
      clear()
      setStep("submitted")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo confirmar la reunión")
      setStep("form")
    }
  }, [clear, flush, formData, getToken, leadEmail, leadName, leadToken, selectedDay, selectedSlotStart])

  const isFormActive = step === "form" || step === "submitting" || step === "submitted"
  const showMobilePanel = selectedDay !== null
  const leadMode = leadToken && leadName && leadEmail ? { name: leadName, email: leadEmail } : undefined
  const attendeeEmail = leadEmail || formData.email

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-[0_40px_120px_-40px_rgba(6,182,212,0.35)]">
      <BookingRecommendations />
      <div
        className={cn(
          "grid grid-cols-1",
          isFormActive
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
            : "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.85fr)]"
        )}
      >
        <div className="border-b border-zinc-200 p-4 md:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center gap-2.5 md:mb-4">
            <Image
              src={CEO_PHOTO_URL}
              alt="Santiago Varón"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm text-zinc-600">Santiago Varón - CEO Agent Pilot</span>
          </div>

          <h3 className="mb-3 text-lg font-semibold leading-snug text-zinc-900 md:mb-4 md:text-2xl">
            {leadMode ? "Tu diagnóstico de IA" : "Diagnóstico gratuito"}
          </h3>

          <div className="mb-5 max-h-[112px] overflow-y-auto pr-2 text-sm leading-relaxed text-zinc-600 [scrollbar-color:rgb(228_228_231)_transparent] [scrollbar-width:thin] md:mb-6 md:max-h-[140px]">
            <p>
              {leadMode
                ? "Cumples los criterios. Elige fecha y hora; usaremos los datos de la guía y te llegará la invitación de Google Meet."
                : "Agenda una reunión para analizar tu operación y ver si tiene sentido implementar el sistema en tu negocio."}
            </p>
          </div>

          <div className="space-y-2.5 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{bookingConfig.slotMinutes}m</span>
            </div>
            <div className="flex items-center gap-2">
              <GoogleMeetIcon className="h-4 w-4 shrink-0" />
              <span>Google Meet</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <span>America/Bogota</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "p-4 md:p-6 lg:border-r lg:border-zinc-200",
            isFormActive && "hidden",
            showMobilePanel && !isFormActive && "border-b border-zinc-200 lg:border-b-0"
          )}
        >
          <div className="mb-4 flex items-center justify-between md:mb-5">
            <span className="text-sm font-medium text-zinc-900">{bookingMonthLabel()}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-zinc-900"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-zinc-900"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            {isLoadingCalendar && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/85">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                <p className="text-xs text-zinc-500">Consultando disponibilidad...</p>
              </div>
            )}

            {calendarError && !isLoadingCalendar && (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs text-red-600">{calendarError}</p>
                <button
                  type="button"
                  onClick={loadMonthAvailability}
                  className="shrink-0 text-xs text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
                >
                  Reintentar
                </button>
              </div>
            )}

            <div className="mb-2 grid grid-cols-7 gap-1.5 md:gap-1">
              {DAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-center py-1 text-[10px] font-medium tracking-wide text-zinc-500 md:text-[11px]"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="space-y-1.5 md:space-y-1">
              {MONTH_WEEKS.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1.5 md:gap-1">
                  {week.map((day, dayIndex) => (
                    <CalendarDay
                      key={`${weekIndex}-${dayIndex}`}
                      day={day}
                      isSelected={day === selectedDay}
                      isUnavailable={day !== null && unavailableDays.has(day)}
                      isDisabled={isLoadingCalendar}
                      onSelect={handleSelectDay}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "hidden p-6 lg:block",
            isFormActive ? "lg:col-span-1" : ""
          )}
        >
          <BookingSidePanel
            step={step}
            selectedDay={selectedDay}
            selectedSlotStart={selectedSlotStart}
            selectedTimeLabel={selectedTimeLabel}
            use24h={use24h}
            timeSlots={timeSlots}
            formData={formData}
            formStep={formStep}
            errorMessage={errorMessage}
            attendeeEmail={attendeeEmail}
            meetLink={meetLink}
            leadMode={leadMode}
            onSelectTime={handleSelectTime}
            onToggleFormat={setUse24h}
            onFormChange={handleFormChange}
            onFormStepChange={setFormStep}
            onFormSubmit={handleFormSubmit}
            onBackToTimes={handleBackToTimes}
            onRetry={selectedDay ? () => handleSelectDay(selectedDay) : undefined}
            onFieldBlur={() => {
              void flush()
            }}
          />
        </div>

        {showMobilePanel && (
          <div
            ref={mobileTimesPanelRef}
            id="booking-times"
            className={cn(
              "scroll-mt-6 border-t border-zinc-200 p-4 lg:hidden",
              isFormActive && "border-t-0"
            )}
          >
            <BookingSidePanel
              step={step}
              selectedDay={selectedDay}
              selectedSlotStart={selectedSlotStart}
              selectedTimeLabel={selectedTimeLabel}
              use24h={use24h}
              timeSlots={timeSlots}
              formData={formData}
              formStep={formStep}
              errorMessage={errorMessage}
              attendeeEmail={attendeeEmail}
              meetLink={meetLink}
              leadMode={leadMode}
              onSelectTime={handleSelectTime}
              onToggleFormat={setUse24h}
              onFormChange={handleFormChange}
              onFormStepChange={setFormStep}
              onFormSubmit={handleFormSubmit}
              onBackToTimes={handleBackToTimes}
              onRetry={selectedDay ? () => handleSelectDay(selectedDay) : undefined}
              onFieldBlur={() => {
                void flush()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
