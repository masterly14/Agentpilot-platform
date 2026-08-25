"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * Selection for a Radix sheet opened from a click or a deep link.
 * Ignores the first dismiss so the opening pointer event / Strict Mode
 * remount cannot close the sheet immediately.
 */
export function useSheetSelection(
  initialId: string | null | undefined,
  onSelectedIdChange?: (id: string | null) => void,
) {
  const [selectedId, setSelectedIdState] = useState<string | null>(initialId ?? null)
  const allowDismiss = useRef(false)
  const onChangeRef = useRef(onSelectedIdChange)
  onChangeRef.current = onSelectedIdChange

  useLayoutEffect(() => {
    setSelectedIdState(initialId ?? null)
  }, [initialId])

  useEffect(() => {
    if (!selectedId) {
      allowDismiss.current = false
      return
    }
    allowDismiss.current = false
    const timer = window.setTimeout(() => {
      allowDismiss.current = true
    }, 200)
    return () => window.clearTimeout(timer)
  }, [selectedId])

  function setSelectedId(id: string | null) {
    setSelectedIdState(id)
    onChangeRef.current?.(id)
  }

  return {
    selectedId,
    setSelectedId,
    onOpenChange(open: boolean) {
      if (open) return
      if (!allowDismiss.current) return
      setSelectedId(null)
    },
  }
}
