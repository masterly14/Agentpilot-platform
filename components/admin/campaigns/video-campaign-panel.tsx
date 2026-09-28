"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Film, LoaderCircle, Search, Send } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FUNNEL_COLUMNS, FUNNEL_STAGE_LABEL } from "@/lib/marketing/funnel-ui"
import { WHATSAPP_VIDEO_MAX_BYTES } from "@/lib/campaigns/constants"
import { cn } from "@/lib/utils"
import type { VideoOutreachLead } from "@/lib/campaigns/video-outreach"

function formatWhen(iso: string | null) {
  if (!iso) return null
  return new Date(iso)
    .toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Bogota",
    })
    .replace(/[\u00A0\u202F\u2009]/g, " ")
}

export function VideoCampaignPanel() {
  const [stage, setStage] = useState("all")
  const [query, setQuery] = useState("")
  const [leads, setLeads] = useState<VideoOutreachLead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const selected = useMemo(
    () => leads.find((lead) => lead.leadId === selectedId) ?? null,
    [leads, selectedId],
  )

  const loadLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (stage) params.set("stage", stage)
      if (query.trim()) params.set("query", query.trim())
      const response = await fetch(`/api/admin/campaigns/video/leads?${params}`)
      const payload = (await response.json()) as { leads?: VideoOutreachLead[]; error?: string }
      if (!response.ok) throw new Error(payload.error ?? "No se pudieron cargar los leads.")
      setLeads(payload.leads ?? [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los leads.")
    } finally {
      setLoading(false)
    }
  }, [query, stage])

  useEffect(() => {
    void loadLeads()
  }, [loadLeads])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function onVideoChange(file: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (!file) {
      setVideo(null)
      setPreviewUrl(null)
      return
    }
    if (file.size > WHATSAPP_VIDEO_MAX_BYTES) {
      toast.error("El video supera el límite de 16 MB de WhatsApp.")
      return
    }
    setVideo(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSend() {
    if (!video) {
      toast.error("Adjunta un video.")
      return
    }
    if (!selected) {
      toast.error("Selecciona un lead.")
      return
    }
    if (!selected.phone) {
      toast.error("Este lead no tiene WhatsApp.")
      return
    }

    setSending(true)
    try {
      const form = new FormData()
      form.set("leadId", selected.leadId)
      form.set("video", video)
      const response = await fetch("/api/admin/campaigns/video/send", {
        method: "POST",
        body: form,
      })
      const payload = (await response.json()) as {
        error?: string
        emailQueued?: boolean
        emailStatus?: string
        alreadyContacted?: boolean
      }
      if (!response.ok) throw new Error(payload.error ?? "No se pudo enviar.")

      const extra =
        payload.emailStatus === "SKIPPED"
          ? " WhatsApp enviado; el lead no tiene correo."
          : payload.emailQueued
            ? " El correo se enviará en 5 minutos."
            : " WhatsApp enviado; el correo no se pudo encolar."
      toast.success(`Plantilla marketing_video2 enviada.${extra}`)
      await loadLeads()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo enviar.")
    } finally {
      setSending(false)
    }
  }

  const canSend = Boolean(video && selected?.phone) && !sending

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1200px] flex-1 flex-col gap-6 overflow-hidden px-4 py-6 md:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Campaña
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Video + WhatsApp + correo</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Adjunta el video, elige un lead por estado y envía la plantilla{" "}
          <span className="font-medium text-foreground">marketing_video2</span>. El correo con el
          link de Cal.com se encola 5 minutos después.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <section className="flex min-h-0 flex-col rounded-2xl border bg-card p-4">
          <Label htmlFor="campaign-video" className="mb-3">
            Video
          </Label>
          <label
            htmlFor="campaign-video"
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors hover:bg-muted/40",
              video ? "border-primary/40 bg-muted/20" : "border-border",
            )}
          >
            <Film className="mb-2 size-6 text-muted-foreground" />
            <p className="text-sm font-medium">{video ? video.name : "Adjuntar video"}</p>
            <p className="mt-1 text-xs text-muted-foreground">MP4 · máximo 16 MB</p>
            <input
              id="campaign-video"
              type="file"
              accept="video/mp4,video/*"
              className="sr-only"
              onChange={(event) => onVideoChange(event.target.files?.[0] ?? null)}
            />
          </label>
          {previewUrl ? (
            <video src={previewUrl} controls className="mt-4 w-full rounded-xl bg-black" />
          ) : null}

          {selected ? (
            <div className="mt-4 rounded-xl border bg-muted/30 p-3 text-sm">
              <p className="font-semibold">{selected.name || selected.companyName || "Lead"}</p>
              <p className="text-muted-foreground">{selected.phone}</p>
              <p className="text-muted-foreground">{selected.email || "Sin correo"}</p>
              {selected.videoOutreachAt ? (
                <Badge variant="secondary" className="mt-2">
                  Ya contactado · {formatWhen(selected.videoOutreachAt)}
                </Badge>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Selecciona un lead de la lista.</p>
          )}

          <Button className="mt-4" disabled={!canSend} onClick={() => void handleSend()}>
            {sending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
            Enviar
          </Button>
        </section>

        <section className="flex min-h-0 flex-col rounded-2xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre, empresa o correo…"
                className="pl-9"
              />
            </div>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-full sm:w-56" size="sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="inbox">Bandeja</SelectItem>
                {FUNNEL_COLUMNS.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {FUNNEL_STAGE_LABEL[column.id]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-6 text-sm text-muted-foreground">Cargando leads…</p>
            ) : leads.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No hay leads con WhatsApp en ese estado.
              </p>
            ) : (
              <ul className="divide-y">
                {leads.map((lead) => {
                  const active = lead.leadId === selectedId
                  return (
                    <li key={lead.leadId}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(lead.leadId)}
                        className={cn(
                          "flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-muted/40",
                          active && "bg-muted/70",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {lead.name || lead.companyName || "Lead sin nombre"}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {[lead.companyName, lead.phone, lead.email].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {lead.funnelStage}
                          </Badge>
                          {lead.videoOutreachBookedAt ? (
                            <Badge className="text-[10px]">Agendó (Cal)</Badge>
                          ) : lead.videoOutreachAt ? (
                            <Badge variant="outline" className="text-[10px]">
                              Ya contactado
                            </Badge>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
