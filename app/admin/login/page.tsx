import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <AdminLoginForm />
    </div>
  )
}
