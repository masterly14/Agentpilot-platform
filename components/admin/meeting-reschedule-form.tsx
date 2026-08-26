"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fromBogotaDatetimeLocal, toBogotaDatetimeLocal } from "@/lib/admin/bogota-datetime"
import { bookingConfig } from "@/lib/booking/config"
import {
  formatTimezoneCity,
  getBookingTimezoneOptions,
} from "@/lib/booking/timezone"

export type MeetingReschedulePayload = {
  meetingTime: string
  meetLink: string
  visitorTimezone: string
}

export function MeetingRescheduleForm({
  meetingTime,
  meetLink,
  visitorTimezone,
  disabled,
  saving,
  onSubmit,
}: {
  meetingTime: string | null
  meetLink: string | null
  visitorTimezone?: string | null
  disabled: boolean
  saving: boolean
  onSubmit: (payload: MeetingReschedulePayload) => Promise<void>
}) {
  const [meetingLocal, setMeetingLocal] = useState("")
  const [link, setLink] = useState("")
  const [timeZone, setTimeZone] = useState(bookingConfig.timezone)
  const [error, setError] = useState<string | null>(null)
  const timezoneOptions = useMemo(
    () => getBookingTimezoneOptions(visitorTimezone || timeZone),
    [visitorTimezone, timeZone],
  )

  useEffect(() => {
    setMeetingLocal(toBogotaDatetimeLocal(meetingTime))
    setLink(meetLink ?? "")
    setTimeZone(visitorTimezone || bookingConfig.timezone)
    setError(null)
  }, [meetingTime, meetLink, visitorTimezone])

  const hasExisting = Boolean(meetingTime)
  const busy = disabled || saving

  async function handleSubmit() {
    const nextMeeting = fromBogotaDatetimeLocal(meetingLocal)
    if (!nextMeeting) {
      setError("Elige fecha y hora de la reunión")
      return
    }
    if (nextMeeting.getTime() <= Date.now()) {
      setError("La nueva hora tiene que ser en el futuro")
      return
    }
    setError(null)
    try {
      await onSubmit({
        meetingTime: nextMeeting.toISOString(),
        meetLink: link.trim(),
        visitorTimezone: timeZone,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reagendar")
    }
  }

  return (
    <div className="space-y-3 rounded-xl border p-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {hasExisting ? "Reagendar reunión" : "Agendar reunión"}
      </p>
      <p className="text-xs text-muted-foreground">
        La hora se guarda en Bogotá. WhatsApp le habla al lead en su zona.
      </p>
      <div className="space-y-2">
        <Label htmlFor="pipeline-meeting-time" className="text-xs text-muted-foreground">
          Fecha y hora (Bogotá)
        </Label>
        <Input
          id="pipeline-meeting-time"
          type="datetime-local"
          value={meetingLocal}
          onChange={(event) => setMeetingLocal(event.target.value)}
          disabled={busy}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pipeline-lead-timezone" className="text-xs text-muted-foreground">
          Zona del lead
        </Label>
        <select
          id="pipeline-lead-timezone"
          value={timeZone}
          onChange={(event) => setTimeZone(event.target.value)}
          disabled={busy}
          className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
        >
          {timezoneOptions.map((zone) => (
            <option key={zone} value={zone}>
              {formatTimezoneCity(zone)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pipeline-meet-link" className="text-xs text-muted-foreground">
          Link de Google Meet
        </Label>
        <Input
          id="pipeline-meet-link"
          type="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://meet.google.com/..."
          disabled={busy}
        />
      </div>
      <Button
        type="button"
        className="w-full"
        disabled={busy || !meetingLocal}
        onClick={() => void handleSubmit()}
      >
        <Calendar className="mr-2 size-4" />
        {saving ? "Guardando…" : hasExisting ? "Reagendar" : "Agendar"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
