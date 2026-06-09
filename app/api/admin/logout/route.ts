import { clearAdminSessionCookie } from "@/lib/admin-auth"

export async function POST() {
  return clearAdminSessionCookie()
}
