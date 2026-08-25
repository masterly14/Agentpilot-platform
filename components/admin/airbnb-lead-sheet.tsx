"use client"

import { useEffect, useState } from "react"
import { Calendar, ExternalLink, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatMeetingLabel } from "@/components/admin/kanban-parts"
import type { AirbnbLeadRecord } from "@/lib/admin/airbnb-lead-record"
import { AIRBNB_STAGE_LABEL } from "@/lib/admin/airbnb-funnel"
import { fromBogotaDatetimeLocal, toBogotaDatetimeLocal } from "@/lib/admin/bogota-datetime"
import { cn } from "@/lib/utils"

function AirbnbStageActions({
  lead,
  disabled,
  onShowUp,
  onNoShow,
  onCloseDeal,
}: {
  lead: AirbnbLeadRecord
  disabled: boolean
  onShowUp: () => void
  onNoShow: () => void
  onCloseDeal: () => void
}) {
  if (lead.stage === "SCHEDULED") {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button type="button" size="sm" disabled={disabled} onClick={onShowUp}>
          Asistió
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={disabled} onClick={onNoShow}>
          No asistió
        </Button>
      </div>
    )
  }
  if (lead.stage === "SHOWED_UP") {
    return (
      <Button type="button" size="sm" className="w-full" disabled={disabled} onClick={onCloseDeal}>
        Cerrar trato
      </Button>
    )
  }
  if (lead.stage === "NO_SHOW") {
    return (
      <Button type="button" size="sm" variant="outline" className="w-full" disabled={disabled} onClick={onShowUp}>
        Marcar show-up
      </Button>
    )
  }
  return null
}

function directionLabel(direction: AirbnbLeadRecord["messages"][number]["direction"]) {
  if (direction === "INBOUND") return "Host"
  if (direction === "OUTBOUND") return "Nosotros"
  return "Sistema"
}

type AirbnbLeadSheetProps = {
  lead: AirbnbLeadRecord | null
  open: boolean
  isUpdating: boolean
  onOpenChange: (open: boolean) => void
  onShowUp: () => void
  onNoShow: () => void
  onCloseDeal: () => void
  onUpdated: (lead: AirbnbLeadRecord) => void
}

