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
import { Building2, GripVertical, Mail, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SubmissionDetailSheet } from "@/components/admin/submission-detail-sheet"
import type { SubmissionRecord } from "@/lib/submission-display"
import {
  getSubmissionSubtitle,
  getSubmissionSummary,
  getSubmissionTitle,
} from "@/lib/submission-display"
import { STATUS_COLUMNS } from "@/lib/submission-status"
import type { SubmissionStatus } from "@/prisma/generated/client"
import { KanbanCard, KanbanColumn } from "@/components/admin/kanban-parts"
import { cn } from "@/lib/utils"

type SubmissionsKanbanProps = {
  initialSubmissions: SubmissionRecord[]
}

export function SubmissionsKanban({ initialSubmissions }: SubmissionsKanbanProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const submissionsByStatus = useMemo(() => {
    const grouped = Object.fromEntries(
      STATUS_COLUMNS.map((column) => [column.id, [] as SubmissionRecord[]])
    ) as Record<SubmissionStatus, SubmissionRecord[]>

    for (const submission of submissions) {
      grouped[submission.status].push(submission)
    }

    return grouped
  }, [submissions])

  const activeSubmission = activeId
    ? submissions.find((submission) => submission.id === activeId) ?? null
    : null

  const selectedSubmission = selectedId
    ? submissions.find((submission) => submission.id === selectedId) ?? null
    : null

  async function updateStatus(id: string, status: SubmissionStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) return

      const data = await res.json()
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === id ? data.submission : submission
        )
      )
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
    const nextStatus = String(over.id) as SubmissionStatus
    const submission = submissions.find((item) => item.id === submissionId)

    if (!submission || submission.status === nextStatus) return
    if (!STATUS_COLUMNS.some((column) => column.id === nextStatus)) return

    const previousStatus = submission.status

    setSubmissions((current) =>
      current.map((item) =>
        item.id === submissionId ? { ...item, status: nextStatus } : item
      )
    )

    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) throw new Error("update failed")

      const data = await res.json()
      setSubmissions((current) =>
        current.map((item) =>
          item.id === submissionId ? data.submission : item
        )
      )
    } catch {
      setSubmissions((current) =>
        current.map((item) =>
          item.id === submissionId ? { ...item, status: previousStatus } : item
        )
      )
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline de solicitudes</h1>
          <p className="text-sm text-muted-foreground">
            Arrastra cada tarjeta entre columnas para actualizar su estado interno.
          </p>
        </div>
        <Badge variant="secondary">{submissions.length} solicitudes</Badge>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex min-h-[70vh] gap-4 pb-4">
            {STATUS_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                count={submissionsByStatus[column.id].length}
              >
                {submissionsByStatus[column.id].map((submission) => (
                  <KanbanCard
                    key={submission.id}
                    submission={submission}
                    isUpdating={updatingId === submission.id}
                    onOpen={() => setSelectedId(submission.id)}
                  />
                ))}
              </KanbanColumn>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DragOverlay>
          {activeSubmission ? (
            <SubmissionCardPreview submission={activeSubmission} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      <SubmissionDetailSheet
        submission={selectedSubmission}
        open={selectedSubmission !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
        onStatusChange={updateStatus}
        isUpdating={selectedSubmission ? updatingId === selectedSubmission.id : false}
      />
    </>
  )
}

function SubmissionCardPreview({
  submission,
  isDragging = false,
}: {
  submission: SubmissionRecord
  isDragging?: boolean
}) {
  const isCompany = submission.projectType === "COMPANY"

  return (
    <div
      className={cn(
        "w-[280px] rounded-xl border bg-card p-4 shadow-lg",
        isDragging && "rotate-2"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{getSubmissionTitle(submission)}</p>
          <p className="truncate text-xs text-muted-foreground">
            {getSubmissionSubtitle(submission)}
          </p>
        </div>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
        {submission.projectDescription || getSubmissionSummary(submission)}
      </p>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="text-[10px]">
          {isCompany ? (
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Empresa
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              Personal
            </span>
          )}
        </Badge>
        {submission.email && (
          <span className="inline-flex items-center gap-1 truncate text-[10px] text-muted-foreground">
            <Mail className="h-3 w-3" />
            {submission.email}
          </span>
        )}
      </div>
    </div>
  )
}

export { SubmissionCardPreview }
