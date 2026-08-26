"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Printer, Save, UserRound } from "lucide-react"
import { toast } from "sonner"
import { DiagnosticoLeadPicker } from "@/components/admin/diagnostico-lead-picker"
import { formatMeetingLabel } from "@/components/admin/kanban-parts"
import { MapaDeFugasConsulta } from "@/components/admin/mapa-de-fugas-consulta"
import { MapaDeFugasInforme } from "@/components/admin/mapa-de-fugas-informe"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  leakMapFromLead,
  linkFromSaved,
  type DiagnosisLeadLink,
  type DiagnosisLeadOption,
} from "@/lib/admin/diagnosis-leads"
import {
  bogotaDateFromIso,
  calculateLeakMap,
  createEmptyLeakMap,
  emptyRequerimiento,
  findPasoDef,
  formatLeakMoney,
  hydrateLeakMap,
  nextPasoEstado,
  type AreaId,
  type AreaState,
  type LeakMapConfig,
  type LeakMapSnapshot,
  type LeakMapState,
  type LeakMapVista,
  type Requerimiento,
  type SavedDiagnosis,
  type TrazaId,
} from "@/lib/admin/leak-map"
import { cn } from "@/lib/utils"

type MapaDeFugasProps = {
  initialSaved: SavedDiagnosis[]
  initialLeads: DiagnosisLeadOption[]
  initialFecha?: string
}

