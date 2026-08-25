"use client"

import { useId, type HTMLInputTypeAttribute } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapaDeFugasRequerimientos } from "@/components/admin/mapa-de-fugas-requerimientos"
import { MapaDeFugasTrazas } from "@/components/admin/mapa-de-fugas-trazas"
import {
  areaHoursMonth,
  calculateRequerimientos,
  FRECUENCIAS,
  type AreaId,
  type AreaState,
  type LeakMapCalc,
  type LeakMapConfig,
  type LeakMapMoneda,
  type LeakMapSnapshot,
  type LeakMapState,
  type Requerimiento,
  type TrazaId,
} from "@/lib/admin/leak-map"
import { cn } from "@/lib/utils"

type ConsultaProps = {
  state: LeakMapState
  calc: LeakMapCalc
  formatMoney: (value: number) => string
  revelado: boolean
  onReveal: () => void
  onSnapshot: (key: keyof LeakMapSnapshot, value: string) => void
  onConfig: (key: keyof LeakMapConfig, value: string) => void
  onArea: (id: AreaState["id"], key: keyof AreaState, value: string | number | boolean) => void
  onCyclePaso: (trazaId: TrazaId, pasoId: string) => void
  onPasoNota: (trazaId: TrazaId, pasoId: string, nota: string) => void
  onCreateRequerimientoFromPaso: (trazaId: TrazaId, pasoId: string) => void
  onLinkArea: (areaId: AreaId) => void
  onAddRequerimiento: () => void
  onChangeRequerimiento: (id: string, patch: Partial<Requerimiento>) => void
  onRemoveRequerimiento: (id: string) => void
}

