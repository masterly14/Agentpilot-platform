"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PLAN_OPTIONS } from "@/lib/marketing/funnel-ui"
import type { ContractPlan } from "@/prisma/generated/client"
import { cn } from "@/lib/utils"

type CloseDealDialogProps = {
  open: boolean
  leadName: string
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (input: { contractValueUsd: number; contractPlan: ContractPlan }) => Promise<void>
}

export function CloseDealDialog({
  open,
  leadName,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: CloseDealDialogProps) {
  const [plan, setPlan] = useState<ContractPlan>("THREE_MONTH")
  const [amount, setAmount] = useState("3000")

  useEffect(() => {
    if (!open) return
    setPlan("THREE_MONTH")
    setAmount("3000")
  }, [open])

  const parsedAmount = Number(amount.replace(",", ".").replace(/[^\d.]/g, ""))
  const canConfirm = Number.isFinite(parsedAmount) && parsedAmount > 0 && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cerrar trato</DialogTitle>
          <DialogDescription>
            Registra el valor del contrato de {leadName}. Sin monto no se puede confirmar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {PLAN_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setPlan(option.id)
                if (option.amount != null) setAmount(String(option.amount))
              }}
              className={cn(
                "rounded-lg border px-3 py-3 text-left transition-colors",
                plan === option.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white hover:bg-muted",
              )}
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="text-[11px] opacity-70">{option.hint}</p>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="contract-amount" className="text-xs font-medium text-muted-foreground">
            Monto en USD
          </label>
          <Input
            id="contract-amount"
            inputMode="decimal"
            value={amount}
            onChange={(event) => {
              const next = event.target.value
              setAmount(next)
              const numeric = Number(next.replace(",", ".").replace(/[^\d.]/g, ""))
              if (numeric === 3000) setPlan("THREE_MONTH")
              else if (numeric === 5000) setPlan("FIVE_MONTH")
              else setPlan("OTHER")
            }}
            placeholder="3000"
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!canConfirm}
            onClick={() => onConfirm({ contractValueUsd: parsedAmount, contractPlan: plan })}
          >
            {isSubmitting ? "Guardando…" : "Confirmar cierre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
