"use client"

import { useDraggable, useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, GripVertical, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { KanbanCardMenu } from "@/components/admin/kanban-card-menu"
import type { FunnelColumn } from "@/lib/marketing/funnel-ui"
import { isFunnelCardDraggable } from "@/lib/marketing/funnel-ui"
import type { SubmissionRecord } from "@/lib/submission-display"
import {
  QUALIFICATION_LABEL,
  getSubmissionSubtitle,
  getSubmissionTitle,
} from "@/lib/submission-display"
import { cn } from "@/lib/utils"

function leadInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

export function formatMeetingLabel(iso: string | null) {
  if (!iso) return null
  return new Date(iso)
    .toLocaleString("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Bogota",
    })
    .replace(/[\u00A0\u202F\u2009]/g, " ")
}

export function LeadStageActions({
  submission,
  disabled,
  compact = false,
  onShowUp,
  onNoShow,
  onCloseDeal,
  onScheduleDemo,
  onDiscard,
  onOpen,
}: {
  submission: SubmissionRecord
  disabled: boolean
  compact?: boolean
  onShowUp: () => void
  onNoShow: () => void
  onCloseDeal: () => void
  onScheduleDemo?: () => void
  onDiscard?: () => void
  onOpen?: () => void
}) {
  const stage = submission.marketingFunnelStage
  if (stage === "SCHEDULED") {
    return (
      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
        <Button type="button" size="sm" disabled={disabled} onClick={onShowUp}>
          Asistió
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={disabled} onClick={onNoShow}>
          No asistió
        </Button>
      </div>
    )
  }

  if (stage === "SHOWED_UP") {
    return (
      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
        <Button type="button" size="sm" disabled={disabled} onClick={onScheduleDemo}>
          Programar demo
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={disabled} onClick={onDiscard}>
          Descartar
        </Button>
      </div>
    )
  }

  if (stage === "DEMO_SCHEDULED") {
    return (
      <Button type="button" size="sm" className="w-full" disabled={disabled} onClick={onCloseDeal}>
        Cerrar trato
      </Button>
    )
  }

  if (stage === "NO_SHOW") {
    return (
      <Button type="button" size="sm" variant="outline" className="w-full" disabled={disabled} onClick={onShowUp}>
        Marcar show-up
      </Button>
    )
  }

  if (stage === "PENDING_CALL") {
    return (
      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
        <Button type="button" size="sm" disabled={disabled} onClick={onOpen}>
          Programar diagnóstico
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={disabled} onClick={onDiscard}>
          Descualificar
        </Button>
      </div>
    )
  }

  return null
}

export function KanbanColumn({
  column,
  count,
  children,
}: {
  column: FunnelColumn
  count: number
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled: !column.droppable,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full w-[280px] shrink-0 flex-col rounded-2xl bg-muted/70 p-3",
        column.droppable && isOver && "ring-2 ring-primary/30",
      )}
    >
      <div className="mb-3 shrink-0">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <span className={cn("size-2 shrink-0 rounded-full", column.accent)} />
          <h2 className="truncate text-sm font-semibold">{column.label}</h2>
          <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
        </div>
        <p className="mt-2 px-1 text-xs text-muted-foreground">{column.description}</p>
        {column.hint ? (
          <p className="mt-0.5 px-1 text-[10px] font-medium tracking-wide text-muted-foreground">
            {column.hint}
          </p>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5">{children}</div>
    </div>
  )
}

export function KanbanCard({
  submission,
  isUpdating,
  onOpen,
  onShowUp,
  onNoShow,
  onCloseDeal,
  onScheduleDemo,
  onDiscard,
  onDelete,
}: {
  submission: SubmissionRecord
  isUpdating: boolean
  onOpen: () => void
  onShowUp: () => void
  onNoShow: () => void
  onCloseDeal: () => void
  onScheduleDemo?: () => void
  onDiscard?: () => void
  onDelete: () => void
}) {
  const draggable = isFunnelCardDraggable(submission.marketingFunnelStage)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: submission.id,
    disabled: !draggable,
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const meeting = formatMeetingLabel(submission.meetingTime || submission.bookedAt)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-border bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-opacity",
        isDragging && "opacity-40",
        isUpdating && "opacity-60",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="flex min-w-0 items-start gap-2.5 text-left">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
            {leadInitials(getSubmissionTitle(submission))}
          </span>
          <span className="min-w-0">
            <p className="truncate text-sm font-semibold hover:underline">{getSubmissionTitle(submission)}</p>
            <p className="truncate text-xs text-muted-foreground">{getSubmissionSubtitle(submission)}</p>
          </span>
        </button>
        <div
          className="flex shrink-0 items-center"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
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
          <KanbanCardMenu
            disabled={isUpdating}
            onUpdate={onOpen}
            onDelete={onDelete}
          />
        </div>
      </div>

      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {submission.qualification ? (
            <Badge variant="secondary" className="rounded-full bg-muted text-[10px] text-foreground">
              {QUALIFICATION_LABEL[submission.qualification]}
              {submission.qualificationScore != null ? ` · ${submission.qualificationScore}` : ""}
            </Badge>
          ) : null}
          {meeting ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {meeting}
            </span>
          ) : null}
        </div>
        {submission.email ? (
          <p className="mb-3 inline-flex max-w-full items-center gap-1 truncate text-[10px] text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            {submission.email}
          </p>
        ) : null}
      </button>

      <div
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <LeadStageActions
          submission={submission}
          disabled={isUpdating}
          compact
          onShowUp={onShowUp}
          onNoShow={onNoShow}
          onCloseDeal={onCloseDeal}
          onScheduleDemo={onScheduleDemo}
          onDiscard={onDiscard}
          onOpen={onOpen}
        />
      </div>
    </div>
  )
}
