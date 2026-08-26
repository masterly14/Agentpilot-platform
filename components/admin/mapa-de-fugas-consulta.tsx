"use client"

import { useId, type HTMLInputTypeAttribute, type ReactNode } from "react"
import { ChevronDown, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
    <div className="space-y-12 md:space-y-16">
      <Section
        step="00"
        title="Snapshot de la operación"
        description="Los datos básicos con los que vas a trabajar durante la consulta."
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <LeakField
            label="Cliente"
            value={state.snapshot.cliente}
            onChange={(value) => onSnapshot("cliente", value)}
            placeholder="Nombre de la empresa"
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
            placeholder="0"
          />
          <LeakField
            label="Ciudades"
            value={state.snapshot.ciudades}
            onChange={(value) => onSnapshot("ciudades", value)}
            placeholder="Bogotá, Medellín…"
            className="sm:col-span-2"
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
            placeholder="0"
          />
          <LeakField
            label="ADR promedio"
            value={state.snapshot.adr}
            onChange={(value) => onSnapshot("adr", value)}
            placeholder="0"
          />
        </div>

        <div className="mt-8 rounded-xl border bg-muted/40 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Parámetros de cálculo
          </p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex min-w-[8rem] flex-col gap-2">
              <Label className="text-xs font-medium text-muted-foreground">Moneda</Label>
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
            <div className="flex min-w-[12rem] flex-col gap-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Costo por hora del equipo
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                value={state.config.tarifa}
                onChange={(event) => onConfig("tarifa", event.target.value)}
                className="bg-background"
              />
            </div>
            <p className="max-w-[32ch] text-sm leading-relaxed text-muted-foreground sm:pb-2">
              Salario mensual cargado ÷ 192 horas.
            </p>
          </div>
        </div>
      </Section>

      <Section
        step="01"
        title="Trazas operativas"
        description="Recorre el viaje del huésped, del dinero y de la propiedad, y marca dónde se traba."
      >
        <MapaDeFugasTrazas
          trazas={state.trazas}
          areas={state.areas}
          onCyclePaso={onCyclePaso}
          onPasoNota={onPasoNota}
          onCreateRequerimiento={onCreateRequerimientoFromPaso}
          onLinkArea={onLinkArea}
          onAddRequerimientoBlanco={onAddRequerimiento}
        />
      </Section>

      <Section
        step="02"
        title="Áreas operativas"
        description="Abre solo las áreas que estén en juego y cuantifica el tiempo que consumen."
        aside={
          <Badge variant="secondary" className="shrink-0">
            {activas} de 8 activas
          </Badge>
        }
      >
        <div className="space-y-3">
          {state.areas.map((area) => (
            <AreaFila
              key={area.id}
              area={area}
              formatMoney={formatMoney}
              tarifa={state.config.tarifa}
              onArea={onArea}
            />
          ))}
        </div>
      </Section>

      <Section
        step="03"
        title="Requerimientos estructurales"
        description="Capacidades que hoy no existen en la operación y que ningún ajuste de proceso resuelve."
        aside={
          reqCalc.count > 0 ? (
            <Badge variant="secondary" className="shrink-0">
              {reqCalc.cuantificados > 0
                ? `${reqCalc.count} · ${formatMoney(reqCalc.mes)}/mes`
                : `${reqCalc.count} sin cuantificar`}
            </Badge>
          ) : null
        }
      >
        <MapaDeFugasRequerimientos
          requerimientos={state.requerimientos}
          formatMoney={formatMoney}
          onAdd={onAddRequerimiento}
          onChange={onChangeRequerimiento}
          onRemove={onRemoveRequerimiento}
        />
      </Section>

      <Section
        step="04"
        title="La fuga"
        description="Estimación anual construida a partir de las áreas activas."
        padded={false}
      >
        {revelado ? (
          <Resultado calc={calc} formatMoney={formatMoney} />
        ) : (
          <button
            type="button"
            onClick={onReveal}
            className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center transition-colors hover:border-primary/60 hover:bg-primary/[0.03]"
          >
            <span className="flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
              <Eye className="size-4" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Ver estimación
            </span>
            <span className="font-mono text-3xl tracking-[0.25em] text-border select-none sm:text-4xl">
              ▓▓▓ ▓▓▓ ▓▓▓
            </span>
          </button>
        )}
      </Section>

      {calc.filas.length > 1 ? (
        <Section
          step="05"
          title="Priorización"
          description="Impacto contra velocidad de implementación. Arriba a la derecha va primero."
        >
          <Cuadrante filas={calc.filas} formatMoney={formatMoney} />
        </Section>
      ) : null}
    </div>
  )
}

