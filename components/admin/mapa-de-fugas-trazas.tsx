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
  type TrazaPasoDef,
  type TrazaPasoState,
  type TrazaState,
} from "@/lib/admin/leak-map"
import { cn } from "@/lib/utils"

const CIERRE_TEXTO =
  "¿Hay algo más en la operación que no esté en esta lista?"

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
      <Leyenda />

      {TRAZAS_BASE.map((def) => {
        const state = trazas.find((item) => item.id === def.id)
        const pasos = def.pasos.map((pasoDef) => ({
          def: pasoDef,
          state:
            state?.pasos.find((item) => item.id === pasoDef.id) ??
            ({ id: pasoDef.id, estado: "", nota: "", requerimientoId: null } as TrazaPasoState),
        }))
        const marcados = pasos.filter((item) => item.state.estado !== "")
        const fricciones = marcados.filter((item) => item.state.estado === "friccion").length
        const huecos = marcados.length - fricciones

        return (
          <section key={def.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h3 className="text-[15px] font-semibold tracking-tight">{def.nombre}</h3>
              <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {marcados.length === 0 ? (
                  <span>{def.pasos.length} pasos</span>
                ) : (
                  <>
                    {fricciones > 0 ? <span>{fricciones} fricción</span> : null}
                    {huecos > 0 ? <span>{huecos} hueco{huecos === 1 ? "" : "s"}</span> : null}
                  </>
                )}
              </div>
            </div>

            <ol className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {pasos.map((item, index) => (
                <li key={item.def.id} className="min-w-0">
                  <PasoBoton
                    index={index + 1}
                    label={item.def.label}
                    estado={item.state.estado}
                    onCycle={() => onCyclePaso(def.id, item.def.id)}
                  />
                </li>
              ))}
            </ol>

            {marcados.length > 0 ? (
              <div className="space-y-2.5 rounded-xl border bg-muted/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Detalle de lo marcado
                </p>
                {marcados.map((item) => (
                  <PasoDetalle
                    key={item.def.id}
                    pasoDef={item.def}
                    paso={item.state}
                    areaYaActiva={
                      item.def.areaId ? areaActiva.has(item.def.areaId) : false
                    }
                    onNota={(nota) => onPasoNota(def.id, item.def.id, nota)}
                    onCreateRequerimiento={() => onCreateRequerimiento(def.id, item.def.id)}
                    onLinkArea={() => item.def.areaId && onLinkArea(item.def.areaId)}
                  />
                ))}
              </div>
            ) : null}
          </section>
        )
      })}

      <div className="rounded-2xl border border-[#033160]/25 bg-[#033160]/[0.04] p-6 [print-color-adjust:exact] md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Otros puntos
        </p>
        <p className="mt-2 max-w-[52ch] text-base leading-relaxed font-medium">{CIERRE_TEXTO}</p>
        <Button type="button" className="mt-5" onClick={onAddRequerimientoBlanco}>
          <Plus />
          Agregar a la lista
        </Button>
      </div>
    </div>
  )
}

function Leyenda() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-muted/40 px-4 py-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Un clic marca fricción · Dos, hueco · Tres, limpia
      </span>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <PasoMarca estado="friccion" size="sm" />
          Fricción — lo hacen, mal
        </span>
        <span className="inline-flex items-center gap-2">
          <PasoMarca estado="hueco" size="sm" />
          Hueco — no existe
        </span>
      </div>
    </div>
  )
}

function PasoDetalle({
  pasoDef,
  paso,
  areaYaActiva,
  onNota,
  onCreateRequerimiento,
  onLinkArea,
}: {
  pasoDef: TrazaPasoDef
  paso: TrazaPasoState
  areaYaActiva: boolean
  onNota: (nota: string) => void
  onCreateRequerimiento: () => void
  onLinkArea: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background p-3">
      <div className="flex w-full min-w-0 items-center gap-2 sm:w-44 sm:shrink-0">
        <PasoMarca estado={paso.estado} size="sm" />
        <span className="truncate text-sm font-semibold">{pasoDef.label}</span>
      </div>

      <Input
        value={paso.nota}
        placeholder="¿Qué pasa aquí?"
        onChange={(event) => onNota(event.target.value)}
        className="h-9 min-w-[12rem] flex-1"
      />

      <div className="w-full sm:w-auto sm:shrink-0">
        {paso.estado === "hueco" ? (
          paso.requerimientoId ? (
            <p className="text-[11px] font-medium text-muted-foreground">Ya está en requerimientos</p>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onCreateRequerimiento}
            >
              Crear requerimiento
            </Button>
          )
        ) : null}

        {paso.estado === "friccion" && pasoDef.areaId ? (
          areaYaActiva ? (
            <p className="text-[11px] font-medium text-muted-foreground">
              Ya está en {areaNombre(pasoDef.areaId)}
            </p>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full max-w-full sm:w-auto"
              onClick={onLinkArea}
            >
              <span className="truncate">Anotar en {areaNombre(pasoDef.areaId)}</span>
            </Button>
          )
        ) : null}
      </div>
    </div>
  )
}

function areaNombre(id: AreaId) {
  return AREAS_BASE.find((area) => area.id === id)?.nombre ?? id
}

function PasoBoton({
  index,
  label,
  estado,
  onCycle,
}: {
  index: number
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
      aria-label={`Paso ${index}. ${label}. ${estadoLabel(estado)}. Clic para marcar ${nextLabel}.`}
      className={cn(
        "flex h-full min-h-[3.5rem] w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
        estado === "" && "border-border bg-background hover:border-foreground/30 hover:bg-muted/60",
        estado === "friccion" &&
          "border-destructive/45 bg-destructive/[0.07] hover:bg-destructive/[0.12]",
        estado === "hueco" && "border-[#033160]/50 bg-[#033160]/[0.07] hover:bg-[#033160]/[0.12]",
      )}
    >
      <PasoMarca estado={estado} />
      <span className="min-w-0 flex-1 text-sm leading-snug font-medium">{label}</span>
      <span
        aria-hidden
        className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/60"
      >
        {String(index).padStart(2, "0")}
      </span>
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
      className={cn("shrink-0 rounded-full border-2 border-muted-foreground/40 bg-background", box)}
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
