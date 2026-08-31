import type { PropertyCount } from "@/prisma/generated/client"
import { bogotaDateFromIso, createEmptyLeakMap, type LeakMapState, type SavedDiagnosis } from "@/lib/admin/leak-map"
import { prisma } from "@/lib/prisma"
import { getSubmissionTitle } from "@/lib/submission-display"
import { toPhoneE164 } from "@/lib/whatsapp/phone"

const PROPERTY_SHORT: Record<PropertyCount, string> = {
  UNDER_5: "< 5",
  FIVE_TO_FIFTEEN: "5–15",
  SIXTEEN_TO_TWENTY_FIVE: "16–25",
  OVER_25: "+25",
}

export type DiagnosisLeadOption = {
  key: string
  source: "inbound" | "airbnb"
  submissionId: string | null
  airbnbLeadId: string | null
  name: string
  clientName: string
  subtitle: string
  meetingTime: string | null
  properties: string
}

export type DiagnosisLeadLink = Pick<
  DiagnosisLeadOption,
  "source" | "submissionId" | "airbnbLeadId" | "name" | "clientName" | "meetingTime" | "properties"
>

type DiagnosisRow = {
  id: string
  clientName: string
  updatedAt: Date
  meetingTime: Date | null
  submissionId: string | null
  airbnbLeadId: string | null
  submission?: {
    fullName: string | null
    companyName: string | null
    email: string | null
  } | null
  airbnbLead?: {
    name: string
    companyName: string | null
  } | null
}

export const DIAGNOSIS_LIST_INCLUDE = {
  submission: { select: { fullName: true, companyName: true, email: true } },
  airbnbLead: { select: { name: true, companyName: true } },
} as const

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null
}

export function toSavedDiagnosis(row: DiagnosisRow): SavedDiagnosis {
  const source = row.airbnbLeadId ? "airbnb" : row.submissionId ? "inbound" : null
  const leadLabel = row.airbnbLead
    ? row.airbnbLead.companyName?.trim() || row.airbnbLead.name
    : row.submission
      ? getSubmissionTitle(row.submission)
      : null

  return {
    id: row.id,
    clientName: row.clientName,
    updatedAt: row.updatedAt.toISOString(),
    meetingTime: iso(row.meetingTime),
    source,
    leadLabel,
    submissionId: row.submissionId,
    airbnbLeadId: row.airbnbLeadId,
  }
}

export function leakMapFromLead(lead: DiagnosisLeadLink): LeakMapState {
  const empty = createEmptyLeakMap()
  empty.cliente = lead.clientName
  empty.fecha = bogotaDateFromIso(lead.meetingTime)
  empty.unidades = lead.properties
  if (lead.source === "airbnb") empty.canales = "Airbnb"
  return empty
}

export function linkFromSaved(item: SavedDiagnosis): DiagnosisLeadLink | null {
  if (!item.submissionId && !item.airbnbLeadId) return null
  const source = item.airbnbLeadId ? "airbnb" : "inbound"
  const name = item.leadLabel || item.clientName
  return {
    source,
    submissionId: item.submissionId,
    airbnbLeadId: item.airbnbLeadId,
    name,
    clientName: item.clientName,
    meetingTime: item.meetingTime,
    properties: "",
  }
}

