"use client"

import { useMemo, useState } from "react"
import { useSheetSelection } from "@/components/admin/use-sheet-selection"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { toast } from "sonner"
import { Calendar, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CloseDealDialog } from "@/components/admin/close-deal-dialog"
import { AirbnbLeadSheet } from "@/components/admin/airbnb-lead-sheet"
import { KanbanColumn, formatMeetingLabel } from "@/components/admin/kanban-parts"
import type { AirbnbLeadRecord } from "@/lib/admin/airbnb-lead-record"
import {
  AIRBNB_COLUMNS,
  canDropOnAirbnbStage,
  isAirbnbCardDraggable,
  isAirbnbBoardLead,
} from "@/lib/admin/airbnb-funnel"
import type { AirbnbCommercialStage, ContractPlan } from "@/prisma/generated/client"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function AirbnbKanbanCard({
  lead,
  isUpdating,
  onOpen,
  onShowUp,
  onNoShow,
  onCloseDeal,
}: {
  lead: AirbnbLeadRecord
  isUpdating: boolean
  onOpen: () => void
  onShowUp: () => void
  onNoShow: () => void
  onCloseDeal: () => void
}) {
  const draggable = isAirbnbCardDraggable(lead.stage)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    disabled: !draggable,
  })
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const meeting = formatMeetingLabel(lead.meetingTime)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-border bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        isDragging && "opacity-40",
        isUpdating && "opacity-60",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="flex min-w-0 items-start gap-2.5 text-left">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
            {initials(lead.name)}
          </span>
          <span className="min-w-0">
            <p className="truncate text-sm font-semibold hover:underline">{lead.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {lead.market ?? "Sin mercado"} · {lead.totalProperties} props
            </p>
          </span>
        </button>
        {draggable ? (
          <button
            type="button"
            className="rounded p-1 text-muted-foreground hover:bg-muted"
            aria-label="Arrastrar tarjeta"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <button type="button" onClick={onOpen} className="mb-3 flex w-full flex-wrap items-center gap-2 text-left">
        {lead.status === "HUMAN_TAKEOVER" ? (
          <Badge variant="destructive" className="rounded-full text-[10px]">
            Handoff
          </Badge>
        ) : null}
        {meeting ? (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {meeting}
          </span>
        ) : null}
      </button>
      {lead.stage === "SCHEDULED" ? (
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" size="sm" disabled={isUpdating} onClick={onShowUp}>
            Asistió
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={isUpdating} onClick={onNoShow}>
            No asistió
          </Button>
        </div>
      ) : null}
      {lead.stage === "SHOWED_UP" ? (
        <Button type="button" size="sm" className="w-full" disabled={isUpdating} onClick={onCloseDeal}>
          Cerrar trato
        </Button>
      ) : null}
    </div>
  )
}

type AirbnbKanbanProps = {
  initialLeads: AirbnbLeadRecord[]
  initialSelectedId?: string | null
  onSelectedIdChange?: (id: string | null) => void
}

export function AirbnbKanban({
  initialLeads,
  initialSelectedId = null,
  onSelectedIdChange,
}: AirbnbKanbanProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [query, setQuery] = useState("")
  const [market, setMarket] = useState("all")
  const [activeId, setActiveId] = useState<string | null>(null)
  const { selectedId, setSelectedId, onOpenChange } = useSheetSelection(
    initialSelectedId,
    onSelectedIdChange,
  )
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [closeLeadId, setCloseLeadId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const markets = useMemo(() => {
    return [...new Set(leads.map((lead) => lead.market).filter(Boolean))] as string[]
  }, [leads])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return leads.filter((lead) => {
      if (!isAirbnbBoardLead(lead.stage)) return false
      if (market !== "all" && lead.market !== market) return false
      if (!needle) return true
      return (
        lead.name.toLowerCase().includes(needle) ||
        (lead.companyName?.toLowerCase().includes(needle) ?? false) ||
        (lead.hostEmail?.toLowerCase().includes(needle) ?? false)
      )
    })
  }, [leads, market, query])

  const byStage = useMemo(() => {
    const grouped = Object.fromEntries(
      AIRBNB_COLUMNS.map((column) => [column.id, [] as AirbnbLeadRecord[]]),
    ) as Record<AirbnbCommercialStage, AirbnbLeadRecord[]>
    for (const lead of visible) {
      if (lead.stage) grouped[lead.stage].push(lead)
    }
    return grouped
  }, [visible])

  const selected = selectedId ? leads.find((lead) => lead.id === selectedId) ?? null : null
  const closing = closeLeadId ? leads.find((lead) => lead.id === closeLeadId) ?? null : null
  const active = activeId ? leads.find((lead) => lead.id === activeId) ?? null : null

  function applyLead(next: AirbnbLeadRecord) {
    setLeads((current) => current.map((lead) => (lead.id === next.id ? next : lead)))
  }

  async function postStage(path: string, id: string, extra?: Record<string, unknown>) {
    const previous = leads.find((item) => item.id === id)
    if (!previous) return
    setUpdatingId(id)
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airbnbLeadId: id, ...extra }),
      })
      const payload = (await res.json().catch(() => null)) as { lead?: AirbnbLeadRecord; error?: string } | null
      if (!res.ok) throw new Error(payload?.error ?? "No se pudo actualizar")
      if (payload?.lead) applyLead(payload.lead)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active: dragged, over } = event
    setActiveId(null)
    if (!over) return
    const id = String(dragged.id)
    const nextStage = String(over.id) as AirbnbCommercialStage
    const lead = leads.find((item) => item.id === id)
    if (!lead || !canDropOnAirbnbStage(lead.stage, nextStage)) return
    if (nextStage === "PURCHASED") {
      setCloseLeadId(id)
      return
    }
    if (nextStage === "SHOWED_UP") {
      await postStage("/api/admin/airbnb/attend", id)
      toast.success("Marcado como show-up")
      return
    }
    if (nextStage === "NO_SHOW") {
      await postStage("/api/admin/airbnb/no-show", id)
      toast.success("Marcado como no-show")
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o correo"
            className="max-w-sm bg-white"
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setMarket("all")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                market === "all"
                  ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-white/70",
              )}
            >
              Todos los mercados
            </button>
            {markets.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMarket(item)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  market === item
                    ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-white/70",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full bg-muted text-foreground">
          {visible.length} en cola
        </Badge>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event: DragStartEvent) => setActiveId(String(event.active.id))}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex min-h-[70vh] gap-4 pb-4">
            {AIRBNB_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                count={byStage[column.id as AirbnbCommercialStage].length}
              >
                {byStage[column.id as AirbnbCommercialStage].map((lead) => (
                  <AirbnbKanbanCard
                    key={lead.id}
                    lead={lead}
                    isUpdating={updatingId === lead.id}
                    onOpen={() => setSelectedId(lead.id)}
                    onShowUp={() => void postStage("/api/admin/airbnb/attend", lead.id).then(() => toast.success("Marcado como show-up"))}
                    onNoShow={() => void postStage("/api/admin/airbnb/no-show", lead.id).then(() => toast.success("Marcado como no-show"))}
                    onCloseDeal={() => setCloseLeadId(lead.id)}
                  />
                ))}
              </KanbanColumn>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DragOverlay>
          {active ? (
            <div className="w-[280px] rounded-xl border bg-white p-4 shadow-lg">
              <p className="font-semibold">{active.name}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AirbnbLeadSheet
        lead={selected}
        open={selected !== null}
        isUpdating={selected ? updatingId === selected.id : false}
        onOpenChange={onOpenChange}
        onShowUp={() => selected && void postStage("/api/admin/airbnb/attend", selected.id).then(() => toast.success("Marcado como show-up"))}
        onNoShow={() => selected && void postStage("/api/admin/airbnb/no-show", selected.id).then(() => toast.success("Marcado como no-show"))}
        onCloseDeal={() => selected && setCloseLeadId(selected.id)}
        onUpdated={(next) => {
          applyLead(next)
          toast.success("Lead actualizado")
        }}
      />

      <CloseDealDialog
        open={closing !== null}
        leadName={closing?.name ?? "este host"}
        isSubmitting={Boolean(closeLeadId && updatingId === closeLeadId)}
        onOpenChange={(open) => {
          if (!open) setCloseLeadId(null)
        }}
        onConfirm={async (input: { contractValueUsd: number; contractPlan: ContractPlan }) => {
          if (!closeLeadId) return
          await postStage("/api/admin/airbnb/close", closeLeadId, input)
          setCloseLeadId(null)
          toast.success("Trato cerrado")
        }}
      />
    </>
  )
}
