"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  ClipboardList,
  Columns3,
  Globe,
  LogOut,
  MessageCircle,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SIDEBAR_STORAGE_KEY = "admin-sidebar"

const LINKS = [
  { href: "/admin", label: "Pipeline", exact: true, icon: Columns3 },
  { href: "/admin/chat", label: "Chat", exact: false, icon: MessageCircle },
  { href: "/admin/diagnostico", label: "Diagnóstico", exact: false, icon: ClipboardList },
  { href: "/admin/dashboard", label: "Dashboard", exact: false, icon: BarChart3 },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "hidden")
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function persist(next: boolean) {
    setOpen(next)
    localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "open" : "hidden")
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  if (!open) {
    return (
      <div className="flex shrink-0 items-center border-b border-sidebar-border bg-sidebar print:hidden md:h-screen md:flex-col md:border-b-0 md:border-r">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="m-2"
          aria-label="Mostrar menú"
          title="Mostrar menú (Ctrl+B)"
          onClick={() => persist(true)}
        >
          <PanelLeft />
        </Button>
      </div>
    )
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-sidebar-border bg-sidebar print:hidden md:h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          SV
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">Santiago Varón</p>
          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground"
          aria-label="Ocultar menú"
          title="Ocultar menú (Ctrl+B)"
          onClick={() => persist(false)}
        >
          <PanelLeftClose />
        </Button>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:px-3">
        <p className="mb-1 hidden px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:block">
          CRM
        </p>
        {LINKS.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex gap-1 border-t border-sidebar-border p-3 md:flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <Globe className="size-4" />
          Sitio público
        </Link>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogOut className="size-4" />
          Salir
        </button>
      </div>
    </aside>
  )
}