export async function listDiagnosisLeads(): Promise<DiagnosisLeadOption[]> {
  const [inbound, airbnb] = await Promise.all([
    prisma.formSubmission.findMany({
      where: {
        OR: [{ fullName: { not: null } }, { companyName: { not: null } }, { email: { not: null } }],
      },
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        propertyCount: true,
        bookedAt: true,
        contact: { select: { pipeline: { select: { meetingTime: true } } } },
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
    prisma.airbnbLead.findMany({
      where: {
        OR: [
          { commercial: { isNot: null } },
          { status: { in: ["HUMAN_TAKEOVER", "REPLIED_IN_PROGRESS"] } },
        ],
      },
      select: {
        id: true,
        name: true,
        companyName: true,
        totalProperties: true,
        calBookedAt: true,
        commercial: { select: { meetingTime: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    }),
  ])

  const inboundLeads: DiagnosisLeadOption[] = inbound.map((row) => {
    const clientName =
      row.companyName?.trim() || row.fullName?.trim() || row.email?.trim() || "Lead inbound"
    const name = row.fullName?.trim() || clientName
    const meetingTime = iso(row.contact?.pipeline?.meetingTime ?? row.bookedAt)
    const subtitle = [row.fullName?.trim() && row.companyName?.trim() ? row.fullName.trim() : row.email?.trim(), "Inbound"]
      .filter(Boolean)
      .join(" · ")

    return {
      key: `inbound:${row.id}`,
      source: "inbound",
      submissionId: row.id,
      airbnbLeadId: null,
      name,
      clientName,
      subtitle,
      meetingTime,
      properties: row.propertyCount ? PROPERTY_SHORT[row.propertyCount] : "",
    }
  })

  const airbnbLeads: DiagnosisLeadOption[] = airbnb.map((row) => {
    const clientName = row.companyName?.trim() || row.name
    const meetingTime = iso(row.commercial?.meetingTime ?? row.calBookedAt)
    return {
      key: `airbnb:${row.id}`,
      source: "airbnb",
      submissionId: null,
      airbnbLeadId: row.id,
      name: row.name,
      clientName,
      subtitle: [row.companyName?.trim() && row.companyName.trim() !== row.name ? row.name : null, "Airbnb"]
        .filter(Boolean)
        .join(" · "),
      meetingTime,
      properties: String(row.totalProperties),
    }
  })

  return [...inboundLeads, ...airbnbLeads].sort((a, b) => {
    if (a.meetingTime && !b.meetingTime) return -1
    if (!a.meetingTime && b.meetingTime) return 1
    if (a.meetingTime && b.meetingTime) return b.meetingTime.localeCompare(a.meetingTime)
    return a.clientName.localeCompare(b.clientName, "es")
  })
}

export async function resolveDiagnosisLead(input: {
  submissionId?: string | null
  airbnbLeadId?: string | null
}): Promise<DiagnosisLeadLink | null> {
  if (input.airbnbLeadId) {
    const row = await prisma.airbnbLead.findUnique({
      where: { id: input.airbnbLeadId },
      select: {
        id: true,
        name: true,
        companyName: true,
        totalProperties: true,
        calBookedAt: true,
        commercial: { select: { meetingTime: true } },
      },
    })
    if (!row) return null
    return {
      source: "airbnb",
      submissionId: null,
      airbnbLeadId: row.id,
      name: row.name,
      clientName: row.companyName?.trim() || row.name,
      meetingTime: iso(row.commercial?.meetingTime ?? row.calBookedAt),
      properties: String(row.totalProperties),
    }
  }

  if (input.submissionId) {
    const row = await prisma.formSubmission.findUnique({
      where: { id: input.submissionId },
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        propertyCount: true,
        bookedAt: true,
        contact: { select: { pipeline: { select: { meetingTime: true } } } },
      },
    })
    if (!row) return null
    const clientName =
      row.companyName?.trim() || row.fullName?.trim() || row.email?.trim() || "Lead inbound"
    return {
      source: "inbound",
      submissionId: row.id,
      airbnbLeadId: null,
      name: row.fullName?.trim() || clientName,
      clientName,
      meetingTime: iso(row.contact?.pipeline?.meetingTime ?? row.bookedAt),
      properties: row.propertyCount ? PROPERTY_SHORT[row.propertyCount] : "",
    }
  }

  return null
}

export async function resolveDiagnosisWhatsAppContact(input: {
  submissionId?: string | null
  airbnbLeadId?: string | null
}) {
  if (input.airbnbLeadId) {
    const row = await prisma.airbnbLead.findUnique({
      where: { id: input.airbnbLeadId },
      select: { contact: true },
    })
    if (row?.contact?.phoneE164) return row.contact
    return null
  }

  if (input.submissionId) {
    const row = await prisma.formSubmission.findUnique({
      where: { id: input.submissionId },
      select: {
        phoneCountryCode: true,
        phoneNumber: true,
        contact: true,
      },
    })
    if (!row) return null
    if (row.contact?.phoneE164) return row.contact
    if (row.phoneCountryCode && row.phoneNumber) {
      try {
        const phoneE164 = toPhoneE164(row.phoneCountryCode, row.phoneNumber)
        return prisma.contact.findUnique({ where: { phoneE164 } })
      } catch {
        return null
      }
    }
  }

  return null
}

