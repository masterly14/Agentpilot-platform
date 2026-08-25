"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { FunnelFrictionBySource, FunnelSourceKey } from "@/lib/funnel-friction"

const SOURCE_FILTERS: { id: FunnelSourceKey; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "DIRECT_BOOKING", label: "Agendamiento" },
  { id: "DIAGNOSIS", label: "Diagnóstico" },
  { id: "EBOOK", label: "Guía" },
]

const chartConfig = {
  dropped: { label: "Abandonos", color: "var(--chart-1)" },
} satisfies ChartConfig

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

export function FunnelFrictionCard({ data }: { data: FunnelFrictionBySource }) {
  const [source, setSource] = useState<FunnelSourceKey>("all")
  const report = data[source]
  const bottleneckId = report.bottleneck?.id

  const chartData = useMemo(
    () =>
      report.steps.map((step) => ({
        ...step,
        dropPercent: Math.round(step.dropRate * 100),
        fill: step.id === bottleneckId ? "var(--chart-1)" : "var(--chart-3)",
      })),
    [bottleneckId, report.steps]
  )

  const chartHeight = Math.max(280, chartData.length * 42)

  return (
    <Card className="max-w-4xl">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Fricción del funnel</CardTitle>
            <CardDescription>
              Dónde se abandonan los formularios. El cuello de botella es el campo al que más
              gente llega y no completa.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1">
            {SOURCE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSource(filter.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  source === filter.id
                    ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {report.bottleneck ? (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
            El cuello de botella está en{" "}
            <span className="font-semibold text-foreground">{report.bottleneck.label}</span>
            : {report.bottleneck.dropped} de {report.bottleneck.reached} personas que llegaron a
            este campo lo abandonaron ({formatPercent(report.bottleneck.dropRate)}).
            {report.partialCount > 0 ? (
              <span className="text-muted-foreground">
                {" "}
                {report.partialCount} formulario{report.partialCount === 1 ? "" : "s"} incompleto
                {report.partialCount === 1 ? "" : "s"} en total.
              </span>
            ) : null}
          </p>
        ) : (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Todavía no hay abandonos de formulario para analizar. Cuando alguien deje un campo a
            medias, aquí veremos exactamente dónde se cae el funnel.
          </p>
        )}
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            No hay envíos en este origen todavía.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto w-full" style={{ height: chartHeight }}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 8, right: 48, top: 4, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis
                type="category"
                dataKey="label"
                width={128}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)" }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => {
                      const step = item.payload as (typeof chartData)[number]
                      return (
                        <div className="flex min-w-[12rem] flex-1 items-center justify-between gap-6">
                          <span className="text-muted-foreground">Abandonos</span>
                          <span className="font-mono font-medium tabular-nums">
                            {Number(value)} de {step.reached} ({step.dropPercent}%)
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar dataKey="dropped" name="Abandonos" radius={4} maxBarSize={28}>
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="dropped"
                  position="right"
                  className="fill-foreground"
                  fontSize={11}
                  formatter={(value: unknown) => (Number(value) > 0 ? String(value) : "")}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
