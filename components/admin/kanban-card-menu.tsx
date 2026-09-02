"use client"

import { useState } from "react"
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export function KanbanCardMenu({
  disabled,
  onUpdate,
  onDelete,
}: {
  disabled?: boolean
  onUpdate: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Más acciones"
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="w-52 p-1">
        <button
          type="button"
          disabled={disabled}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50"
          onClick={() => {
            setOpen(false)
            onUpdate()
          }}
        >
          <PencilLine className="h-4 w-4 text-muted-foreground" />
          Actualizar información
        </button>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50",
          )}
          onClick={() => {
            setOpen(false)
            onDelete()
          }}
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </PopoverContent>
    </Popover>
  )
}

export function DeleteLeadDialog({
  open,
  leadName,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  leadName: string
  isSubmitting?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar lead</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar a {leadName} del pipeline. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isSubmitting}
            onClick={(event) => {
              event.preventDefault()
              void onConfirm()
            }}
          >
            {isSubmitting ? "Eliminando…" : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
