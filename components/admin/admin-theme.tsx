"use client"

import { useEffect } from "react"
import {
  applyDensity,
  applyMode,
  Density,
  Mode,
  setThemeClass,
  Theme,
} from "@cloudscape-design/global-styles"

export function AdminTheme() {
  useEffect(() => {
    const html = document.documentElement
    const hadDark = html.classList.contains("dark")
    html.classList.remove("dark")
    html.classList.add("admin-light")
    html.style.backgroundColor = "#f2f3f3"
    applyMode(Mode.Light)
    applyDensity(Density.Comfortable)
    setThemeClass(Theme.VisualRefresh)

    return () => {
      html.style.backgroundColor = ""
      html.classList.remove("admin-light")
      if (hadDark) html.classList.add("dark")
      applyMode(null)
      applyDensity(null)
      setThemeClass(null)
    }
  }, [])

  return null
}
