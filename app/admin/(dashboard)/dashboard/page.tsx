import { redirect } from "next/navigation"
import { FunnelFrictionCard } from "@/components/admin/funnel-friction-card"
import { VideoRetentionCard } from "@/components/admin/video-retention-card"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { buildFunnelFriction } from "@/lib/funnel-friction"
import { LANDING_VIDEO } from "@/lib/landing-video"
import { prisma } from "@/lib/prisma"
import { buildVideoRetention } from "@/lib/video-retention"

export const metadata = {
  title: "Dashboard | Panel interno",
}

export default async function AdminDashboardMetricsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }

  const [submissions, videoSessions] = await Promise.all([
    prisma.formSubmission.findMany({
      select: {
        status: true,
        entrySource: true,
        fullName: true,
        email: true,
        companyName: true,
        phoneNumber: true,
        usesPms: true,
        propertyCount: true,
        revenueRange: true,
        isTodero: true,
        usesAi: true,
        wantsToScale: true,
        industryTime: true,
      },
    }),
    prisma.videoWatchSession.findMany({
      where: { videoId: LANDING_VIDEO.id },
      select: {
        visitorId: true,
        maxSecond: true,
        durationSeconds: true,
        unlocked: true,
        completed: true,
        droppedAtSecond: true,
        dropReason: true,
      },
    }),
  ])

  return (
    <div className="mx-auto w-full max-w-[1600px] flex-1 space-y-8 px-4 py-6 md:px-8">
      <VideoRetentionCard data={buildVideoRetention(videoSessions)} />
      <FunnelFrictionCard data={buildFunnelFriction(submissions)} />
    </div>
  )
}
