"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
import type { AdLandingReport } from "@/lib/ad-landing"

const chartConfig = {
  dropped: { label: "Sin conversión", color: "var(--chart-1)" },
} satisfies ChartConfig

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

export function AdLandingCard({ data }: { data: AdLandingReport }) {
  const chartData = data.lanes
    .filter((lane) => lane.visits > 0)
    .map((lane) => ({
      ...lane,
      dropPercent: Math.round(lane.dropRate * 100),
    }))
  const chartHeight = Math.max(180, chartData.length * 56)

  return (
    <Card className="max-w-4xl">
      <CardHeader className="gap-4">
        <div className="space-y-1.5">
          <CardTitle>Anuncios sin conversión</CardTitle>
          <CardDescription>
            Quién llegó desde un anuncio a Guía o Diagnóstico y no descargó ni agendó. Es la
            brecha entre PageView y Lead / Schedule.
          </CardDescription>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Visitas de anuncio" value={String(data.visits)} />
          <Stat
            label="Convirtieron"
            value={String(data.converted)}
            hint={data.visits ? `${formatPercent(1 - data.dropRate)}` : undefined}
          />
          <Stat label="No convirtieron" value={String(data.dropped)} />
          <Stat
            label="Sin conversión"
            value={data.visits ? formatPercent(data.dropRate) : "—"}
          />
        </div>

        {data.visits === 0 ? (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Todavía no hay visitas de anuncio registradas. Cuando alguien entre a Guía o
            Diagnóstico desde un anuncio, aquí veremos cuántos se van sin descargar ni agendar.
          </p>
        ) : data.bottleneck ? (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
            El mayor hueco está en{" "}
            <span className="font-semibold text-foreground">{data.bottleneck.label}</span>
            : {data.bottleneck.dropped} de {data.bottleneck.visits}{" "}
            {data.bottleneck.unconvertedLabel} ({formatPercent(data.bottleneck.dropRate)}).
            {data.dropped > 0 ? (
              <span className="text-muted-foreground">
                {" "}
                En total, {data.dropped} de {data.visits} visitas de anuncio no convirtieron.
              </span>
            ) : (
              <span className="text-muted-foreground"> Todas las visitas de anuncio convirtieron.</span>
            )}
          </p>
        ) : null}
      </CardHeader>

      {chartData.length > 0 ? (
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: chartHeight }}
          >
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
                width={112}
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
                      const lane = item.payload as (typeof chartData)[number]
                      return (
                        <div className="flex min-w-[14rem] flex-1 items-center justify-between gap-6">
                          <span className="text-muted-foreground">{lane.unconvertedLabel}</span>
                          <span className="font-mono font-medium tabular-nums">
                            {Number(value)} de {lane.visits} ({lane.dropPercent}%)
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Bar dataKey="dropped" name="Sin conversión" fill="var(--color-dropped)" radius={4} maxBarSize={28}>
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
        </CardContent>
      ) : null}
    </Card>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
