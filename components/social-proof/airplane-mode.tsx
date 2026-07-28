"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Activity, BellOff, Plane, Wifi } from "lucide-react"
import { DashedGrid } from "@/components/landing/dashed-grid"
import { cn } from "@/lib/utils"
import { AIRPLANE } from "./content"
import { Reveal, SectionHeading } from "./primitives"

const TONE_STYLES: Record<string, { dot: string; badge: string }> = {
  cyan: { dot: "bg-cyan-400", badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" },
  emerald: { dot: "bg-emerald-400", badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  violet: { dot: "bg-violet-400", badge: "border-violet-500/30 bg-violet-500/10 text-violet-300" },
  amber: { dot: "bg-amber-400", badge: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
}

const FEED_SIZE = 5
const TICK_MS = 2600

type FeedItem = {
  key: number
  channel: string
  text: string
  tone: string
}

function buildItem(index: number): FeedItem {
  const source = AIRPLANE.events[index % AIRPLANE.events.length]
  return { key: index, channel: source.channel, text: source.text, tone: source.tone }
}

export function AirplaneModeSection() {
  const [airplaneOn, setAirplaneOn] = useState(true)
  const [cursor, setCursor] = useState(FEED_SIZE)

  useEffect(() => {
    const interval = window.setInterval(() => setCursor((value) => value + 1), TICK_MS)
    return () => window.clearInterval(interval)
  }, [])

  const items = Array.from({ length: FEED_SIZE }, (_, offset) => buildItem(cursor - offset - 1))

  return (
    <section id="modo-avion" className="relative scroll-mt-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(6,182,212,0.10),transparent_65%)]"
      />

      <DashedGrid gridId="sp-airplane" maxWidth="6xl" padding="px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow={AIRPLANE.badge}
          titleLead={AIRPLANE.titleLead}
          titleAccent={AIRPLANE.titleAccent}
          description={AIRPLANE.description}
          className="mb-14 md:mb-20"
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="flex justify-center">
            <PhoneMockup airplaneOn={airplaneOn} onToggle={() => setAirplaneOn((value) => !value)} />
          </Reveal>

          <Reveal delay={0.15}>
            <SystemFeed items={items} resolved={cursor} />
          </Reveal>
        </div>
      </DashedGrid>
    </section>
  )
}

type PhoneMockupProps = {
  airplaneOn: boolean
  onToggle: () => void
}

function PhoneMockup({ airplaneOn, onToggle }: PhoneMockupProps) {
  return (
    <div className="relative">
      <AnimatePresence>
        {!airplaneOn ? (
          <motion.span
            key="rings"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 -z-10"
          >
            {[0, 1, 2].map((ring) => (
              <motion.span
                key={ring}
                className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/25"
                animate={{ scale: [0.7, 1.9], opacity: [0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: ring * 1, ease: "easeOut" }}
              />
            ))}
          </motion.span>
        ) : null}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[280px] rounded-[2.75rem] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-3 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] motion-reduce:animate-none"
      >
        <div className="relative h-[520px] overflow-hidden rounded-[2.1rem] border border-zinc-800/80 bg-black">
          <div className="absolute left-1/2 top-3 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-zinc-900" />

          <div className="flex items-center justify-between px-6 pt-4 text-[11px] text-zinc-400">
            <span className="tabular-nums">9:41</span>
            <span className="flex items-center gap-1.5">
              {airplaneOn ? (
                <Plane className="h-3.5 w-3.5 text-cyan-400" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-zinc-500" />
              )}
              <span className="h-2 w-4 rounded-[2px] border border-zinc-600" />
            </span>
          </div>

          <div className="relative h-[calc(100%-120px)] px-5 pt-10">
            <AnimatePresence mode="wait">
              {airplaneOn ? (
                <motion.div
                  key="quiet"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col items-center justify-center gap-5 text-center"
                >
                  <motion.span
                    animate={{ rotate: [0, 4, 0, -4, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/30 bg-cyan-500/10"
                  >
                    <Plane className="h-8 w-8 text-cyan-400" />
                  </motion.span>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-white">Modo avión</p>
                    <p className="text-sm text-zinc-500">Sin notificaciones</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-[11px] text-zinc-400">
                    <BellOff className="h-3 w-3" />
                    La operación no te necesita
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="noisy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex h-full flex-col gap-2.5 pt-2"
                >
                  <p className="mb-1 text-[11px] uppercase tracking-wider text-zinc-600">
                    Resuelto sin ti
                  </p>
                  {AIRPLANE.events.slice(0, 5).map((event, index) => (
                    <motion.div
                      key={event.text}
                      initial={{ opacity: 0, y: -12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 backdrop-blur"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                        {event.channel}
                      </p>
                      <p className="mt-0.5 text-xs leading-snug text-zinc-300">{event.text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 bottom-0 border-t border-zinc-800/80 bg-zinc-950/80 px-5 py-4 backdrop-blur">
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={airplaneOn}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-1 text-left transition-opacity hover:opacity-90"
            >
              <span className="flex items-center gap-2.5">
                <Plane
                  className={cn(
                    "h-4 w-4 transition-colors",
                    airplaneOn ? "text-cyan-400" : "text-zinc-500"
                  )}
                />
                <span className="text-sm text-zinc-300">Modo avión</span>
              </span>
              <span
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300",
                  airplaneOn ? "bg-cyan-500" : "bg-zinc-700"
                )}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow",
                    airplaneOn ? "right-0.5" : "left-0.5"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

type SystemFeedProps = {
  items: FeedItem[]
  resolved: number
}

function SystemFeed({ items, resolved }: SystemFeedProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0D0D0F] to-[#141417] p-5 md:p-7">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-zinc-200">Sistema operando</span>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black/50 px-3 py-1 text-xs text-zinc-400">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span className="tabular-nums text-zinc-200">{resolved}</span> tareas resueltas
        </span>
      </div>

      <ul className="space-y-2.5">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => {
            const tone = TONE_STYLES[item.tone] ?? TONE_STYLES.cyan
            return (
              <motion.li
                key={item.key}
                layout
                initial={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                animate={{ opacity: 1 - index * 0.16, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-black/50 px-4 py-3.5"
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", tone.dot)} />
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    tone.badge
                  )}
                >
                  {item.channel}
                </span>
                <span className="truncate text-sm text-zinc-300">{item.text}</span>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>

      <p className="mt-6 border-t border-zinc-800/80 pt-5 text-sm leading-relaxed text-zinc-500">
        Todo esto ocurre mientras el teléfono está en silencio. Solo lo excepcional escala a una
        persona.
      </p>
    </div>
  )
}
