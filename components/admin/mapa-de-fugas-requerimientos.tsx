"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { pasoOrigenLabel } from "@/components/admin/mapa-de-fugas-trazas"
import {
  CLASIFICACION_OPTIONS,
  IMPACTO_OPTIONS,
  type Requerimiento,
  type RequerimientoClasificacion,
  type RequerimientoImpacto,
} from "@/lib/admin/leak-map"
import { cn } from "@/lib/utils"

type RequerimientosProps = {
  requerimientos: Requerimiento[]
  formatMoney: (value: number) => string
  onAdd: () => void
  onChange: (id: string, patch: Partial<Requerimiento>) => void
  onRemove: (id: string) => void
}

export function MapaDeFugasRequerimientos({
  requerimientos,
  formatMoney,
  onAdd,
  onChange,
  onRemove,
}: RequerimientosProps) {
  if (requerimientos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-12 text-center">
        <p className="max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
          Aún no hay requerimientos. Marca un hueco en las trazas para traerlo aquí, o agrega uno a
          mano.
        </p>
        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus />
          Agregar requerimiento
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requerimientos.map((item, index) => (
        <RequerimientoFila
          key={item.id}
          index={index + 1}
          item={item}
          formatMoney={formatMoney}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}
      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus />
        Agregar requerimiento
      </Button>
    </div>
  )
}

function RequerimientoFila({
  index,
  item,
  formatMoney,
  onChange,
  onRemove,
}: {
  index: number
  item: Requerimiento
  formatMoney: (value: number) => string
  onChange: (id: string, patch: Partial<Requerimiento>) => void
  onRemove: (id: string) => void
}) {
  const origen = item.origenPasoId ? pasoOrigenLabel(item.origenPasoId) : null
  const valor = parseFloat(item.valorMes) || 0

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-semibold text-muted-foreground">
          {String(index).padStart(2, "0")}
        </span>
        <Input
          value={item.nombre}
          placeholder="Nombre del requerimiento"
          onChange={(event) => onChange(item.id, { nombre: event.target.value })}
          className="h-10 text-base font-semibold"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Quitar requerimiento"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 />
        </Button>
      </div>

      <div className="mt-5 grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Qué no pueden hacer hoy
          </Label>
          <Textarea
            rows={2}
            value={item.queNoPueden}
            placeholder="La capacidad que no existe."
            onChange={(event) => onChange(item.id, { queNoPueden: event.target.value })}
            className="min-h-[4.5rem] resize-y"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Impacto</Label>
          <OptionRow
            options={IMPACTO_OPTIONS}
            value={item.impacto}
            onChange={(value) => onChange(item.id, { impacto: value as RequerimientoImpacto | "" })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Valor estimado / mes</Label>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            value={item.valorMes}
            placeholder="Opcional"
            onChange={(event) => onChange(item.id, { valorMes: event.target.value })}
          />
          {valor > 0 ? (
            <p className="text-[11px] text-muted-foreground">{formatMoney(valor)} al mes</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Clasificación</Label>
          <OptionRow
            options={CLASIFICACION_OPTIONS}
            value={item.clasificacion}
            onChange={(value) =>
              onChange(item.id, { clasificacion: value as RequerimientoClasificacion | "" })
            }
            strong
          />
        </div>
      </div>

      {origen ? (
        <p className="mt-5 border-t pt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Origen: {origen}
        </p>
      ) : null}
    </div>
  )
}

function OptionRow({
  options,
  value,
  onChange,
  strong = false,
}: {
  options: Array<{ id: string; label: string }>
  value: string
  onChange: (value: string) => void
  strong?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? strong && option.id === "fuera"
                  ? "border-foreground bg-foreground text-background"
                  : "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
