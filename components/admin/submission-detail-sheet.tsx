"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { getSubmissionDetails, getSubmissionTitle } from "@/lib/submission-display"
import type { SubmissionRecord } from "@/lib/submission-display"
import { STATUS_COLUMNS } from "@/lib/submission-status"
import type { SubmissionStatus } from "@/prisma/generated/client"

type SubmissionDetailSheetProps = {
  submission: SubmissionRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: SubmissionStatus) => Promise<void>
  isUpdating: boolean
}

export function SubmissionDetailSheet({
  submission,
  open,
  onOpenChange,
  onStatusChange,
  isUpdating,
}: SubmissionDetailSheetProps) {
  if (!submission) return null

  const details = getSubmissionDetails(submission)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{getSubmissionTitle(submission)}</SheetTitle>
          <SheetDescription>
            Recibido el{" "}
            {new Date(submission.createdAt).toLocaleString("es-CO", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Estado interno
            </p>
            <Select
              value={submission.status}
              onValueChange={(value) => onStatusChange(submission.id, value as SubmissionStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_COLUMNS.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {details.map((detail) => (
              <div key={detail.label} className="grid grid-cols-[120px_1fr] gap-3 text-sm">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="break-words font-medium">{detail.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Descripción
            </p>
            <p className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">
              {submission.projectDescription || "Sin descripción adicional."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {submission.email && (
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${submission.email}`}>Enviar correo</a>
              </Button>
            )}
            <Badge variant="secondary">
              ID {submission.id.slice(0, 8)}
            </Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
