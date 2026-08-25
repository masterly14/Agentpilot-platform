"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { formatVideoClock } from "@/lib/landing-video"
import type { VideoRetentionReport } from "@/lib/video-retention"

const chartConfig = {
  rate: { label: "Retención", color: "var(--chart-1)" },
} satisfies ChartConfig

const REASON_LABELS: Record<string, string> = {
  SCROLL: "Hizo scroll y salió",
  PAUSE: "Pausó y no volvió",
  TAB_HIDDEN: "Cambió de pestaña",
  PAGE_LEAVE: "Cerró la página",
  ENDED: "Terminó el video",
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

export function VideoRetentionCard({ data }: { data: VideoRetentionReport }) {
  const chartData = data.buckets.map((bucket) => ({
    ...bucket,
    percent: Math.round(bucket.rate * 100),
  }))

  return (
    <Card className="max-w-4xl">
      <CardHeader className="gap-4">
        <div className="space-y-1.5">
          <CardTitle>Retención del video</CardTitle>
          <CardDescription>
            En qué segundo se van los leads y qué porcentaje llega al final. El desbloqueo de la
            página ocurre en {formatVideoClock(data.unlockAtSeconds)}.
          </CardDescription>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Reproducciones" value={String(data.started)} />
          <Stat label="Visitantes" value={String(data.uniqueVisitors)} />
          <Stat
            label="Pasaron 1:17"
            value={data.started ? formatPercent(data.unlockRate) : "—"}
            hint={data.started ? `${data.unlocked} de ${data.started}` : undefined}
          />
          <Stat
            label="Lo terminaron"
            value={data.started ? formatPercent(data.completeRate) : "—"}
            hint={data.started ? `${data.completed} de ${data.started}` : undefined}
          />
        </div>

        {data.started === 0 ? (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Todavía no hay reproducciones. Cuando alguien pulse play en la landing, aquí veremos
            la curva de abandono.
          </p>
        ) : (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
            {data.medianDropSecond == null ? (
              "Todavía no hay abandonos: todos los que empezaron siguen adentro o terminaron."
            ) : (
              <>
                El abandono típico está en{" "}
                <span className="font-semibold text-foreground">
                  {formatVideoClock(data.medianDropSecond)}
                </span>
                .
              </>
            )}
            {data.dropReasons.length > 0 ? (
              <span className="text-muted-foreground">
                {" "}
                {data.dropReasons
                  .map((item) => `${REASON_LABELS[item.reason] ?? item.reason}: ${item.count}`)
                  .join(" · ")}
                .
              </span>
            ) : null}
          </p>
        )}
      </CardHeader>

      {chartData.length > 0 ? (
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <AreaChart data={chartData} margin={{ left: 8, right: 12, top: 8, bottom: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const bucket = item.payload as (typeof chartData)[number]
                      return (
                        <div className="flex min-w-[11rem] flex-1 items-center justify-between gap-6">
                          <span className="text-muted-foreground">Siguen viendo</span>
                          <span className="font-mono font-medium tabular-nums">
                            {Number(value)}% · {bucket.reached}
                          </span>
                        </div>
                      )
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="percent"
                name="Retención"
                stroke="var(--color-rate)"
                fill="var(--color-rate)"
                fillOpacity={0.18}
                strokeWidth={2}
              />
            </AreaChart>
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
