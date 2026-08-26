"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { estadoLabel, PasoMarca, pasoOrigenLabel } from "@/components/admin/mapa-de-fugas-trazas"
import {
  calculateRequerimientos,
  CLASIFICACION_OPTIONS,
  CLASIFICACION_ORDER,
  clasificacionLabel,
  hasMarkedPasos,
  impactoLabel,
  TRAZAS_BASE,
  type LeakMapCalc,
  type LeakMapState,
  type Requerimiento,
  type RequerimientoClasificacion,
} from "@/lib/admin/leak-map"
import { cn } from "@/lib/utils"

function startSentence(rompe: string, horasMes: number) {
  const hours = `Recuperar esta área libera ${horasMes.toFixed(0)} horas al mes.`
  const trimmed = rompe.trim()
  if (!trimmed) return hours
  const head = /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
  return `${head} ${hours}`
}

type InformeProps = {
  state: LeakMapState
  calc: LeakMapCalc
  formatMoney: (value: number) => string
}

export function MapaDeFugasInforme({ state, calc, formatMoney }: InformeProps) {
  const snapshot = state.snapshot
  const top = calc.filas.slice(0, 3)
  const reqCalc = calculateRequerimientos(state.requerimientos)
  const marked = hasMarkedPasos(state.trazas)
  const empty = calc.filas.length === 0 && state.requerimientos.length === 0 && !marked

  if (empty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Todavía no hay hallazgos</CardTitle>
          <CardDescription>
            Completa las trazas y las áreas operativas en Consulta.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const grouped = groupRequerimientos(state.requerimientos)

  return (
    <article className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm print:max-w-none print:border-0 print:p-0 print:shadow-none md:p-12">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-foreground pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Diagnóstico operativo
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            {snapshot.cliente || "Cliente"}
          </h2>
        </div>
        <p className="text-right text-sm text-muted-foreground">
          {snapshot.fecha}
          {snapshot.propiedades ? (
            <>
              <br />
              {snapshot.propiedades} propiedades
              {snapshot.ciudades ? ` · ${snapshot.ciudades}` : ""}
            </>
          ) : null}
        </p>
      </div>

      <p className="mt-5 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
        Este documento recoge lo que revisamos juntos sobre la operación de{" "}
        {snapshot.cliente || "la empresa"}. Las fugas salen de los tiempos que reportaron y de un
        costo por hora de {formatMoney(parseFloat(state.config.tarifa) || 0)}. Los requerimientos
        estructurales son capacidades que hoy no existen. Donde hubo rango, se tomó el extremo
        bajo.
      </p>

      {marked ? (
        <>
          <h3 className="mt-10 mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Recorrido de la operación
          </h3>
          <InformeTrazas state={state} />
        </>
      ) : null}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-[#033160] to-[#021c38] p-7 text-white [print-color-adjust:exact]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Fuga anual estimada
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            {calc.filas.length > 0 ? formatMoney(calc.total * 12) : "—"}
          </p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-white/55">
            Costo actual medido
            {calc.filas.length > 0
              ? ` · ${calc.horas.toFixed(0)} h/mes · ${(calc.horas / 192).toFixed(1)} FTE`
              : " · sin áreas activas"}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-foreground p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Oportunidad estructural
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            {reqCalc.cuantificados > 0 ? `${formatMoney(reqCalc.mes * 12)} / año` : "Sin cuantificar"}
          </p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Ingreso o capacidad que hoy no existe
            {reqCalc.count > 0
              ? ` · ${reqCalc.count} requerimiento${reqCalc.count === 1 ? "" : "s"}`
              : ""}
            {reqCalc.cuantificados > 0 && reqCalc.cuantificados < reqCalc.count
              ? ` · ${reqCalc.cuantificados} con cifra`
              : ""}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Estas dos cifras no se suman. Una es lo que ya se gasta mal. La otra es lo que todavía no
        pueden hacer.
      </p>

      {calc.filas.length > 0 ? (
        <>
          <h3 className="mt-10 mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Dónde está la fuga
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área</TableHead>
                <TableHead className="hidden md:table-cell print:table-cell">Hoy</TableHead>
                <TableHead className="hidden md:table-cell print:table-cell">Qué se rompe</TableHead>
                <TableHead className="text-right">h/mes</TableHead>
                <TableHead className="text-right">Fuga anual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calc.filas.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-semibold whitespace-normal">{row.nombre}</TableCell>
                  <TableCell className="hidden max-w-[26ch] whitespace-normal text-muted-foreground md:table-cell print:table-cell">
                    {row.hoy || "—"}
                  </TableCell>
                  <TableCell className="hidden max-w-[26ch] whitespace-normal text-muted-foreground md:table-cell print:table-cell">
                    {row.rompe || "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono">{row.horasMes.toFixed(0)}</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-destructive">
                    {formatMoney(row.fugaMes * 12)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : null}

      {state.requerimientos.length > 0 ? (
        <>
          <h3 className="mt-10 mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Lo que hoy no pueden hacer
          </h3>
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.id}>
                <p className="mb-2 text-sm font-semibold">{group.label}</p>
                <ul className="space-y-3">
                  {group.items.map((item) => {
                    const origen = item.origenPasoId ? pasoOrigenLabel(item.origenPasoId) : null
                    const valor = parseFloat(item.valorMes) || 0
                    return (
                      <li key={item.id} className="border-l-2 border-foreground pl-3">
                        <p className="font-semibold">{item.nombre || "Sin nombre"}</p>
                        {item.queNoPueden ? (
                          <p className="mt-0.5 text-sm text-muted-foreground">{item.queNoPueden}</p>
                        ) : null}
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {impactoLabel(item.impacto) || "Impacto sin marcar"}
                          {valor > 0 ? ` · ${formatMoney(valor)}/mes` : ""}
                          {origen ? ` · ${origen}` : ""}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {top.length > 0 ? (
        <>
          <h3 className="mt-10 mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Por dónde empezar
          </h3>
          <ol className="space-y-5">
            {top.map((row, index) => (
              <li key={row.id} className="flex gap-4">
                <span className="pt-0.5 font-mono text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold">{row.nombre}</p>
                  <p className="mt-1 max-w-[64ch] text-sm text-muted-foreground">
                    {startSentence(row.rompe, row.horasMes)}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-primary">
                    Se resuelve con: {row.modulo}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      <div className="mt-9 border-t pt-6">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
          Siguiente paso
        </h3>
        <p className="max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
          En la próxima reunión mostramos{" "}
          {top[0]?.nombre.toLowerCase() ??
            state.requerimientos.find((item) => item.clasificacion === "base")?.nombre.toLowerCase() ??
            "el primer hallazgo"}{" "}
          funcionando con datos reales de {snapshot.cliente || "la operación"}, no con los de otro
          cliente. Para tenerlo listo necesitamos la información acordada antes de esa fecha.
        </p>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary">
          Agent Pilot · Real Estate Pilot
        </p>
      </div>
    </article>
  )
}

function groupRequerimientos(items: Requerimiento[]) {
  const groups: Array<{
    id: RequerimientoClasificacion | "sin"
    label: string
    items: Requerimiento[]
  }> = [
    ...CLASIFICACION_ORDER.map((id) => ({
      id,
      label: CLASIFICACION_OPTIONS.find((option) => option.id === id)?.label ?? id,
      items: items.filter((item) => item.clasificacion === id),
    })),
    {
      id: "sin",
      label: clasificacionLabel(""),
      items: items.filter((item) => !item.clasificacion),
    },
  ]
  return groups.filter((group) => group.items.length > 0)
}

function InformeTrazas({ state }: { state: LeakMapState }) {
  return (
    <div className="space-y-5">
      <p className="flex flex-wrap gap-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <PasoMarca estado="" size="sm" /> Sin marcar
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PasoMarca estado="friccion" size="sm" /> Fricción — lo hacen, mal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PasoMarca estado="hueco" size="sm" /> Hueco — no existe
        </span>
      </p>
      {TRAZAS_BASE.map((def) => {
        const traza = state.trazas.find((item) => item.id === def.id)
        return (
          <div key={def.id}>
            <p className="mb-2.5 text-sm font-semibold">{def.nombre}</p>
            <ol className="grid grid-cols-2 gap-2 md:grid-cols-4 print:grid-cols-4">
              {def.pasos.map((pasoDef) => {
                const paso = traza?.pasos.find((item) => item.id === pasoDef.id)
                const estado = paso?.estado ?? ""
                const broken = estado !== ""
                return (
                  <li
                    key={pasoDef.id}
                    className={cn(
                      "min-w-0 rounded-lg border px-2.5 py-2",
                      broken ? "border-foreground" : "border-dashed border-border",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <PasoMarca estado={estado} size="sm" />
                      <span
                        className={cn(
                          "min-w-0 text-xs leading-tight",
                          broken ? "font-semibold" : "text-muted-foreground",
                        )}
                      >
                        {pasoDef.label}
                      </span>
                    </div>
                    {broken ? (
                      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider">
                        {estadoLabel(estado)}
                        {paso?.nota ? ` · ${paso.nota}` : ""}
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </div>
  )
}