export function MapaDeFugasConsulta({
  state,
  calc,
  formatMoney,
  revelado,
  onReveal,
  onSnapshot,
  onConfig,
  onArea,
  onCyclePaso,
  onPasoNota,
  onCreateRequerimientoFromPaso,
  onLinkArea,
  onAddRequerimiento,
  onChangeRequerimiento,
  onRemoveRequerimiento,
}: ConsultaProps) {
  const activas = state.areas.filter((area) => area.activo).length
  const reqCalc = calculateRequerimientos(state.requerimientos)

  return (
    <div className="space-y-6 print:space-y-8">
      <Card>
        <CardHeader className="gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              00
            </span>
            <CardTitle>Snapshot de la operación</CardTitle>
            <CardDescription className="sm:ml-auto">
              Primeros 3 minutos. Contexto y calificación.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LeakField
              label="Cliente"
              value={state.snapshot.cliente}
              onChange={(value) => onSnapshot("cliente", value)}
              className="sm:col-span-2"
            />
            <LeakField
              label="Fecha"
              type="date"
              value={state.snapshot.fecha}
              onChange={(value) => onSnapshot("fecha", value)}
            />
            <LeakField
              label="Propiedades"
              value={state.snapshot.propiedades}
              onChange={(value) => onSnapshot("propiedades", value)}
            />
            <LeakField
              label="Ciudades"
              value={state.snapshot.ciudades}
              onChange={(value) => onSnapshot("ciudades", value)}
            />
            <LeakField
              label="Canales de venta"
              value={state.snapshot.canales}
              onChange={(value) => onSnapshot("canales", value)}
              placeholder="Airbnb, Booking, directo, corporativo…"
              className="sm:col-span-2"
            />
            <LeakField
              label="Equipo y roles"
              value={state.snapshot.equipo}
              onChange={(value) => onSnapshot("equipo", value)}
              placeholder="2 admin, 4 camareras, 1 mantenimiento…"
              className="sm:col-span-2"
            />
            <LeakField
              label="Software actual"
              value={state.snapshot.software}
              onChange={(value) => onSnapshot("software", value)}
              placeholder="Excel, WhatsApp, Guesty…"
              className="sm:col-span-2"
            />
            <LeakField
              label="Ocupación %"
              value={state.snapshot.ocupacion}
              onChange={(value) => onSnapshot("ocupacion", value)}
            />
            <LeakField
              label="ADR promedio"
              value={state.snapshot.adr}
              onChange={(value) => onSnapshot("adr", value)}
            />
          </div>

          <div className="flex flex-col gap-4 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-end">
            <div className="flex min-w-[140px] flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Moneda</Label>
              <Select
                value={state.config.moneda}
                onValueChange={(value) => onConfig("moneda", value as LeakMapMoneda)}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">COP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex min-w-[180px] flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Costo por hora del equipo</Label>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                value={state.config.tarifa}
                onChange={(event) => onConfig("tarifa", event.target.value)}
                className="bg-background"
              />
            </div>
            <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
              Calcúlalo con él: salario mensual cargado ÷ 192 horas. Si duda, usa el número bajo y
              dilo en voz alta.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              01
            </span>
            <CardTitle>Trazas operativas</CardTitle>
            <CardDescription className="sm:ml-auto">
              Recorre la operación con él. Un clic: fricción. Dos: hueco.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <MapaDeFugasTrazas
            trazas={state.trazas}
            areas={state.areas}
            onCyclePaso={onCyclePaso}
            onPasoNota={onPasoNota}
            onCreateRequerimiento={onCreateRequerimientoFromPaso}
            onLinkArea={onLinkArea}
            onAddRequerimientoBlanco={onAddRequerimiento}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              02
            </span>
            <CardTitle>Áreas operativas</CardTitle>
            <CardDescription className="sm:ml-auto">
              {activas === 0
                ? "Activa un área cuando él la mencione como problema."
                : `${activas} de 8 activas`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {state.areas.map((area) => (
            <AreaFila
              key={area.id}
              area={area}
              formatMoney={formatMoney}
              tarifa={state.config.tarifa}
              onArea={onArea}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              03
            </span>
            <CardTitle>Requerimientos estructurales</CardTitle>
            <CardDescription className="sm:ml-auto">
              {reqCalc.count === 0
                ? "Lo que no pueden hacer porque no tienen con qué."
                : reqCalc.cuantificados > 0
                  ? `${reqCalc.count} · ${formatMoney(reqCalc.mes)}/mes cuantificados`
                  : `${reqCalc.count} sin cuantificar`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <MapaDeFugasRequerimientos
            requerimientos={state.requerimientos}
            formatMoney={formatMoney}
            onAdd={onAddRequerimiento}
            onChange={onChangeRequerimiento}
            onRemove={onRemoveRequerimiento}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              04
            </span>
            <CardTitle>La fuga</CardTitle>
            <CardDescription className="sm:ml-auto">
              No lo reveles hasta el minuto 35.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {revelado ? (
            <Resultado calc={calc} formatMoney={formatMoney} />
          ) : (
            <button
              type="button"
              onClick={onReveal}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors hover:border-primary hover:bg-muted/40"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Revelar el número
              </span>
              <span className="font-mono text-3xl tracking-[0.2em] text-border sm:text-4xl">
                ▓▓▓ ▓▓▓ ▓▓▓
              </span>
            </button>
          )}
        </CardContent>
      </Card>

      {calc.filas.length > 1 ? (
        <Card>
          <CardHeader className="gap-1.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                05
              </span>
              <CardTitle>Priorización</CardTitle>
              <CardDescription className="sm:ml-auto">
                Impacto contra velocidad de implementación.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Cuadrante filas={calc.filas} formatMoney={formatMoney} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              La severidad la pone él. La velocidad la pones tú. Lo que cae arriba a la derecha es
              lo que le muestras en la demo.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function AreaFila({
  area,
  formatMoney,
  tarifa,
  onArea,
}: {
  area: AreaState
  formatMoney: (value: number) => string
  tarifa: string
  onArea: ConsultaProps["onArea"]
}) {
  const horasMes = areaHoursMonth(area.horas, area.frecuencia)
  const directo = horasMes * (parseFloat(tarifa) || 0)
  const indirecto = parseFloat(area.indirecto) || 0

  return (
    <div
      className={cn(
        "rounded-xl border bg-background",
        area.activo && "border-primary/40 ring-1 ring-primary/15",
      )}
    >
      <button
        type="button"
        onClick={() => onArea(area.id, "activo", !area.activo)}
        aria-pressed={area.activo}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
            area.activo
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background",
          )}
        >
          {area.activo ? (
            <span className="block size-1.5 rounded-full bg-primary-foreground" />
          ) : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{area.nombre}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-primary">
            {area.modulo}
          </p>
        </div>
        {area.activo && horasMes > 0 ? (
          <Badge variant="secondary" className="hidden shrink-0 font-medium sm:inline-flex">
            {horasMes.toFixed(0)} h/mes · {formatMoney(directo + indirecto)}/mes
          </Badge>
        ) : null}
      </button>

      {area.activo ? (
        <div className="space-y-4 border-t px-4 py-4">
          <p className="border-l-2 border-primary pl-3 text-sm leading-relaxed text-muted-foreground italic">
            {area.pregunta}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <LeakField
              label="Cómo lo hacen hoy"
              value={area.hoy}
              onChange={(value) => onArea(area.id, "hoy", value)}
              placeholder="Transcribe sus palabras, no las tuyas."
              area
              className="sm:col-span-2 lg:col-span-3"
            />
            <LeakField
              label="Quién lo hace"
              value={area.quien}
              onChange={(value) => onArea(area.id, "quien", value)}
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`tiempo-${area.id}`} className="text-xs text-muted-foreground">
                Tiempo
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`tiempo-${area.id}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={area.horas}
                  placeholder="0"
                  aria-label="Horas"
                  onChange={(event) => onArea(area.id, "horas", event.target.value)}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground">h</span>
                <Select
                  value={area.frecuencia}
                  onValueChange={(value) => onArea(area.id, "frecuencia", value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FRECUENCIAS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <LeakField
              label="Qué se rompe cuando falla"
              value={area.rompe}
              onChange={(value) => onArea(area.id, "rompe", value)}
              placeholder="Review perdida, propietario molesto, reserva no capturada, multa…"
              area
              className="sm:col-span-2 lg:col-span-3"
            />

            <LeakField
              label="Costo indirecto / mes"
              type="number"
              value={area.indirecto}
              onChange={(value) => onArea(area.id, "indirecto", value)}
              placeholder="0"
            />

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Severidad <span className="font-normal text-primary">— la pone él</span>
              </Label>
              <Escala
                value={area.severidad}
                onChange={(value) => onArea(area.id, "severidad", value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Velocidad de implementación{" "}
                <span className="font-normal text-primary">— la pones tú</span>
              </Label>
              <Escala
                value={area.velocidad}
                onChange={(value) => onArea(area.id, "velocidad", value)}
                alt
              />
            </div>
          </div>

          {directo > 0 || indirecto > 0 ? (
            <div className="flex h-8 overflow-hidden rounded-md text-[11px] font-medium uppercase tracking-wide">
              <div
                className="flex items-center bg-[#033160] px-3 text-white"
                style={{ flex: Math.max(directo, 1) }}
              >
                Directo {formatMoney(directo)}
              </div>
              {indirecto > 0 ? (
                <div
                  className="flex items-center bg-destructive px-3 text-white"
                  style={{ flex: indirecto }}
                >
                  Indirecto {formatMoney(indirecto)}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function Resultado({
  calc,
  formatMoney,
}: {
  calc: LeakMapCalc
  formatMoney: (value: number) => string
}) {
  return (
    <div className="rounded-xl bg-[#033160] p-6 text-white [print-color-adjust:exact]">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
        Fuga anual estimada
      </p>
      <p className="mt-1 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
        {formatMoney(calc.total * 12)}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 lg:grid-cols-4">
        <Dato label="Horas recuperables al mes" value={`${calc.horas.toFixed(0)} h`} />
        <Dato label="Costo directo anual" value={formatMoney(calc.directo * 12)} />
        <Dato label="Costo indirecto anual" value={formatMoney(calc.indirecto * 12)} />
        <Dato
          label="Equivale a"
          value={`${(calc.horas / 192).toFixed(1)} personas de tiempo completo`}
        />
      </div>
    </div>
  )
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-white/60">
        {label}
      </span>
      <strong className="text-base font-semibold">{value}</strong>
    </div>
  )
}

function Cuadrante({
  filas,
  formatMoney,
}: {
  filas: LeakMapCalc["filas"]
  formatMoney: (value: number) => string
}) {
  const max = Math.max(...filas.map((row) => row.fugaMes), 1)

  return (
    <div>
      <div className="relative h-[330px] rounded-xl border bg-background">
        <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-border" />
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
        <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Atacar primero
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Fase 2
        </span>
        <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Descartar
        </span>
        <span className="absolute right-3 bottom-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Oportunista
        </span>
        {filas.map((row) => {
          const x = ((row.velocidad - 1) / 4) * 82 + 9
          const y = 91 - (row.fugaMes / max) * 82
          return (
            <div
              key={row.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={`${row.nombre} · ${formatMoney(row.fugaMes)}/mes`}
            >
              <span className="size-2.5 shrink-0 rounded-full bg-destructive" />
              <span className="bg-background px-1 text-xs whitespace-nowrap">{row.nombre}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>← Lento de implementar</span>
        <span>Rápido de implementar →</span>
      </div>
    </div>
  )
}

function LeakField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  area = false,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: HTMLInputTypeAttribute
  area?: boolean
  className?: string
}) {
  const fieldId = useId()
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={fieldId} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {area ? (
        <Textarea
          id={fieldId}
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          id={fieldId}
          type={type}
          inputMode={type === "number" ? "decimal" : undefined}
          min={type === "number" ? 0 : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  )
}

function Escala({
  value,
  onChange,
  alt = false,
}: {
  value: number
  onChange: (value: number) => void
  alt?: boolean
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          aria-label={`Nivel ${level}`}
          aria-pressed={value >= level}
          onClick={() => onChange(level)}
          className={cn(
            "size-8 rounded-md border text-xs font-medium transition-colors",
            value >= level
              ? alt
                ? "border-[#033160] bg-[#033160] text-white"
                : "border-destructive bg-destructive text-white"
              : "border-input bg-background text-muted-foreground hover:bg-muted",
          )}
        >
          {level}
        </button>
      ))}
    </div>
  )
}
