"use client"

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  BookingFormWizard,
  INITIAL_BOOKING_FORM,
  type BookingFormData,
} from "@/components/landing/booking-form-wizard"
import { BOOKING_MONTH, BOOKING_YEAR } from "@/lib/booking/config"
import { getUnbookableDaysInMonth } from "@/lib/booking/rules"
import { filterPastSlots } from "@/lib/booking/slots"
import type { BookingSlot, MonthAvailabilityResponse } from "@/lib/booking/types"
import { scrollToElement } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

const CEO_PHOTO_URL =
  "https://3auasoi81o.ucarecd.net/bb605086-50c5-4a5c-bdc0-cf5cba44620b/IMG_0758.png"

const JULY_2026_WEEKS = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
]

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
      <p className="text-sm text-red-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm text-zinc-400 underline-offset-4 hover:text-white hover:underline"
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
        <span className="text-sm text-zinc-500">{day}</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-label={`Seleccionar ${day} de julio`}
      aria-pressed={isSelected}
      className={cn(
        "flex aspect-square w-full flex-col items-center justify-center rounded-xl transition-colors lg:rounded-lg",
        isSelected
          ? "bg-white text-black"
          : "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700/80"
      )}
    >
      <span className="text-sm font-medium leading-none">{day}</span>
      {isSelected && <span className="mt-0.5 h-1 w-1 rounded-full bg-black" />}
    </button>
  )
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 py-8 text-center lg:min-h-[280px]">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      <p className="text-sm text-zinc-400">{label}</p>
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
  if (slots.length === 0) return <NoSlotsPanel />

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-white">{formatSelectedDate(selectedDay)}</span>
        <div className="flex rounded-lg border border-zinc-700 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onToggleFormat(false)}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              !use24h ? "bg-zinc-700 text-white" : "text-zinc-500"
            )}
          >
            12 h
          </button>
          <button
            type="button"
            onClick={() => onToggleFormat(true)}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              use24h ? "bg-zinc-700 text-white" : "text-zinc-500"
            )}
          >
            24hs
          </button>
        </div>
      </div>

      <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1 [scrollbar-color:rgb(63_63_70)_transparent] [scrollbar-width:thin] lg:max-h-[280px]">
        {slots.map((slot) => (
          <button
            key={slot.start}
            type="button"
            onClick={() => onSelectTime(slot)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
              selectedSlotStart === slot.start
                ? "border-white bg-zinc-800 text-white"
                : "border-zinc-700/80 bg-zinc-900/40 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/60"
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            {use24h ? slot.label24h : slot.label12h}
          </button>
        ))}
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
  onSelectTime,
  onToggleFormat,
  onFormChange,
  onFormStepChange,
  onFormSubmit,
  onBackToTimes,
  onRetry,
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
  onSelectTime: (slot: BookingSlot) => void
  onToggleFormat: (use24h: boolean) => void
  onFormChange: (field: keyof BookingFormData, value: string) => void
  onFormStepChange: (step: number) => void
  onFormSubmit: () => void
  onBackToTimes: () => void
  onRetry?: () => void
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
    return (
      <BookingFormWizard
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
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        ✓
      </div>
      <div>
        <p className="text-sm font-medium text-white">Reunión agendada</p>
        <p className="mt-1 text-xs text-zinc-500">
          {formatSelectedDate(selectedDay)} · {selectedTimeLabel}
        </p>
      </div>
      <p className="max-w-xs text-sm text-zinc-400">
        Enviamos la invitación de Google Calendar a{" "}
        <span className="text-zinc-300">{attendeeEmail}</span> con el enlace de Google Meet.
      </p>
      {meetLink && (
        <a
          href={meetLink}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline"
        >
          Abrir videollamada
        </a>
      )}
    </div>
  )
}

