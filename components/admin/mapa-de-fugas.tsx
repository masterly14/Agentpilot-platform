"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DiagnosticoLeadPicker } from "@/components/admin/diagnostico-lead-picker"
import { formatMeetingLabel } from "@/components/admin/kanban-parts"
import { MapaDeFugasConsulta } from "@/components/admin/mapa-de-fugas-consulta"
import { MapaDeFugasInforme } from "@/components/admin/mapa-de-fugas-informe"
import {
  leakMapFromLead,
  linkFromSaved,
  type DiagnosisLeadLink,
  type DiagnosisLeadOption,
} from "@/lib/admin/diagnosis-leads"
import {
  bogotaDateFromIso,
  createEmptyLeakMap,
  emptyLeak,
  eventosFromRotacion,
  hydrateLeakMap,
  SIRE_LEAK,
  type DiagnosticoLeak,
  type LeakMapState,
  type LeakMapVista,
  type PasoMark,
  type SavedDiagnosis,
} from "@/lib/admin/leak-map"
import "@/components/admin/diagnostico-operativo.css"

type MapaDeFugasProps = {
  initialSaved: SavedDiagnosis[]
  initialLeads: DiagnosisLeadOption[]
  initialFecha?: string
}

export function MapaDeFugas({ initialSaved, initialLeads, initialFecha }: MapaDeFugasProps) {
  const router = useRouter()
  const [state, setState] = useState<LeakMapState>(() => createEmptyLeakMap(initialFecha))
  const [vista, setVista] = useState<LeakMapVista>("recorrido")
  const [reveal, setReveal] = useState(false)
  const [openLeakId, setOpenLeakId] = useState<string | null>(null)
  const [saved, setSaved] = useState(initialSaved)
  const [leads] = useState(initialLeads)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [lead, setLead] = useState<DiagnosisLeadLink | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<"new" | "link">("new")
  const [saving, setSaving] = useState(false)
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false)

  function setField(key: keyof LeakMapState, value: string) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  function setMark(key: string, s: PasoMark) {
    setState((prev) => {
      const current = prev.marks[key] ?? { s: "", n: "" }
      const nextS = current.s === s ? "" : s
      return { ...prev, marks: { ...prev.marks, [key]: { ...current, s: nextS } } }
    })
  }

  function setNote(key: string, n: string) {
    setState((prev) => {
      const current = prev.marks[key] ?? { s: "", n: "" }
      return { ...prev, marks: { ...prev.marks, [key]: { ...current, n } } }
    })
  }

  function addLeak(partial?: Partial<DiagnosticoLeak>) {
    const leak = emptyLeak(partial)
    setState((prev) => ({ ...prev, leaks: [...prev.leaks, leak] }))
    setOpenLeakId(leak.id)
  }

  function fromStep(key: string, nombre: string) {
    addLeak({
      nombre,
      nota: state.marks[key]?.n ?? "",
      accion: "proceso",
    })
  }

  function changeLeak(id: string, key: keyof DiagnosticoLeak, value: string) {
    setState((prev) => ({
      ...prev,
      leaks: prev.leaks.map((leak) => (leak.id === id ? { ...leak, [key]: value } : leak)),
    }))
  }

  function applyRotacion(id: string, ay: string) {
    const eventos = eventosFromRotacion(ay)
    setState((prev) => ({
      ...prev,
      leaks: prev.leaks.map((leak) =>
        leak.id === id ? { ...leak, ay, ...(eventos != null ? { eventos: String(eventos) } : {}) } : leak,
      ),
    }))
  }

  function deleteLeak(id: string) {
    setState((prev) => ({ ...prev, leaks: prev.leaks.filter((leak) => leak.id !== id) }))
    setOpenLeakId((current) => (current === id ? null : current))
  }

  function startNew(nextLead: DiagnosisLeadOption) {
    setState(leakMapFromLead(nextLead))
    setLead(nextLead)
    setCurrentId(null)
    setReveal(false)
    setOpenLeakId(null)
    setVista("recorrido")
    setPickerOpen(false)
  }

  function attachLead(nextLead: DiagnosisLeadOption) {
    setLead(nextLead)
    setState((prev) => ({
      ...prev,
      cliente: prev.cliente.trim() || nextLead.clientName,
      fecha: prev.fecha || bogotaDateFromIso(nextLead.meetingTime),
      unidades: prev.unidades || nextLead.properties,
      canales: prev.canales || (nextLead.source === "airbnb" ? "Airbnb" : ""),
    }))
    setPickerOpen(false)
  }

  function openPicker(mode: "new" | "link") {
    setPickerMode(mode)
    setPickerOpen(true)
  }

  async function handleSave() {
    const clientName = state.cliente.trim()
    if (!clientName) {
      toast.error("Escribe el nombre del cliente antes de guardar.")
      return
    }
    if (!currentId && !lead) {
      toast.error("Selecciona el lead de esta reunión.")
      openPicker("link")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/admin/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentId,
          state,
          submissionId: lead?.submissionId ?? null,
          airbnbLeadId: lead?.airbnbLeadId ?? null,
        }),
      })
      const payload = (await response.json()) as {
        error?: string
        diagnosis?: SavedDiagnosis
      }
      if (!response.ok || !payload.diagnosis) {
        throw new Error(payload.error ?? "No se pudo guardar.")
      }

      setCurrentId(payload.diagnosis.id)
      setLead(linkFromSaved(payload.diagnosis) ?? lead)
      setSaved((prev) => {
        const next = prev.filter((item) => item.id !== payload.diagnosis!.id)
        return [payload.diagnosis!, ...next]
      })
      toast.success(`Diagnóstico de ${clientName} guardado.`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar. Revisa la conexión.")
    } finally {
      setSaving(false)
    }
  }

  async function handleLoad(id: string) {
    try {
      const response = await fetch(`/api/admin/diagnostico/${id}`)
      const payload = (await response.json()) as {
        error?: string
        state?: unknown
        diagnosis?: SavedDiagnosis
      }
      if (!response.ok || payload.state == null) {
        throw new Error(payload.error ?? "No se encontró ese diagnóstico.")
      }
      setState(hydrateLeakMap(payload.state))
      setCurrentId(id)
      setLead(payload.diagnosis ? linkFromSaved(payload.diagnosis) : null)
      setReveal(false)
      setOpenLeakId(null)
      setVista("recorrido")
      toast.success("Diagnóstico cargado.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se encontró ese diagnóstico.")
    }
  }

  async function handleWhatsApp() {
    if (!lead) {
      toast.error("Selecciona el lead de esta reunión.")
      openPicker("link")
      return
    }

    setSendingWhatsApp(true)
    try {
      const response = await fetch("/api/admin/diagnostico/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          submissionId: lead.submissionId,
          airbnbLeadId: lead.airbnbLeadId,
        }),
      })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? "No se pudo enviar por WhatsApp.")
      toast.success("Diagnóstico enviado por WhatsApp.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo enviar por WhatsApp.")
    } finally {
      setSendingWhatsApp(false)
    }
  }

  const cliente = state.cliente.trim()
  const meetingLabel = formatMeetingLabel(lead?.meetingTime ?? null)

  return (
    <div className="diag-op min-h-full">
      <header className="bar noprint">
        <h1>Diagnóstico operativo</h1>
        <span className="who">
          {cliente || (lead ? lead.clientName : "Sin lead ligado")}
          {lead
            ? ` · ${lead.source === "airbnb" ? "Airbnb" : "Inbound"}${meetingLabel ? ` · ${meetingLabel}` : ""}`
            : ""}
        </span>
        <span className="sp" />
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={vista === "recorrido"}
            onClick={() => setVista("recorrido")}
          >
            Recorrido
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={vista === "informe"}
            onClick={() => setVista("informe")}
          >
            Informe
          </button>
        </div>
        {saved.length > 0 ? (
          <select
            className="saved"
            value={currentId ?? ""}
            onChange={(event) => {
              if (event.target.value) void handleLoad(event.target.value)
            }}
          >
            <option value="">Abrir un diagnóstico guardado</option>
            {saved.map((item) => (
              <option key={item.id} value={item.id}>
                {item.leadLabel || item.clientName}
                {formatMeetingLabel(item.meetingTime)
                  ? ` · ${formatMeetingLabel(item.meetingTime)}`
                  : ""}
              </option>
            ))}
          </select>
        ) : null}
        <button type="button" onClick={() => openPicker("link")}>
          {lead ? "Cambiar lead" : "Elegir lead"}
        </button>
        <button type="button" onClick={() => openPicker("new")}>
          Nuevo
        </button>
        <button type="button" className="solid" onClick={() => void handleSave()} disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </header>

      <main className="sheet">
        {vista === "recorrido" ? (
          <div className="noprint">
            <MapaDeFugasConsulta
              state={state}
              openLeakId={openLeakId}
              reveal={reveal}
              onField={setField}
              onMark={setMark}
              onNote={setNote}
              onFromStep={fromStep}
              onToggleLeak={(id) => setOpenLeakId((current) => (current === id ? null : id))}
              onChangeLeak={changeLeak}
              onRotacion={applyRotacion}
              onAddLeak={() => addLeak()}
              onAddSire={() => addLeak(SIRE_LEAK)}
              onDeleteLeak={deleteLeak}
              onReveal={() => setReveal((current) => !current)}
            />
          </div>
        ) : (
          <MapaDeFugasInforme
            state={state}
            sending={sendingWhatsApp}
            onSendWhatsApp={() => void handleWhatsApp()}
          />
        )}
      </main>

      <DiagnosticoLeadPicker
        open={pickerOpen}
        leads={leads}
        onOpenChange={setPickerOpen}
        onSelect={pickerMode === "new" ? startNew : attachLead}
      />
    </div>
  )
}
