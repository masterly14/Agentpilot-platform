"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"
import { formProgressPercent } from "@/lib/booking/form-options"
import { cn } from "@/lib/utils"

export function FormProgressBar({
  stepIndex,
  totalSteps,
  tone = "light",
}: {
  stepIndex: number
  totalSteps: number
  tone?: "light" | "dark"
}) {
  const width = formProgressPercent(stepIndex, totalSteps)

  return (
    <div
      className={cn(
        "h-1 w-full overflow-hidden rounded-full",
        tone === "dark" ? "bg-zinc-800" : "bg-zinc-200",
      )}
      aria-hidden
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "dark" ? "bg-white" : "bg-zinc-900",
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -24 : 24,
    opacity: 0,
  }),
}

export function FormStepTransition({
  stepKey,
  direction,
  children,
}: {
  stepKey: string
  direction: number
  children: ReactNode
}) {
  return (
    <div className="relative min-h-[220px] flex-1 overflow-hidden">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={stepKey}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
