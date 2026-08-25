"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AREAS_BASE,
  findPasoDef,
  nextPasoEstado,
  TRAZAS_BASE,
  type AreaId,
  type AreaState,
  type PasoEstado,
  type TrazaId,
  type TrazaState,
} from "@/lib/admin/leak-map"
import { cn } from "@/lib/utils"

const CIERRE_TEXTO =
  "Todo lo que anoté acá es lo que yo sé mirar. ¿Qué hay en tu operación que no te pregunté y que debería estar en esta lista?"

type TrazasProps = {
  trazas: TrazaState[]
  areas: AreaState[]
  onCyclePaso: (trazaId: TrazaId, pasoId: string) => void
  onPasoNota: (trazaId: TrazaId, pasoId: string, nota: string) => void
  onCreateRequerimiento: (trazaId: TrazaId, pasoId: string) => void
  onLinkArea: (areaId: AreaId) => void
  onAddRequerimientoBlanco: () => void
}

export function MapaDeFugasTrazas({
  trazas,
  areas,
  onCyclePaso,
  onPasoNota,
  onCreateRequerimiento,
  onLinkArea,
  onAddRequerimientoBlanco,
}: TrazasProps) {
  const areaActiva = new Set(areas.filter((area) => area.activo).map((area) => area.id))

  return (
    <div className="space-y-8">
      {TRAZAS_BASE.map((def) => {
        const state = trazas.find((item) => item.id === def.id)
        return (
          <div key={def.id} className="space-y-3">
            <h3 className="text-sm font-semibold">{def.nombre}</h3>
            <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start">
              {def.pasos.map((pasoDef, index) => {
                const paso = state?.pasos.find((item) => item.id === pasoDef.id) ?? {
                  id: pasoDef.id,
                  estado: "" as const,
                  nota: "",
                  requerimientoId: null,
                }
                return (
                  <li key={pasoDef.id} className="flex min-w-0 items-start sm:max-w-[11rem]">
                    {index > 0 ? (
                      <span
                        aria-hidden
                        className="mt-5 hidden px-1 text-sm text-muted-foreground sm:inline"
                      >
                        →
                      </span>
                    ) : null}
                    <div className="flex min-w-0 flex-1 gap-2 sm:flex-col">
                      {index > 0 ? (
                        <div aria-hidden className="flex w-5 shrink-0 flex-col items-center sm:hidden">
                          <div className="w-px flex-1 bg-border" />
                          <span className="text-[10px] text-muted-foreground">↓</span>
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1 space-y-2">
                        <PasoBoton
                          label={pasoDef.label}
                          estado={paso.estado}
                          onCycle={() => onCyclePaso(def.id, pasoDef.id)}
                        />
                        {paso.estado ? (
                          <div className="space-y-2">
                            <Input
                              value={paso.nota}
                              placeholder="Una línea. Lo que dijo."
                              onChange={(event) =>
                                onPasoNota(def.id, pasoDef.id, event.target.value)
                              }
                              className="h-8 bg-background text-sm"
                            />
                            {paso.estado === "hueco" ? (
                              paso.requerimientoId ? (
                                <p className="text-[11px] font-medium text-muted-foreground">
                                  Ya está en requerimientos.
                                </p>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => onCreateRequerimiento(def.id, pasoDef.id)}
                                >
                                  Crear requerimiento
                                </Button>
                              )
                            ) : null}
                            {paso.estado === "friccion" && pasoDef.areaId ? (
                              areaActiva.has(pasoDef.areaId) ? (
                                <p className="text-[11px] font-medium text-muted-foreground">
                                  Ya está en {areaNombre(pasoDef.areaId)}.
                                </p>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => onLinkArea(pasoDef.areaId!)}
                                >
                                  Anotar en {areaNombre(pasoDef.areaId)}
                                </Button>
                              )
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}

      <div className="rounded-xl border-2 border-[#033160] bg-background p-5 [print-color-adjust:exact]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          Pregunta de cierre
        </p>
        <p className="mt-2 text-base leading-relaxed font-medium">{CIERRE_TEXTO}</p>
        <Button type="button" className="mt-4" onClick={onAddRequerimientoBlanco}>
          <Plus />
          Agregar a la lista
        </Button>
      </div>
    </div>
  )
}

function areaNombre(id: AreaId) {
  return AREAS_BASE.find((area) => area.id === id)?.nombre ?? id
}

function PasoBoton({
  label,
  estado,
  onCycle,
}: {
  label: string
  estado: PasoEstado
  onCycle: () => void
}) {
  const next = nextPasoEstado(estado)
  const nextLabel = next === "friccion" ? "fricción" : next === "hueco" ? "hueco" : "sin marcar"

  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`${label}. ${estadoLabel(estado)}. Clic para marcar ${nextLabel}.`}
      className={cn(
        "flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-lg border-2 px-2.5 py-2 text-left transition-colors sm:min-h-[4.25rem] sm:flex-col sm:justify-center sm:px-2",
        estado === "" && "border-input bg-background hover:border-foreground/40",
        estado === "friccion" && "border-destructive bg-destructive/10 hover:bg-destructive/15",
        estado === "hueco" && "border-[#033160] bg-[#033160]/10 hover:bg-[#033160]/15",
      )}
    >
      <PasoMarca estado={estado} />
      <span className="text-sm leading-tight font-semibold">{label}</span>
    </button>
  )
}

export function PasoMarca({ estado, size = "md" }: { estado: PasoEstado; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-3.5" : "size-4"
  if (estado === "friccion") {
    return (
      <span
        className={cn("shrink-0 rounded-full bg-destructive", box)}
        title="Fricción"
        aria-hidden
      />
    )
  }
  if (estado === "hueco") {
    return (
      <span
        className={cn(
          "relative shrink-0 border-2 border-[#033160] bg-background",
          box,
        )}
        title="Hueco"
        aria-hidden
      >
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none text-[#033160]">
          ×
        </span>
      </span>
    )
  }
  return (
    <span
      className={cn("shrink-0 rounded-full border-2 border-muted-foreground/50 bg-background", box)}
      title="Sin marcar"
      aria-hidden
    />
  )
}

export function estadoLabel(estado: PasoEstado) {
  if (estado === "friccion") return "Fricción"
  if (estado === "hueco") return "Hueco"
  return "Sin marcar"
}

export function pasoOrigenLabel(pasoId: string) {
  const found = findPasoDef(pasoId)
  if (!found) return null
  return `${found.traza.nombre} · ${found.paso.label}`
}