export function BookingWidget() {
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
      setFormData(INITIAL_BOOKING_FORM)
      setFormStep(0)
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
      clearLoadTimeout()
      setSelectedSlotStart(slot.start)
      setSelectedTimeLabel(use24h ? slot.label24h : slot.label12h)
      setFormStep(0)
      setFormData(INITIAL_BOOKING_FORM)
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

  const handleFormChange = useCallback((field: keyof BookingFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }, [])

  const handleFormSubmit = useCallback(async () => {
    if (!selectedDay || !selectedSlotStart) return

    setStep("submitting")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: toBookingDate(selectedDay),
          slotStart: selectedSlotStart,
          ...formData,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? "No se pudo confirmar la reunión")
      }

      const result = (await response.json()) as { meetLink?: string }
      setMeetLink(result.meetLink ?? null)
      setStep("submitted")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo confirmar la reunión")
      setStep("form")
    }
  }, [formData, selectedDay, selectedSlotStart])

  const isFormActive = step === "form" || step === "submitting" || step === "submitted"
  const showMobilePanel = selectedDay !== null

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111] md:rounded-2xl">
      <div
        className={cn(
          "grid grid-cols-1",
          isFormActive
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
            : "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.85fr)]"
        )}
      >
        <div className="border-b border-zinc-800 p-4 md:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center gap-2.5 md:mb-4">
            <Image
              src={CEO_PHOTO_URL}
              alt="Santiago Varón"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm text-zinc-400">Santiago Varón - CEO Agent Pilot</span>
          </div>

          <h3 className="mb-3 text-lg font-semibold leading-snug text-white md:mb-4 md:text-2xl">
            Podemos ayudarte
          </h3>

          <div className="mb-5 max-h-[112px] overflow-y-auto pr-2 text-sm leading-relaxed text-zinc-400 [scrollbar-color:rgb(63_63_70)_transparent] [scrollbar-width:thin] md:mb-6 md:max-h-[140px]">
            <p>
              Agenda una reunión con nosotros para conocer más sobre nuestro sistema y cómo podemos
              implementarlo en tu operación.
            </p>
          </div>

          <div className="space-y-2.5 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>30m</span>
            </div>
            <div className="flex items-center gap-2">
              <GoogleMeetIcon className="h-4 w-4 shrink-0" />
              <span>Google Meet</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <span>America/Bogota</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "p-4 md:p-6 lg:border-r lg:border-zinc-800",
            isFormActive && "hidden",
            showMobilePanel && !isFormActive && "border-b border-zinc-800 lg:border-b-0"
          )}
        >
          <div className="mb-4 flex items-center justify-between md:mb-5">
            <span className="text-sm font-medium text-white">julio 2026</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center text-zinc-400"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center text-zinc-400"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            {isLoadingCalendar && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-[#111111]/85">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                <p className="text-xs text-zinc-400">Consultando disponibilidad...</p>
              </div>
            )}

            {calendarError && !isLoadingCalendar && (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2">
                <p className="text-xs text-red-400">{calendarError}</p>
                <button
                  type="button"
                  onClick={loadMonthAvailability}
                  className="shrink-0 text-xs text-zinc-400 underline-offset-4 hover:text-white hover:underline"
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
              {JULY_2026_WEEKS.map((week, weekIndex) => (
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
            attendeeEmail={formData.email}
            meetLink={meetLink}
            onSelectTime={handleSelectTime}
            onToggleFormat={setUse24h}
            onFormChange={handleFormChange}
            onFormStepChange={setFormStep}
            onFormSubmit={handleFormSubmit}
            onBackToTimes={handleBackToTimes}
            onRetry={selectedDay ? () => handleSelectDay(selectedDay) : undefined}
          />
        </div>

        {showMobilePanel && (
          <div
            ref={mobileTimesPanelRef}
            id="booking-times"
            className={cn(
              "scroll-mt-6 border-t border-zinc-800 p-4 lg:hidden",
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
              attendeeEmail={formData.email}
              meetLink={meetLink}
              onSelectTime={handleSelectTime}
              onToggleFormat={setUse24h}
              onFormChange={handleFormChange}
              onFormStepChange={setFormStep}
              onFormSubmit={handleFormSubmit}
              onBackToTimes={handleBackToTimes}
              onRetry={selectedDay ? () => handleSelectDay(selectedDay) : undefined}
            />
          </div>
        )}
      </div>
    </div>
  )
}
