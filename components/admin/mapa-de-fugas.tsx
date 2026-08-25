"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Printer, Save } from "lucide-react"
import { toast } from "sonner"
import { MapaDeFugasConsulta } from "@/components/admin/mapa-de-fugas-consulta"
import { MapaDeFugasInforme } from "@/components/admin/mapa-de-fugas-informe"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
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
  initialFecha?: string
}

export function MapaDeFugas({ initialSaved, initialFecha }: MapaDeFugasProps) {
  const router = useRouter()
  const [state, setState] = useState<LeakMapState>(() => {
    const empty = createEmptyLeakMap()
    if (initialFecha) empty.snapshot.fecha = initialFecha
    return empty
  })
  const [vista, setVista] = useState<LeakMapVista>("consulta")
  const [revelado, setRevelado] = useState(false)
  const [saved, setSaved] = useState(initialSaved)
  const [currentId, setCurrentId] = useState<string | null>(null)
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

  function reset() {
    setState(createEmptyLeakMap())
    setCurrentId(null)
    setRevelado(false)
    setVista("consulta")
  }

  async function handleSave() {
    const clientName = state.snapshot.cliente.trim()
    if (!clientName) {
      toast.error("Escribe el nombre del cliente antes de guardar.")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/admin/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentId, state }),
      })
      const payload = (await response.json()) as {
        error?: string
        diagnosis?: SavedDiagnosis
      }
      if (!response.ok || !payload.diagnosis) {
        throw new Error(payload.error ?? "No se pudo guardar.")
      }

      setCurrentId(payload.diagnosis.id)
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
      const payload = (await response.json()) as { error?: string; state?: unknown }
      if (!response.ok || payload.state == null) {
        throw new Error(payload.error ?? "No se encontró ese diagnóstico.")
      }
      setState(hydrateLeakMap(payload.state))
      setCurrentId(id)
      setRevelado(false)
      setVista("consulta")
      toast.success("Diagnóstico cargado.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se encontró ese diagnóstico.")
    }
  }

  return (
    <Tabs value={vista} onValueChange={(value) => setVista(value as LeakMapVista)} className="gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-4 print:hidden">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Diagnóstico operativo
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Mapa de fugas</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TabsList>
            <TabsTrigger value="consulta">Consulta</TabsTrigger>
            <TabsTrigger value="informe">Informe</TabsTrigger>
          </TabsList>
          <Button type="button" variant="outline" size="sm" onClick={() => void handleSave()} disabled={saving}>
            <Save />
            Guardar
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
            <Printer />
            Imprimir
          </Button>
        </div>
      </header>

      {saved.length > 0 && vista === "consulta" ? (
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Diagnósticos guardados
          </span>
          {saved.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void handleLoad(item.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                item.id === currentId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground",
              )}
            >
              {item.clientName}
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1">
              <Plus className="size-3.5" />
              Nuevo
            </span>
          </button>
        </div>
      ) : null}

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
    </Tabs>
  )
}
