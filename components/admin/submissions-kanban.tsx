"use client"

import { useMemo, useState } from "react"
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
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CloseDealDialog } from "@/components/admin/close-deal-dialog"
import { SubmissionDetailSheet } from "@/components/admin/submission-detail-sheet"
import { KanbanCard, KanbanColumn } from "@/components/admin/kanban-parts"
import {
  FUNNEL_COLUMNS,
  canDropOnFunnelStage,
  isInboxLead,
} from "@/lib/marketing/funnel-ui"
import type { SubmissionRecord } from "@/lib/submission-display"
import { ENTRY_SOURCE_LABEL, QUALIFICATION_LABEL, getSubmissionTitle } from "@/lib/submission-display"
import type { ContractPlan, LeadEntrySource, LeadQualification, MarketingFunnelStage } from "@/prisma/generated/client"
import { cn } from "@/lib/utils"

type BoardFilter =
  | "all"
  | LeadQualification
  | LeadEntrySource

const FILTERS: Array<{ id: BoardFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "SQL", label: "SQL" },
  { id: "MQL", label: "MQL" },
  { id: "EBOOK", label: "Guía" },
  { id: "DIAGNOSIS", label: "Diagnóstico" },
  { id: "DIRECT_BOOKING", label: "Directo" },
]

type SubmissionsKanbanProps = {
  initialSubmissions: SubmissionRecord[]
  initialSelectedId?: string | null
}

