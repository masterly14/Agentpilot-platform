"use client"

import { useDraggable, useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Building2, GripVertical, Mail, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { SubmissionRecord } from "@/lib/submission-display"
import {
  getSubmissionSubtitle,
  getSubmissionSummary,
  getSubmissionTitle,
} from "@/lib/submission-display"
import type { StatusColumn } from "@/lib/submission-status"
import { cn } from "@/lib/utils"

export function KanbanColumn({
  column,
  count,
  children,
}: {
  column: StatusColumn
  count: number
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-[300px] shrink-0 flex-col rounded-xl border bg-background/80",
        column.accent,
        isOver && "ring-2 ring-primary/30"
      )}
    >
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">{column.label}</h2>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{column.description}</p>
      </div>
      <div className="flex min-h-[420px] flex-1 flex-col gap-3 p-3">
        {children}
      </div>
    </div>
  )
}

export function KanbanCard({
  submission,
  isUpdating,
  onOpen,
}: {
  submission: SubmissionRecord
  isUpdating: boolean
  onOpen: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: submission.id,
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  const isCompany = submission.projectType === "COMPANY"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm transition-opacity",
        isDragging && "opacity-40",
        isUpdating && "opacity-60"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 text-left"
        >
          <p className="truncate text-sm font-semibold hover:underline">
            {getSubmissionTitle(submission)}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {getSubmissionSubtitle(submission)}
          </p>
        </button>
        <button
          type="button"
          className="rounded p-1 text-muted-foreground hover:bg-muted"
          aria-label="Arrastrar tarjeta"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <button type="button" onClick={onOpen} className="w-full text-left">
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
            <span className="inline-flex max-w-[120px] items-center gap-1 truncate text-[10px] text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              {submission.email}
            </span>
          )}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {new Date(submission.createdAt).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </button>
    </div>
  )
}