export function AirbnbLeadSheet({
  lead,
  open,
  isUpdating,
  onOpenChange,
  onShowUp,
  onNoShow,
  onCloseDeal,
  onUpdated,
}: AirbnbLeadSheetProps) {
  const [email, setEmail] = useState("")
  const [meetingLocal, setMeetingLocal] = useState("")
  const [meetLink, setMeetLink] = useState("")
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingMeet, setSavingMeet] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lead) return
    setEmail(lead.hostEmail ?? "")
    setMeetingLocal(toBogotaDatetimeLocal(lead.meetingTime))
    setMeetLink(lead.meetLink ?? "")
    setError(null)
  }, [lead])

  if (!lead) return null

  const stageLabel = lead.stage ? AIRBNB_STAGE_LABEL[lead.stage] : "Sin etapa comercial"
  const meeting = formatMeetingLabel(lead.meetingTime)
  const visibleMessages = lead.messages.filter(
    (message) => !message.content.startsWith("HARVEST_CONTEXT:"),
  )

  async function saveEmail() {
    setSavingEmail(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/airbnb/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airbnbLeadId: lead.id, hostEmail: email }),
      })
      const payload = (await res.json().catch(() => null)) as { lead?: AirbnbLeadRecord; error?: string } | null
      if (!res.ok) throw new Error(payload?.error ?? "No se pudo guardar el correo")
      if (payload?.lead) onUpdated(payload.lead)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el correo")
    } finally {
      setSavingEmail(false)
    }
  }

  async function saveMeeting() {
    const meetingTime = fromBogotaDatetimeLocal(meetingLocal)
    if (!meetingTime) {
      setError("Fecha y hora de la reunión requeridas")
      return
    }
    setSavingMeet(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/airbnb/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airbnbLeadId: lead.id,
          meetingTime: meetingTime.toISOString(),
          meetLink,
          hostEmail: email || undefined,
        }),
      })
      const payload = (await res.json().catch(() => null)) as { lead?: AirbnbLeadRecord; error?: string } | null
      if (!res.ok) throw new Error(payload?.error ?? "No se pudo registrar la reunión")
      if (payload?.lead) onUpdated(payload.lead)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la reunión")
    } finally {
      setSavingMeet(false)
    }
  }

  const busy = isUpdating || savingEmail || savingMeet

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{lead.name}</SheetTitle>
          <SheetDescription>
            {stageLabel}
            {meeting ? ` · ${meeting}` : ""}
            {lead.market ? ` · ${lead.market}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1">
          <AirbnbStageActions
            lead={lead}
            disabled={busy}
            onShowUp={onShowUp}
            onNoShow={onNoShow}
            onCloseDeal={onCloseDeal}
          />

          {lead.meetLink ? (
            <Button asChild variant="outline" size="sm">
              <a href={lead.meetLink} target="_blank" rel="noreferrer">
                Abrir Meet
              </a>
            </Button>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full">
              {lead.totalProperties} props
            </Badge>
            {lead.isSuperhost ? (
              <Badge variant="secondary" className="rounded-full">
                Superhost
              </Badge>
            ) : null}
            {lead.status === "HUMAN_TAKEOVER" ? (
              <Badge variant="destructive" className="rounded-full">
                Handoff
              </Badge>
            ) : null}
          </div>

          <div className="space-y-3 text-sm">
            {[
              { label: "Empresa", value: lead.companyName },
              { label: "Listing", value: lead.primaryListingName },
              { label: "Perfil", value: lead.hostProfileUrl, href: lead.hostProfileUrl },
              { label: "Anuncio", value: lead.primaryListingUrl, href: lead.primaryListingUrl },
              { label: "Hilo", value: lead.threadId, href: lead.threadId },
            ].map((row) =>
              row.value ? (
                <div key={row.label} className="grid grid-cols-[88px_1fr] gap-3">
                  <span className="text-muted-foreground">{row.label}</span>
                  {row.href ? (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 break-all font-medium text-primary hover:underline"
                    >
                      {row.value}
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="break-words font-medium">{row.value}</span>
                  )}
                </div>
              ) : null,
            )}
          </div>

          {lead.handoffReason ? (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Motivo del handoff
              </p>
              <p className="mt-1 leading-relaxed">{lead.handoffReason}</p>
            </div>
          ) : null}

          {lead.executiveSummary ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Resumen
              </p>
              <p className="rounded-xl border bg-muted/50 p-3 text-sm leading-relaxed">
                {lead.executiveSummary}
              </p>
            </div>
          ) : null}

          <div className="space-y-3 rounded-xl border p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Correo del host
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="host@correo.com"
                disabled={busy}
              />
              <Button type="button" variant="outline" disabled={busy || !email.trim()} onClick={() => void saveEmail()}>
                {savingEmail ? "…" : "Guardar"}
              </Button>
            </div>
            {lead.hostEmail ? (
              <a
                href={`mailto:${lead.hostEmail}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-3" />
                Enviar correo
              </a>
            ) : null}
          </div>

          <div className="space-y-3 rounded-xl border p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Registrar reunión
            </p>
            <div className="space-y-2">
              <Label htmlFor="airbnb-meeting-time" className="text-xs text-muted-foreground">
                Fecha y hora (Bogotá)
              </Label>
              <Input
                id="airbnb-meeting-time"
                type="datetime-local"
                value={meetingLocal}
                onChange={(event) => setMeetingLocal(event.target.value)}
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airbnb-meet-link" className="text-xs text-muted-foreground">
                Link de Google Meet
              </Label>
              <Input
                id="airbnb-meet-link"
                type="url"
                value={meetLink}
                onChange={(event) => setMeetLink(event.target.value)}
                placeholder="https://meet.google.com/..."
                disabled={busy}
              />
            </div>
            <Button
              type="button"
              className="w-full"
              disabled={busy || !meetingLocal || !meetLink.trim()}
              onClick={() => void saveMeeting()}
            >
              <Calendar className="mr-2 size-4" />
              {savingMeet ? "Guardando…" : "Registrar Meet"}
            </Button>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {lead.contractValueUsd ? (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              Contrato · ${Number(lead.contractValueUsd).toLocaleString("en-US")} USD
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Hilo Airbnb
            </p>
            <div className="space-y-2">
              {visibleMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin mensajes.</p>
              ) : (
                visibleMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "rounded-lg border p-2.5 text-sm",
                      message.direction === "INBOUND" && "bg-white",
                      message.direction === "OUTBOUND" && "bg-muted/50",
                      message.direction === "SYSTEM" && "bg-amber-50 text-amber-950",
                    )}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {directionLabel(message.direction)}
                      {" · "}
                      {formatMeetingLabel(message.sentAt)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