export function SubmissionsKanban({
  initialSubmissions,
  initialSelectedId = null,
}: SubmissionsKanbanProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [filter, setFilter] = useState<BoardFilter>("all")
  const [showInbox, setShowInbox] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [closeLeadId, setCloseLeadId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const visible = useMemo(() => {
    return submissions.filter((submission) => {
      if (filter === "all") return true
      if (filter === "SQL" || filter === "MQL" || filter === "DISQUALIFIED") {
        return submission.qualification === filter
      }
      return submission.entrySource === filter
    })
  }, [filter, submissions])

  const inbox = visible.filter((submission) => isInboxLead(submission))
  const pipeline = visible.filter((submission) => !isInboxLead(submission))

  const submissionsByStage = useMemo(() => {
    const grouped = Object.fromEntries(
      FUNNEL_COLUMNS.map((column) => [column.id, [] as SubmissionRecord[]]),
    ) as Record<MarketingFunnelStage, SubmissionRecord[]>

    for (const submission of pipeline) {
      const stage = submission.marketingFunnelStage
      if (stage) grouped[stage].push(submission)
    }

    return grouped
  }, [pipeline])

  const activeSubmission = activeId
    ? submissions.find((submission) => submission.id === activeId) ?? null
    : null
  const selectedSubmission = selectedId
    ? submissions.find((submission) => submission.id === selectedId) ?? null
    : null
  const closingLead = closeLeadId
    ? submissions.find((submission) => submission.id === closeLeadId) ?? null
    : null

  function applySubmission(next: SubmissionRecord) {
    setSubmissions((current) =>
      current.map((submission) => (submission.id === next.id ? next : submission)),
    )
  }

  async function markShowUp(id: string) {
    const previous = submissions.find((item) => item.id === id)
    if (!previous) return
    setUpdatingId(id)
    setSubmissions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, marketingFunnelStage: "SHOWED_UP" } : item,
      ),
    )
    try {
      const res = await fetch("/api/admin/pipeline/attend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id }),
      })
      if (!res.ok) throw new Error("No se pudo marcar show-up")
      const data = (await res.json()) as { submission?: SubmissionRecord }
      if (data.submission) applySubmission(data.submission)
      toast.success("Marcado como show-up")
    } catch (error) {
      setSubmissions((current) =>
        current.map((item) => (item.id === id && previous ? previous : item)),
      )
      toast.error(error instanceof Error ? error.message : "No se pudo marcar show-up")
    } finally {
      setUpdatingId(null)
    }
  }

  async function markNoShow(id: string) {
    const previous = submissions.find((item) => item.id === id)
    if (!previous) return
    setUpdatingId(id)
    setSubmissions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, marketingFunnelStage: "NO_SHOW" } : item,
      ),
    )
    try {
      const res = await fetch("/api/admin/pipeline/no-show", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id }),
      })
      if (!res.ok) throw new Error("No se pudo marcar no-show")
      const data = (await res.json()) as { submission?: SubmissionRecord }
      if (data.submission) applySubmission(data.submission)
      toast.success("Marcado como no-show")
    } catch (error) {
      setSubmissions((current) =>
        current.map((item) => (item.id === id && previous ? previous : item)),
      )
      toast.error(error instanceof Error ? error.message : "No se pudo marcar no-show")
    } finally {
      setUpdatingId(null)
    }
  }

  async function closeDeal(
    id: string,
    input: { contractValueUsd: number; contractPlan: ContractPlan },
  ) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CLOSED_WON",
          contractValueUsd: input.contractValueUsd,
          contractPlan: input.contractPlan,
        }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error ?? "No se pudo cerrar el trato")
      }
      const data = (await res.json()) as { submission?: SubmissionRecord }
      if (data.submission) applySubmission(data.submission)
      setCloseLeadId(null)
      toast.success("Trato cerrado")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cerrar el trato")
    } finally {
      setUpdatingId(null)
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const submissionId = String(active.id)
    const nextStage = String(over.id) as MarketingFunnelStage
    const submission = submissions.find((item) => item.id === submissionId)
    if (!submission) return
    if (!canDropOnFunnelStage(submission.marketingFunnelStage, nextStage)) return

    if (nextStage === "PURCHASED") {
      setCloseLeadId(submissionId)
      return
    }
    if (nextStage === "SHOWED_UP") {
      await markShowUp(submissionId)
      return
    }
    if (nextStage === "NO_SHOW") {
      await markNoShow(submissionId)
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              Confirma show-up y cierres. Las primeras columnas se mueven solas.
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full bg-muted text-foreground">
            {pipeline.length} en pipeline
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === item.id
                  ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-white/70 hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowInbox((current) => !current)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              showInbox
                ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:bg-white/70 hover:text-foreground",
            )}
          >
            Bandeja · {inbox.length}
          </button>
        </div>
      </div>

      {showInbox && inbox.length > 0 ? (
        <section className="mb-6 rounded-2xl border border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Bandeja</h2>
              <p className="text-xs text-muted-foreground">Formularios incompletos o sin etapa aún.</p>
            </div>
            <Badge variant="secondary" className="rounded-full">{inbox.length}</Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {inbox.map((submission) => (
              <button
                key={submission.id}
                type="button"
                onClick={() => setSelectedId(submission.id)}
                className="w-[220px] shrink-0 rounded-xl border border-border bg-muted/40 p-3 text-left hover:bg-muted"
              >
                <p className="truncate text-sm font-semibold">{getSubmissionTitle(submission)}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {submission.qualification
                    ? QUALIFICATION_LABEL[submission.qualification]
                    : ENTRY_SOURCE_LABEL[submission.entrySource]}
                </p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex min-h-[70vh] gap-4 pb-4">
            {FUNNEL_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                count={submissionsByStage[column.id].length}
              >
                {submissionsByStage[column.id].map((submission) => (
                  <KanbanCard
                    key={submission.id}
                    submission={submission}
                    isUpdating={updatingId === submission.id}
                    onOpen={() => setSelectedId(submission.id)}
                    onShowUp={() => void markShowUp(submission.id)}
                    onNoShow={() => void markNoShow(submission.id)}
                    onCloseDeal={() => setCloseLeadId(submission.id)}
                  />
                ))}
              </KanbanColumn>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DragOverlay>
          {activeSubmission ? (
            <div className="w-[280px] rounded-xl border border-border bg-white p-4 shadow-lg">
              <p className="font-semibold">{getSubmissionTitle(activeSubmission)}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <SubmissionDetailSheet
        submission={selectedSubmission}
        open={selectedSubmission !== null}
        isUpdating={selectedSubmission ? updatingId === selectedSubmission.id : false}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        onShowUp={() => selectedSubmission && void markShowUp(selectedSubmission.id)}
        onNoShow={() => selectedSubmission && void markNoShow(selectedSubmission.id)}
        onCloseDeal={() => selectedSubmission && setCloseLeadId(selectedSubmission.id)}
      />

      <CloseDealDialog
        open={closingLead !== null}
        leadName={closingLead ? getSubmissionTitle(closingLead) : "este lead"}
        isSubmitting={Boolean(closeLeadId && updatingId === closeLeadId)}
        onOpenChange={(open) => {
          if (!open) setCloseLeadId(null)
        }}
        onConfirm={(input) =>
          closeLeadId ? closeDeal(closeLeadId, input) : Promise.resolve()
        }
      />
    </>
  )
}
