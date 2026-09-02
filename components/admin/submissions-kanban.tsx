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
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { CloseDealDialog } from "@/components/admin/close-deal-dialog"
import { PostAttendDialog } from "@/components/admin/post-attend-dialog"
import { SubmissionDetailSheet } from "@/components/admin/submission-detail-sheet"
import { KanbanCard, KanbanColumn } from "@/components/admin/kanban-parts"
import { DeleteLeadDialog, KanbanCardMenu } from "@/components/admin/kanban-card-menu"
import type { MeetingReschedulePayload } from "@/components/admin/meeting-reschedule-form"
import {
  FUNNEL_COLUMNS,
  canDropOnFunnelStage,
  compareInboxLeads,
  hasInboxContact,
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
  initialFilter?: BoardFilter
  initialSelectedId?: string | null
  onSelectedIdChange?: (id: string | null) => void
  showTitle?: boolean
}

export function SubmissionsKanban({
  initialSubmissions,
  initialFilter = "all",
  initialSelectedId = null,
  onSelectedIdChange,
  showTitle = true,
}: SubmissionsKanbanProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [filter, setFilter] = useState<BoardFilter>(initialFilter)
  const [showInbox, setShowInbox] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { selectedId, setSelectedId, onOpenChange } = useSheetSelection(
    initialSelectedId,
    onSelectedIdChange,
  )
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [closeLeadId, setCloseLeadId] = useState<string | null>(null)
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null)
  const [postAttendLeadId, setPostAttendLeadId] = useState<string | null>(null)
  const [postAttendStep, setPostAttendStep] = useState<"choose" | "demo">("choose")

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

  const inbox = visible
    .filter((submission) => isInboxLead(submission) && hasInboxContact(submission))
    .sort(compareInboxLeads)
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
  const deletingLead = deleteLeadId
    ? submissions.find((submission) => submission.id === deleteLeadId) ?? null
    : null
  const postAttendLead = postAttendLeadId
    ? submissions.find((submission) => submission.id === postAttendLeadId) ?? null
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
      setPostAttendStep("choose")
      setPostAttendLeadId(id)
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

  async function scheduleDemo(id: string, input: { meetingTime: string; painPoint: string }) {
    setUpdatingId(id)
    try {
      const res = await fetch("/api/admin/pipeline/schedule-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: id,
          meetingTime: input.meetingTime,
          painPoint: input.painPoint,
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        submission?: SubmissionRecord
        error?: string
        calendarWarning?: string | null
      } | null
      if (!res.ok) throw new Error(data?.error ?? "No se pudo programar la demo")
      if (data?.submission) applySubmission(data.submission)
      setPostAttendLeadId(null)
      if (data?.calendarWarning) {
        toast.warning(data.calendarWarning)
      } else {
        toast.success("Demo agendada. Recordatorios programados.")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo programar la demo")
      throw error
    } finally {
      setUpdatingId(null)
    }
  }

  async function markPendingCall(id: string) {
    const previous = submissions.find((item) => item.id === id)
    if (!previous) return
    setUpdatingId(id)
    setSubmissions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, marketingFunnelStage: "PENDING_CALL" } : item,
      ),
    )
    try {
      const res = await fetch("/api/admin/pipeline/pending-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id }),
      })
      const data = (await res.json().catch(() => null)) as {
        submission?: SubmissionRecord
        error?: string
      } | null
      if (!res.ok) throw new Error(data?.error ?? "No se pudo mover a pendiente por llamar")
      if (data?.submission) applySubmission(data.submission)
      toast.success("Pendiente por llamar")
    } catch (error) {
      setSubmissions((current) =>
        current.map((item) => (item.id === id && previous ? previous : item)),
      )
      toast.error(error instanceof Error ? error.message : "No se pudo mover a pendiente por llamar")
    } finally {
      setUpdatingId(null)
    }
  }

  async function discardLead(id: string) {
    const previous = submissions.find((item) => item.id === id)
    if (!previous) return
    setUpdatingId(id)
    setSubmissions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, marketingFunnelStage: "DISCARDED" } : item,
      ),
    )
    try {
      const res = await fetch("/api/admin/pipeline/discard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: id }),
      })
      const data = (await res.json().catch(() => null)) as {
        submission?: SubmissionRecord
        error?: string
      } | null
      if (!res.ok) throw new Error(data?.error ?? "No se pudo descartar")
      if (data?.submission) applySubmission(data.submission)
      setPostAttendLeadId(null)
      toast.success("Lead descartado")
    } catch (error) {
      setSubmissions((current) =>
        current.map((item) => (item.id === id && previous ? previous : item)),
      )
      toast.error(error instanceof Error ? error.message : "No se pudo descartar")
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteLead(id: string) {
    const previous = submissions.find((item) => item.id === id)
    if (!previous) return
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" })
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) throw new Error(data?.error ?? "No se pudo eliminar")
      setSubmissions((current) => current.filter((item) => item.id !== id))
      if (selectedId === id) setSelectedId(null)
      setDeleteLeadId(null)
      toast.success("Lead eliminado")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar")
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

  async function rescheduleMeeting(id: string, input: MeetingReschedulePayload) {
    const previous = submissions.find((item) => item.id === id)
    if (!previous) return
    setUpdatingId(id)
    try {
      const res = await fetch("/api/admin/pipeline/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: id,
          meetingTime: input.meetingTime,
          meetLink: input.meetLink || undefined,
          visitorTimezone: input.visitorTimezone,
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        submission?: SubmissionRecord
        error?: string
      } | null
      if (!res.ok) throw new Error(data?.error ?? "No se pudo reagendar")
      if (data?.submission) applySubmission(data.submission)
      toast.success("Reunión reagendada. Los recordatorios se ajustaron a la nueva hora.")
    } catch (error) {
      if (previous) applySubmission(previous)
      toast.error(error instanceof Error ? error.message : "No se pudo reagendar")
      throw error
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
    if (nextStage === "DEMO_SCHEDULED") {
      setPostAttendStep("demo")
      setPostAttendLeadId(submissionId)
      return
    }
    if (nextStage === "DISCARDED") {
      await discardLead(submissionId)
      return
    }
    if (nextStage === "NO_SHOW") {
      await markNoShow(submissionId)
      return
    }
    if (nextStage === "PENDING_CALL") {
      await markPendingCall(submissionId)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex shrink-0 flex-col gap-4">
        {showTitle ? (
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
        ) : (
          <div className="flex justify-end">
            <Badge variant="secondary" className="rounded-full bg-muted text-foreground">
              {pipeline.length} en pipeline
            </Badge>
          </div>
        )}

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
        <section className="mb-4 shrink-0 rounded-2xl border border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Bandeja</h2>
              <p className="text-xs text-muted-foreground">Incompletos con correo o teléfono para contactar.</p>
            </div>
            <Badge variant="secondary" className="rounded-full">{inbox.length}</Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {inbox.map((submission) => (
              <div
                key={submission.id}
                className="flex w-[220px] shrink-0 items-start justify-between gap-1 rounded-xl border border-border bg-muted/40 p-3"
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(submission.id)}
                  className="min-w-0 flex-1 text-left hover:opacity-80"
                >
                  <p className="truncate text-sm font-semibold">{getSubmissionTitle(submission)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {submission.qualification
                      ? QUALIFICATION_LABEL[submission.qualification]
                      : ENTRY_SOURCE_LABEL[submission.entrySource]}
                  </p>
                </button>
                <KanbanCardMenu
                  disabled={updatingId === submission.id}
                  onUpdate={() => setSelectedId(submission.id)}
                  onDelete={() => setDeleteLeadId(submission.id)}
                />
              </div>
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
        <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto overflow-y-hidden pb-2">
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
                    onScheduleDemo={() => {
                      setPostAttendStep("demo")
                      setPostAttendLeadId(submission.id)
                    }}
                    onDiscard={() => void discardLead(submission.id)}
                    onDelete={() => setDeleteLeadId(submission.id)}
                  />
                ))}
              </KanbanColumn>
            ))}
        </div>

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
        onOpenChange={onOpenChange}
        onShowUp={() => selectedSubmission && void markShowUp(selectedSubmission.id)}
        onNoShow={() => selectedSubmission && void markNoShow(selectedSubmission.id)}
        onCloseDeal={() => selectedSubmission && setCloseLeadId(selectedSubmission.id)}
        onScheduleDemo={() => {
          if (!selectedSubmission) return
          setPostAttendStep("demo")
          setPostAttendLeadId(selectedSubmission.id)
        }}
        onDiscard={() => selectedSubmission && void discardLead(selectedSubmission.id)}
        onReschedule={(input) =>
          selectedSubmission
            ? rescheduleMeeting(selectedSubmission.id, input)
            : Promise.resolve()
        }
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

      <PostAttendDialog
        open={postAttendLead !== null}
        leadName={postAttendLead ? getSubmissionTitle(postAttendLead) : "este lead"}
        initialPainPoint={postAttendLead?.painPoint}
        initialStep={postAttendStep}
        isSubmitting={Boolean(postAttendLeadId && updatingId === postAttendLeadId)}
        onOpenChange={(open) => {
          if (!open) setPostAttendLeadId(null)
        }}
        onScheduleDemo={(input) =>
          postAttendLeadId ? scheduleDemo(postAttendLeadId, input) : Promise.resolve()
        }
        onDiscard={() => (postAttendLeadId ? discardLead(postAttendLeadId) : Promise.resolve())}
      />

      <DeleteLeadDialog
        open={deletingLead !== null}
        leadName={deletingLead ? getSubmissionTitle(deletingLead) : "este lead"}
        isSubmitting={Boolean(deleteLeadId && updatingId === deleteLeadId)}
        onOpenChange={(open) => {
          if (!open) setDeleteLeadId(null)
        }}
        onConfirm={() => (deleteLeadId ? deleteLead(deleteLeadId) : Promise.resolve())}
      />
    </div>
  )
}
