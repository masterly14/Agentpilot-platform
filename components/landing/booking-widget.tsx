"use client"

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  BookingFormWizard,
  INITIAL_BOOKING_FORM,
  type BookingFormData,
} from "@/components/landing/booking-form-wizard"
import { BookingTimezonePicker } from "@/components/booking/timezone-picker"
import { usePartialSubmission } from "@/hooks/use-partial-submission"
import { useVisitorTimezone } from "@/hooks/use-visitor-timezone"
import {
  addBookingMonths,
  BOOKING_MONTH,
  BOOKING_YEAR,
  bookingConfig,
  bookingMonthLabel,
  bookingMonthName,
  toBookingDate,
} from "@/lib/booking/config"
import { getCurrentBookingYearMonth, getUnbookableDaysInMonth, isMonthInBookingWindow } from "@/lib/booking/rules"
import { applyLiveSlotRules, filterPastSlots } from "@/lib/booking/slots"
import {
  formatSlotDateLabel,
  formatSlotTimeLabel,
  slotLocalDateDiffers,
} from "@/lib/booking/timezone"
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

function getFallbackUnavailableDays(year: number, month: number) {
  return getUnbookableDaysInMonth(year, month)
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

function formatSelectedDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day)
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
  monthName,
  isSelected,
  isUnavailable,
  isDisabled,
  onSelect,
}: {
  day: number | null
  monthName: string
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
      aria-label={`Seleccionar ${day} de ${monthName}`}
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
  viewYear,
  viewMonth,
  selectedSlotStart,
  use24h,
  timeZone,
  slots,
  onSelectTime,
  onToggleFormat,
}: {
  selectedDay: number
  viewYear: number
  viewMonth: number
  selectedSlotStart: string | null
  use24h: boolean
  timeZone: string
  slots: BookingSlot[]
  onSelectTime: (slot: BookingSlot) => void
  onToggleFormat: (use24h: boolean) => void
}) {
  const visibleSlots = applyLiveSlotRules(slots)
  if (visibleSlots.length === 0) return <NoSlotsPanel />
  const calendarDate = toBookingDate(viewYear, viewMonth, selectedDay)

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-white">{formatSelectedDate(viewYear, viewMonth, selectedDay)}</span>
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
        {visibleSlots.map((slot) => {
          const label = formatSlotTimeLabel(slot.start, timeZone, use24h)
          const dateHint = slotLocalDateDiffers(slot.start, calendarDate, timeZone)
            ? ` · ${formatSlotDateLabel(slot.start, timeZone)}`
            : ""

          if (!slot.available) {
            return (
              <div
                key={slot.start}
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2.5 text-sm text-zinc-500"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-600" />
                <span className="line-through decoration-zinc-600">
                  {label}
                  {dateHint}
                </span>
                <span className="ml-auto text-[11px] font-medium uppercase tracking-wide text-zinc-600">
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
                  ? "border-white bg-zinc-800 text-white"
                  : "border-zinc-700/80 bg-zinc-900/40 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/60"
              )}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              {label}
              {dateHint}
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
  viewYear,
  viewMonth,
  selectedSlotStart,
  selectedDateLabel,
  selectedTimeLabel,
  hostTimeHint,
  use24h,
  timeZone,
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
  viewYear: number
  viewMonth: number
  selectedSlotStart: string | null
  selectedDateLabel: string | null
  selectedTimeLabel: string | null
  hostTimeHint: string | null
  use24h: boolean
  timeZone: string
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
        viewYear={viewYear}
        viewMonth={viewMonth}
        selectedSlotStart={selectedSlotStart}
        use24h={use24h}
        timeZone={timeZone}
        slots={timeSlots}
        onSelectTime={onSelectTime}
        onToggleFormat={onToggleFormat}
      />
    )
  if ((step === "form" || step === "submitting") && selectedDateLabel && selectedTimeLabel)
    return leadMode ? (
      <LeadConfirmPanel
        selectedDateLabel={selectedDateLabel}
        selectedTimeLabel={selectedTimeLabel}
        hostTimeHint={hostTimeHint}
        leadName={leadMode.name}
        leadEmail={leadMode.email}
        isSubmitting={step === "submitting"}
        errorMessage={errorMessage}
        onBackToTimes={onBackToTimes}
        onSubmit={onFormSubmit}
      />
    ) : (
      <BookingFormWizard
        selectedDateLabel={selectedDateLabel}
        selectedTimeLabel={selectedTimeLabel}
        hostTimeHint={hostTimeHint}
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
  if (step === "submitted" && selectedDateLabel && selectedTimeLabel)
    return (
      <SuccessPanel
        selectedDateLabel={selectedDateLabel}
        selectedTimeLabel={selectedTimeLabel}
        hostTimeHint={hostTimeHint}
        attendeeEmail={attendeeEmail}
        meetLink={meetLink}
      />
    )

  return <EmptyPanel />
}

function SuccessPanel({
  selectedDateLabel,
  selectedTimeLabel,
  hostTimeHint,
  attendeeEmail,
  meetLink,
}: {
  selectedDateLabel: string
  selectedTimeLabel: string
  hostTimeHint: string | null
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
          {selectedDateLabel} · {selectedTimeLabel}
        </p>
        {hostTimeHint ? <p className="mt-0.5 text-[11px] text-zinc-600">{hostTimeHint}</p> : null}
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

function LeadConfirmPanel({
  selectedDateLabel,
  selectedTimeLabel,
  hostTimeHint,
  leadName,
  leadEmail,
  isSubmitting,
  errorMessage,
  onBackToTimes,
  onSubmit,
}: {
  selectedDateLabel: string
  selectedTimeLabel: string
  hostTimeHint: string | null
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
        className="mb-5 self-start text-xs text-zinc-500 transition-colors hover:text-white disabled:opacity-50"
      >
        ← Volver a horarios
      </button>
      <h3 className="mb-2 text-lg font-semibold leading-snug text-white md:text-xl">
        Confirma tu reunión
      </h3>
      <p className="mb-1 text-sm text-zinc-400">
        {selectedDateLabel} · {selectedTimeLabel}
      </p>
      {hostTimeHint ? <p className="mb-6 text-xs text-zinc-600">{hostTimeHint}</p> : <div className="mb-6" />}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm">
        <p className="font-medium text-white">{leadName}</p>
        <p className="mt-1 text-zinc-400">{leadEmail}</p>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        Usaremos los datos que ya nos diste en la guía. La invitación de Google Meet llega a este correo.
      </p>
      {errorMessage ? <p className="mt-4 text-sm text-red-400">{errorMessage}</p> : null}
      <div className="mt-auto border-t border-zinc-800 pt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            isSubmitting
              ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
              : "bg-white text-black hover:bg-zinc-200"
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

export function BookingWidget({
  leadToken,
  leadName,
  leadEmail,
}: {
  leadToken?: string
  leadName?: string
  leadEmail?: string
} = {}) {
  const { timeZone, setTimeZone } = useVisitorTimezone()
  const [viewYear, setViewYear] = useState(BOOKING_YEAR)
  const [viewMonth, setViewMonth] = useState(BOOKING_MONTH)
  const [currentMonth, setCurrentMonth] = useState({ year: BOOKING_YEAR, month: BOOKING_MONTH })
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlotStart, setSelectedSlotStart] = useState<string | null>(null)
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
    entrySource: "DIRECT_BOOKING",
    bookingFlow: "DIRECT_BOOKING",
    enabled: !existingLead,
  })

  const monthWeeks = useMemo(() => buildMonthWeeks(viewYear, viewMonth), [viewYear, viewMonth])
  const previousMonth = addBookingMonths(viewYear, viewMonth, -1)
  const nextMonth = addBookingMonths(viewYear, viewMonth, 1)
  const canGoPrev = isMonthInBookingWindow(
    previousMonth.year,
    previousMonth.month,
    currentMonth.year,
    currentMonth.month,
  )
  const canGoNext = isMonthInBookingWindow(
    nextMonth.year,
    nextMonth.month,
    currentMonth.year,
    currentMonth.month,
  )

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearLoadTimeout, [clearLoadTimeout])

  const resetSelection = useCallback(() => {
    setSelectedDay(null)
    setSelectedSlotStart(null)
    setTimeSlots([])
    setMeetLink(null)
    setErrorMessage(null)
    setFormStep(0)
    setStep("idle")
  }, [])

  const loadMonthAvailability = useCallback(async () => {
    setIsLoadingCalendar(true)
    setCalendarError(null)

    try {
      const response = await fetch(`/api/booking/month?year=${viewYear}&month=${viewMonth}`)
      if (!response.ok) throw new Error("No se pudo cargar el calendario")

      const data = (await response.json()) as MonthAvailabilityResponse
      setUnavailableDays(new Set(data.unavailableDays))
      setSlotsByDate(data.slotsByDate ?? {})
    } catch (error) {
      console.error(error)
      setCalendarError(
        error instanceof Error ? error.message : "No se pudo consultar la disponibilidad"
      )
      setUnavailableDays(new Set(getFallbackUnavailableDays(viewYear, viewMonth)))
      setSlotsByDate({})
    } finally {
      setIsLoadingCalendar(false)
    }
  }, [viewMonth, viewYear])

  useEffect(() => {
    loadMonthAvailability()
  }, [loadMonthAvailability])

  useEffect(() => {
    const current = getCurrentBookingYearMonth()
    setCurrentMonth(current)
    setViewYear(current.year)
    setViewMonth(current.month)
  }, [])

  const handleShiftMonth = useCallback(
    (delta: number) => {
      const next = addBookingMonths(viewYear, viewMonth, delta)
      if (!isMonthInBookingWindow(next.year, next.month, currentMonth.year, currentMonth.month)) return
      setViewYear(next.year)
      setViewMonth(next.month)
      resetSelection()
    },
    [currentMonth.month, currentMonth.year, resetSelection, viewMonth, viewYear]
  )

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
      setMeetLink(null)
      setErrorMessage(null)
      setStep("loading-times")

      const dateKey = toBookingDate(viewYear, viewMonth, day)

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
    [clearLoadTimeout, isLoadingCalendar, unavailableDays, viewMonth, viewYear]
  )

  const handleSelectTime = useCallback(
    (slot: BookingSlot) => {
      if (!slot.available) return
      clearLoadTimeout()
      setSelectedSlotStart(slot.start)
      setErrorMessage(null)
      setStep("form")
    },
    [clearLoadTimeout]
  )

  const handleBackToTimes = useCallback(() => {
    clearLoadTimeout()
    setSelectedSlotStart(null)
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
                date: toBookingDate(viewYear, viewMonth, selectedDay),
                slotStart: selectedSlotStart,
                visitorTimezone: timeZone,
                leadToken,
                bookingFlow: "EBOOK_PDF",
                attribution: collectAttribution(),
              }
            : {
                date: toBookingDate(viewYear, viewMonth, selectedDay),
                slotStart: selectedSlotStart,
                visitorTimezone: timeZone,
                ...formData,
                bookingFlow: "DIRECT_BOOKING",
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
  }, [clear, flush, formData, getToken, leadEmail, leadName, leadToken, selectedDay, selectedSlotStart, timeZone, viewMonth, viewYear])

  const isFormActive = step === "form" || step === "submitting" || step === "submitted"
  const showMobilePanel = selectedDay !== null
  const leadMode = leadToken && leadName && leadEmail ? { name: leadName, email: leadEmail } : undefined
  const attendeeEmail = leadEmail || formData.email
  const selectedTimeLabel = selectedSlotStart
    ? formatSlotTimeLabel(selectedSlotStart, timeZone, use24h)
    : null
  const selectedDateLabel = selectedSlotStart
    ? formatSlotDateLabel(selectedSlotStart, timeZone)
    : selectedDay
      ? formatSelectedDate(viewYear, viewMonth, selectedDay)
      : null
  const hostTimeHint =
    selectedSlotStart && timeZone !== bookingConfig.timezone
      ? `${formatSlotTimeLabel(selectedSlotStart, bookingConfig.timezone, use24h)} hora de Bogotá`
      : null

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
              <span>{bookingConfig.slotMinutes}m</span>
            </div>
            <div className="flex items-center gap-2">
              <GoogleMeetIcon className="h-4 w-4 shrink-0" />
              <span>Google Meet</span>
            </div>
            <BookingTimezonePicker value={timeZone} onChange={setTimeZone} variant="dark" />
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
            <span className="text-sm font-medium text-white">{bookingMonthLabel(viewYear, viewMonth)}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleShiftMonth(-1)}
                disabled={!canGoPrev || isLoadingCalendar}
                className="flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700 disabled:hover:text-zinc-700"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleShiftMonth(1)}
                disabled={!canGoNext || isLoadingCalendar}
                className="flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700 disabled:hover:text-zinc-700"
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
              {monthWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1.5 md:gap-1">
                  {week.map((day, dayIndex) => (
                    <CalendarDay
                      key={`${viewYear}-${viewMonth}-${weekIndex}-${dayIndex}`}
                      day={day}
                      monthName={bookingMonthName(viewMonth)}
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
            viewYear={viewYear}
            viewMonth={viewMonth}
            selectedSlotStart={selectedSlotStart}
            selectedDateLabel={selectedDateLabel}
            selectedTimeLabel={selectedTimeLabel}
            hostTimeHint={hostTimeHint}
            use24h={use24h}
            timeZone={timeZone}
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
              "scroll-mt-6 border-t border-zinc-800 p-4 lg:hidden",
              isFormActive && "border-t-0"
            )}
          >
            <BookingSidePanel
              step={step}
              selectedDay={selectedDay}
              viewYear={viewYear}
              viewMonth={viewMonth}
              selectedSlotStart={selectedSlotStart}
              selectedDateLabel={selectedDateLabel}
              selectedTimeLabel={selectedTimeLabel}
              hostTimeHint={hostTimeHint}
              use24h={use24h}
              timeZone={timeZone}
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
