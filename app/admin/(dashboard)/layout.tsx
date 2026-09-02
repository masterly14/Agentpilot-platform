import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Toaster } from "sonner"

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
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
      <Toaster theme="light" position="bottom-right" />
    </div>
  )
}