function Section({
  step,
  title,
  description,
  aside,
  children,
  padded = true,
}: {
  step: string
  title: string
  description?: string
  aside?: ReactNode
  children: ReactNode
  padded?: boolean
}) {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-start gap-x-4 gap-y-3 md:mb-6">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.06] font-mono text-xs font-semibold text-primary">
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
          {description ? (
            <p className="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {aside ? <div className="mt-1 shrink-0">{aside}</div> : null}
      </div>

      {padded ? <Card className="gap-0 p-5 md:p-7">{children}</Card> : <div>{children}</div>}
    </section>
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
        "overflow-hidden rounded-xl border bg-background transition-colors",
        area.activo ? "border-primary/40 shadow-sm" : "hover:border-foreground/20",
      )}
    >
      <button
        type="button"
        onClick={() => onArea(area.id, "activo", !area.activo)}
        aria-pressed={area.activo}
        aria-expanded={area.activo}
        className="flex w-full items-center gap-3.5 px-5 py-4 text-left"
      >
        <span
          className={cn(
            "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
            area.activo
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background",
          )}
        >
          {area.activo ? (
            <span className="block size-1.5 rounded-full bg-primary-foreground" />
          ) : null}
        </span>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-[15px] font-semibold tracking-tight">{area.nombre}</p>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {area.modulo}
          </span>
        </div>

        {area.activo && horasMes > 0 ? (
          <Badge variant="secondary" className="hidden shrink-0 font-medium sm:inline-flex">
            {horasMes.toFixed(0)} h/mes · {formatMoney(directo + indirecto)}/mes
          </Badge>
        ) : null}

        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            area.activo && "rotate-180",
          )}
        />
      </button>

      {area.activo ? (
        <div className="space-y-7 border-t bg-muted/25 px-5 py-6">
          <p className="border-l-2 border-primary/60 pl-4 text-sm leading-relaxed text-muted-foreground italic">
            {area.pregunta}
          </p>

          <div className="space-y-4">
            <GroupLabel>Cómo funciona hoy</GroupLabel>
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <LeakField
                label="El proceso actual"
                value={area.hoy}
                onChange={(value) => onArea(area.id, "hoy", value)}
                placeholder="Cómo lo resuelven hoy, paso a paso."
                area
                className="sm:col-span-2 lg:col-span-3"
              />
              <LeakField
                label="Quién lo hace"
                value={area.quien}
                onChange={(value) => onArea(area.id, "quien", value)}
                placeholder="Rol o persona"
              />
              <div className="flex flex-col gap-2">
                <Label htmlFor={`tiempo-${area.id}`} className="text-xs font-medium text-muted-foreground">
                  Tiempo que consume
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
                    className="w-20 bg-background"
                  />
                  <span className="text-xs text-muted-foreground">h</span>
                  <Select
                    value={area.frecuencia}
                    onValueChange={(value) => onArea(area.id, "frecuencia", value)}
                  >
                    <SelectTrigger className="flex-1 bg-background">
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
            </div>
          </div>

          <div className="space-y-4">
            <GroupLabel>Impacto y costo</GroupLabel>
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Severidad</Label>
                <Escala
                  value={area.severidad}
                  onChange={(value) => onArea(area.id, "severidad", value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Velocidad de implementación
                </Label>
                <Escala
                  value={area.velocidad}
                  onChange={(value) => onArea(area.id, "velocidad", value)}
                  alt
                />
              </div>
            </div>
          </div>

          {directo > 0 || indirecto > 0 ? (
            <div className="flex h-9 overflow-hidden rounded-lg text-[11px] font-medium uppercase tracking-wide">
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

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {children}
      </span>
      <span aria-hidden className="h-px flex-1 bg-border" />
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
    <div className="rounded-2xl bg-gradient-to-br from-[#033160] to-[#021c38] p-7 text-white shadow-sm [print-color-adjust:exact] md:p-9">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
        Fuga anual estimada
      </p>
      <p className="mt-2 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
        {formatMoney(calc.total * 12)}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
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
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-white/55">
        {label}
      </span>
      <strong className="text-base leading-snug font-semibold">{value}</strong>
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
    <div className="flex gap-3">
      <span className="flex shrink-0 items-center justify-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">
        Mayor fuga →
      </span>

      <div className="min-w-0 flex-1">
        <div className="relative h-[380px] rounded-xl border bg-background">
          <div className="absolute top-0 right-0 h-1/2 w-1/2 rounded-tr-xl bg-primary/[0.04]" />
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-border" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />

          <span className="absolute top-3 right-4 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Atacar primero
          </span>
          <span className="absolute top-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Fase 2
          </span>
          <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Descartar
          </span>
          <span className="absolute right-4 bottom-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                <span className="size-2.5 shrink-0 rounded-full bg-destructive ring-4 ring-destructive/15" />
                <span className="rounded-md border bg-background/95 px-1.5 py-0.5 text-xs font-medium whitespace-nowrap shadow-sm">
                  {row.nombre}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>← Lento de implementar</span>
          <span>Rápido de implementar →</span>
        </div>
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
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={fieldId} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {area ? (
        <Textarea
          id={fieldId}
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[4.5rem] resize-y bg-background"
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
          className="bg-background"
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
            "size-9 rounded-lg border text-xs font-semibold transition-colors",
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