export function MapaDeFugas({ initialSaved, initialLeads, initialFecha }: MapaDeFugasProps) {
  const router = useRouter()
  const [state, setState] = useState<LeakMapState>(() => {
    const empty = createEmptyLeakMap()
    if (initialFecha) empty.snapshot.fecha = initialFecha
    return empty
  })
  const [vista, setVista] = useState<LeakMapVista>("consulta")
  const [revelado, setRevelado] = useState(false)
  const [saved, setSaved] = useState(initialSaved)
  const [leads] = useState(initialLeads)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [lead, setLead] = useState<DiagnosisLeadLink | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<"new" | "link">("new")
  const [saving, setSaving] = useState(false)

  const calc = useMemo(() => calculateLeakMap(state), [state])
  const formatMoney = (value: number) => formatLeakMoney(value, state.config.moneda)

  function setSnapshot(key: keyof LeakMapSnapshot, value: string) {
    setState((prev) => ({ ...prev, snapshot: { ...prev.snapshot, [key]: value } }))
  }

  function setConfig(key: keyof LeakMapConfig, value: string) {
    setState((prev) => ({ ...prev, config: { ...prev.config, [key]: value } }))
  }

  function setArea(id: AreaState["id"], key: keyof AreaState, value: string | number | boolean) {
    setState((prev) => ({
      ...prev,
      areas: prev.areas.map((area) => (area.id === id ? { ...area, [key]: value } : area)),
    }))
  }

  function patchPaso(trazaId: TrazaId, pasoId: string, patch: Partial<LeakMapState["trazas"][number]["pasos"][number]>) {
    setState((prev) => ({
      ...prev,
      trazas: prev.trazas.map((traza) =>
        traza.id === trazaId
          ? {
              ...traza,
              pasos: traza.pasos.map((paso) => (paso.id === pasoId ? { ...paso, ...patch } : paso)),
            }
          : traza,
      ),
    }))
  }

  function cyclePaso(trazaId: TrazaId, pasoId: string) {
    setState((prev) => ({
      ...prev,
      trazas: prev.trazas.map((traza) =>
        traza.id === trazaId
          ? {
              ...traza,
              pasos: traza.pasos.map((paso) =>
                paso.id === pasoId ? { ...paso, estado: nextPasoEstado(paso.estado) } : paso,
              ),
            }
          : traza,
      ),
    }))
  }

  function createRequerimientoFromPaso(trazaId: TrazaId, pasoId: string) {
    let created = false
    setState((prev) => {
      const traza = prev.trazas.find((item) => item.id === trazaId)
      const paso = traza?.pasos.find((item) => item.id === pasoId)
      if (!paso || paso.requerimientoId) return prev
      created = true
      const def = findPasoDef(pasoId)
      const req = emptyRequerimiento({
        nombre: def?.paso.label ?? "",
        queNoPueden: paso.nota,
        origenTrazaId: trazaId,
        origenPasoId: pasoId,
      })
      return {
        ...prev,
        requerimientos: [...prev.requerimientos, req],
        trazas: prev.trazas.map((item) =>
          item.id === trazaId
            ? {
                ...item,
                pasos: item.pasos.map((p) =>
                  p.id === pasoId ? { ...p, requerimientoId: req.id } : p,
                ),
              }
            : item,
        ),
      }
    })
    if (created) toast.success("Requerimiento agregado abajo.")
  }

  function addRequerimiento() {
    setState((prev) => ({
      ...prev,
      requerimientos: [...prev.requerimientos, emptyRequerimiento()],
    }))
  }

  function changeRequerimiento(id: string, patch: Partial<Requerimiento>) {
    setState((prev) => ({
      ...prev,
      requerimientos: prev.requerimientos.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }))
  }

  function removeRequerimiento(id: string) {
    setState((prev) => ({
      ...prev,
      requerimientos: prev.requerimientos.filter((item) => item.id !== id),
      trazas: prev.trazas.map((traza) => ({
        ...traza,
        pasos: traza.pasos.map((paso) =>
          paso.requerimientoId === id ? { ...paso, requerimientoId: null } : paso,
        ),
      })),
    }))
  }

  function linkArea(areaId: AreaId) {
    setArea(areaId, "activo", true)
    toast.success("Área marcada para el bloque de fugas.")
  }

  function startNew(nextLead: DiagnosisLeadOption) {
    setState(leakMapFromLead(nextLead))
    setLead(nextLead)
    setCurrentId(null)
    setRevelado(false)
    setVista("consulta")
    setPickerOpen(false)
  }

  function attachLead(nextLead: DiagnosisLeadOption) {
    setLead(nextLead)
    setState((prev) => ({
      ...prev,
      snapshot: {
        ...prev.snapshot,
        cliente: prev.snapshot.cliente.trim() || nextLead.clientName,
        fecha: prev.snapshot.fecha || bogotaDateFromIso(nextLead.meetingTime),
        propiedades: prev.snapshot.propiedades || nextLead.properties,
        canales: prev.snapshot.canales || (nextLead.source === "airbnb" ? "Airbnb" : ""),
      },
    }))
    setPickerOpen(false)
  }

  function openPicker(mode: "new" | "link") {
    setPickerMode(mode)
    setPickerOpen(true)
  }

  async function handleSave() {
    const clientName = state.snapshot.cliente.trim()
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
      setRevelado(false)
      setVista("consulta")
      toast.success("Diagnóstico cargado.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se encontró ese diagnóstico.")
    }
  }

  const cliente = state.snapshot.cliente.trim()
  const areasActivas = state.areas.filter((area) => area.activo).length
  const pasosMarcados = state.trazas.reduce(
    (sum, traza) => sum + traza.pasos.filter((paso) => paso.estado !== "").length,
    0,
  )
  const meetingLabel = formatMeetingLabel(lead?.meetingTime ?? null)

  return (
    <Tabs value={vista} onValueChange={(value) => setVista(value as LeakMapVista)} className="gap-0">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur-md print:hidden">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Diagnóstico operativo
              </p>
              <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-2.5">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Mapa de fugas</h1>
                {cliente ? (
                  <span className="min-w-0 truncate text-sm text-muted-foreground">{cliente}</span>
                ) : null}
              </div>
              {lead ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {lead.source === "airbnb" ? "Airbnb" : "Inbound"}
                  {meetingLabel ? ` · ${meetingLabel}` : ""}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">Sin lead ligado</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <TabsList className="h-9">
                <TabsTrigger value="consulta" className="px-4">
                  Consulta
                </TabsTrigger>
                <TabsTrigger value="informe" className="px-4">
                  Informe
                </TabsTrigger>
              </TabsList>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
              <Button type="button" variant="ghost" size="sm" onClick={() => openPicker("link")}>
                <UserRound />
                {lead ? "Cambiar lead" : "Elegir lead"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => openPicker("new")}>
                <Plus />
                Nuevo
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
                <Printer />
                Imprimir
              </Button>
              <Button type="button" size="sm" onClick={() => void handleSave()} disabled={saving}>
                <Save />
                {saving ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>

          {vista === "consulta" ? (
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t py-3">
              {saved.length > 0 ? (
                <Select value={currentId ?? ""} onValueChange={(value) => void handleLoad(value)}>
                  <SelectTrigger size="sm" className="w-[22rem] max-w-full bg-background">
                    <SelectValue placeholder="Abrir un diagnóstico guardado" />
                  </SelectTrigger>
                  <SelectContent>
                    {saved.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.leadLabel || item.clientName}
                        <span className="text-muted-foreground">
                          {" · "}
                          {formatMeetingLabel(item.meetingTime) ?? shortDate(item.updatedAt)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Todavía no hay diagnósticos guardados.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                <HeaderStat label="Áreas" value={`${areasActivas}/8`} />
                <HeaderStat label="Pasos marcados" value={String(pasosMarcados)} />
                <HeaderStat label="Requerimientos" value={String(state.requerimientos.length)} />
                {revelado && calc.filas.length > 0 ? (
                  <HeaderStat label="Fuga anual" value={formatMoney(calc.total * 12)} accent />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12 print:max-w-none print:p-0">
        <TabsContent value="consulta" className="mt-0 print:hidden">
          <MapaDeFugasConsulta
            state={state}
            calc={calc}
            formatMoney={formatMoney}
            revelado={revelado}
            onReveal={() => setRevelado(true)}
            onSnapshot={setSnapshot}
            onConfig={setConfig}
            onArea={setArea}
            onCyclePaso={cyclePaso}
            onPasoNota={(trazaId, pasoId, nota) => patchPaso(trazaId, pasoId, { nota })}
            onCreateRequerimientoFromPaso={createRequerimientoFromPaso}
            onLinkArea={linkArea}
            onAddRequerimiento={addRequerimiento}
            onChangeRequerimiento={changeRequerimiento}
            onRemoveRequerimiento={removeRequerimiento}
          />
        </TabsContent>
        <TabsContent value="informe" className="mt-0 print:block">
          <MapaDeFugasInforme state={state} calc={calc} formatMoney={formatMoney} />
        </TabsContent>
      </div>

      <DiagnosticoLeadPicker
        open={pickerOpen}
        leads={leads}
        onOpenChange={setPickerOpen}
        onSelect={pickerMode === "new" ? startNew : attachLead}
      />
    </Tabs>
  )
}

function HeaderStat({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={cn("font-mono text-sm font-semibold", accent && "text-primary")}>
        {value}
      </span>
    </div>
  )
}

const SHORT_DATE = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "2-digit",
  month: "short",
})

function shortDate(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "" : SHORT_DATE.format(date)
}
