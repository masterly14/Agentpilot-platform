import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { listVideoOutreachLeads } from "@/lib/campaigns/video-outreach"
import { FUNNEL_STAGE_LABEL } from "@/lib/marketing/funnel-ui"

const STAGES = new Set<string>(["all", "inbox", ...Object.keys(FUNNEL_STAGE_LABEL)])

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const url = new URL(request.url)
  const stage = url.searchParams.get("stage")?.trim() || "all"
  const query = url.searchParams.get("query")?.trim() || ""

  if (!STAGES.has(stage)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 })
  }

  const leads = await listVideoOutreachLeads({ stage, query })

  return NextResponse.json({ leads })
}
