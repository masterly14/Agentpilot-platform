import Link from "next/link"
import { AdminLogoutButton } from "@/components/admin/admin-logout-button"

export const metadata = {
  title: "Panel interno | Santiago Varón",
  robots: { index: false, follow: false },
}

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm font-bold tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}
            >
              Panel interno
            </Link>
            <span className="hidden text-xs text-muted-foreground md:inline">
              Solicitudes de proyecto
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver sitio público
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">{children}</main>
    </div>
  )
}
