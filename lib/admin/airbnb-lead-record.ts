import type {
  AirbnbCommercial,
  AirbnbCommercialStage,
  AirbnbLead,
  AirbnbMessage,
  ContractPlan,
  HostContact,
  LeadStatus,
  MessageDirection,
} from "@/prisma/generated/client"
import { prisma } from "@/lib/prisma"

export type AirbnbMessageRecord = {
  id: string
  direction: MessageDirection
  content: string
  aiIntent: string | null
  sentAt: string
}

export type AirbnbLeadRecord = {
  id: string
  name: string
  status: LeadStatus
  market: string | null
  totalProperties: number
  isSuperhost: boolean
  companyName: string | null
  hostProfileUrl: string
  primaryListingUrl: string
  primaryListingName: string | null
  threadId: string | null
  hostEmail: string | null
  executiveSummary: string | null
  painPoints: string | null
  stage: AirbnbCommercialStage | null
  meetingTime: string | null
  meetLink: string | null
  contractValueUsd: string | null
  contractPlan: ContractPlan | null
  handoffReason: string | null
  contactedAt: string | null
  messages: AirbnbMessageRecord[]
  createdAt: string
  updatedAt: string
}

type LeadWithRelations = AirbnbLead & {
  commercial: AirbnbCommercial | null
  messages: AirbnbMessage[]
  hostContact: Pick<HostContact, "id" | "firstContactedAt"> | null
}

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null
}

function handoffReason(messages: AirbnbMessage[]) {
  const note = [...messages]
    .reverse()
    .find((message) => message.direction === "SYSTEM" && message.aiIntent === "HUMAN_TAKEOVER")
  return note?.content ?? null
}

export function toAirbnbLeadRecord(lead: LeadWithRelations): AirbnbLeadRecord {
  const commercial = lead.commercial
  const stage =
    commercial?.stage ?? (lead.status === "HUMAN_TAKEOVER" ? "HANDOFF" : null)

  return {
    id: lead.id,
    name: lead.name,
    status: lead.status,
    market: lead.market,
    totalProperties: lead.totalProperties,
    isSuperhost: lead.isSuperhost,
    companyName: lead.companyName,
    hostProfileUrl: lead.hostProfileUrl,
    primaryListingUrl: lead.primaryListingUrl,
    primaryListingName: lead.primaryListingName,
    threadId: lead.threadId,
    hostEmail: lead.hostEmail ?? commercial?.hostEmail ?? null,
    executiveSummary: lead.executiveSummary,
    painPoints: lead.painPoints,
    stage,
    meetingTime: iso(commercial?.meetingTime),
    meetLink: commercial?.meetLink ?? null,
    contractValueUsd: commercial?.contractValueUsd != null ? String(commercial.contractValueUsd) : null,
    contractPlan: commercial?.contractPlan ?? null,
    handoffReason: handoffReason(lead.messages),
    contactedAt: iso(lead.hostContact?.firstContactedAt ?? lead.lastContactedAt),
    messages: lead.messages.map((message) => ({
      id: message.id,
      direction: message.direction,
      content: message.content,
      aiIntent: message.aiIntent,
      sentAt: message.sentAt.toISOString(),
    })),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }
}

const queueInclude = {
  commercial: true,
  messages: { orderBy: { sentAt: "asc" as const } },
  hostContact: { select: { id: true, firstContactedAt: true } },
}

export async function listAirbnbQueue(): Promise<AirbnbLeadRecord[]> {
  const leads = await prisma.airbnbLead.findMany({
    where: {
      OR: [
        { commercial: { isNot: null } },
        { status: { in: ["HUMAN_TAKEOVER", "REPLIED_IN_PROGRESS"] } },
      ],
    },
    include: queueInclude,
    orderBy: { updatedAt: "desc" },
  })
  return leads.map(toAirbnbLeadRecord)
}

export async function getAirbnbLeadRecord(id: string): Promise<AirbnbLeadRecord | null> {
  const lead = await prisma.airbnbLead.findUnique({
    where: { id },
    include: queueInclude,
  })
  if (!lead) return null
  return toAirbnbLeadRecord(lead)
}
