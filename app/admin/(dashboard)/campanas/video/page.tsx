import { redirect } from "next/navigation"
import { VideoCampaignPanel } from "@/components/admin/campaigns/video-campaign-panel"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export const metadata = {
  title: "Campaña video | Panel interno",
}

export default async function AdminVideoCampaignPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  return <VideoCampaignPanel />
}
