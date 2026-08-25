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
  return (
    <div className="space-y-3">
      {requerimientos.map((item) => (
        <RequerimientoFila
          key={item.id}
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
  item,
  formatMoney,
  onChange,
  onRemove,
}: {
  item: Requerimiento
  formatMoney: (value: number) => string
  onChange: (id: string, patch: Partial<Requerimiento>) => void
  onRemove: (id: string) => void
}) {
  const origen = item.origenPasoId ? pasoOrigenLabel(item.origenPasoId) : null
  const valor = parseFloat(item.valorMes) || 0

  return (
    <div className="space-y-3 rounded-xl border bg-background p-4">
      <div className="flex items-start gap-2">
        <Input
          value={item.nombre}
          placeholder="Nombre del requerimiento"
          onChange={(event) => onChange(item.id, { nombre: event.target.value })}
          className="text-base font-semibold"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Quitar requerimiento"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Qué no pueden hacer hoy</Label>
          <Textarea
            rows={2}
            value={item.queNoPueden}
            placeholder="La capacidad que no existe."
            onChange={(event) => onChange(item.id, { queNoPueden: event.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Impacto</Label>
          <OptionRow
            options={IMPACTO_OPTIONS}
            value={item.impacto}
            onChange={(value) => onChange(item.id, { impacto: value as RequerimientoImpacto | "" })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Valor estimado / mes</Label>
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

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Clasificación — se dice en la llamada</Label>
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
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
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
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
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
