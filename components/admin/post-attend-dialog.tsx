"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fromBogotaDatetimeLocal } from "@/lib/admin/bogota-datetime"

export type PostAttendChoice = "demo" | "discard"

type PostAttendDialogProps = {
  open: boolean
  leadName: string
  initialPainPoint?: string | null
  initialStep?: "choose" | "demo"
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onScheduleDemo: (input: { meetingTime: string; painPoint: string }) => Promise<void>
  onDiscard: () => Promise<void>
}

export function PostAttendDialog({
  open,
  leadName,
  initialPainPoint,
  initialStep = "choose",
  isSubmitting,
  onOpenChange,
  onScheduleDemo,
  onDiscard,
}: PostAttendDialogProps) {
  const [step, setStep] = useState<"choose" | "demo">(initialStep)
  const [meetingLocal, setMeetingLocal] = useState("")
  const [painPoint, setPainPoint] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep(initialStep)
    setMeetingLocal("")
    setPainPoint(initialPainPoint?.trim() ?? "")
    setError(null)
  }, [open, initialPainPoint, initialStep])

  const parsedMeeting = fromBogotaDatetimeLocal(meetingLocal)
  const canSaveDemo =
    Boolean(parsedMeeting && parsedMeeting.getTime() > Date.now() && painPoint.trim()) && !isSubmitting

  async function handleSaveDemo() {
    const nextMeeting = fromBogotaDatetimeLocal(meetingLocal)
    if (!nextMeeting) {
      setError("Elige fecha y hora de la demo")
      return
    }
    if (nextMeeting.getTime() <= Date.now()) {
      setError("La hora tiene que ser en el futuro")
      return
    }
    if (!painPoint.trim()) {
      setError("Escribe el dolor principal")
      return
    }
    setError(null)
    await onScheduleDemo({
      meetingTime: nextMeeting.toISOString(),
      painPoint: painPoint.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "choose" ? (
          <>
            <DialogHeader>
              <DialogTitle>Después de la llamada</DialogTitle>
              <DialogDescription>
                {leadName} asistió. ¿Programas demo o se descarta?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Button type="button" onClick={() => setStep("demo")} disabled={isSubmitting}>
                Programar demo
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => void onDiscard()}
              >
                {isSubmitting ? "Guardando…" : "Descartar"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Programar demo</DialogTitle>
              <DialogDescription>
                Se crea el evento en tu Calendar, se invita a {leadName} y se programan los
                recordatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="demo-meeting-time" className="text-xs text-muted-foreground">
                  Fecha y hora (Bogotá)
                </Label>
                <Input
                  id="demo-meeting-time"
                  type="datetime-local"
                  value={meetingLocal}
                  onChange={(event) => setMeetingLocal(event.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo-pain" className="text-xs text-muted-foreground">
                  Dolor principal
                </Label>
                <Input
                  id="demo-pain"
                  value={painPoint}
                  onChange={(event) => setPainPoint(event.target.value)}
                  placeholder="el seguimiento manual de reservas"
                  disabled={isSubmitting}
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("choose")}
                disabled={isSubmitting}
              >
                Atrás
              </Button>
              <Button type="button" disabled={!canSaveDemo} onClick={() => void handleSaveDemo()}>
                {isSubmitting ? "Guardando…" : "Guardar demo"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
