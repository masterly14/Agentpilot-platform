import { prisma } from "@/lib/prisma"
import type { AttributionPayload } from "@/lib/marketing/cookies"

export const AD_LANDING_PATHS = ["/ebook", "/diagnosis"] as const

export type AdLandingPath = (typeof AD_LANDING_PATHS)[number]
export type AdLandingConversion = "LEAD" | "SCHEDULE"

export type AdLandingVisitRow = {
  landingPath: string
  fromAd: boolean
  convertedAt: Date | null
  conversion: string | null
}

export type AdLandingLane = {
  path: AdLandingPath
  label: string
  actionLabel: string
  unconvertedLabel: string
  visits: number
  converted: number
  dropped: number
  dropRate: number
}

export type AdLandingReport = {
  visits: number
  converted: number
  dropped: number
  dropRate: number
  lanes: AdLandingLane[]
  bottleneck: AdLandingLane | null
}

const LANDING_META: Record<
  AdLandingPath,
  { label: string; actionLabel: string; unconvertedLabel: string }
> = {
  "/ebook": { label: "Guía", actionLabel: "descargar", unconvertedLabel: "no descargaron" },
  "/diagnosis": {
    label: "Diagnóstico",
    actionLabel: "agendar",
    unconvertedLabel: "no agendaron",
  },
}

const AD_SOURCES = new Set(["facebook", "fb", "ig", "instagram", "meta"])
const AD_MEDIA = new Set(["cpc", "ppc", "paid", "paid_social", "paidsocial"])

export function isAdLandingPath(value: string): value is AdLandingPath {
  return (AD_LANDING_PATHS as readonly string[]).includes(value)
}

export function isFromAd(attribution: AttributionPayload) {
  if (attribution.fbclid) return true
  if (attribution.fbc?.startsWith("fb.1.")) return true
  const source = attribution.utmSource?.trim().toLowerCase() ?? ""
  const medium = attribution.utmMedium?.trim().toLowerCase() ?? ""
  return AD_SOURCES.has(source) || AD_MEDIA.has(medium)
}

export function buildAdLandingReport(visits: AdLandingVisitRow[]): AdLandingReport {
  const adVisits = visits.filter((visit) => visit.fromAd && isAdLandingPath(visit.landingPath))
  const lanes = AD_LANDING_PATHS.map((path) => {
    const rows = adVisits.filter((visit) => visit.landingPath === path)
    const converted = rows.filter((visit) => visit.convertedAt).length
    const visitsCount = rows.length
    const dropped = visitsCount - converted
    return {
      path,
      ...LANDING_META[path],
      visits: visitsCount,
      converted,
      dropped,
      dropRate: visitsCount === 0 ? 0 : dropped / visitsCount,
    }
  })

  const withTraffic = lanes.filter((lane) => lane.visits > 0)
  const bottleneck =
    withTraffic.length === 0
      ? null
      : [...withTraffic].sort((a, b) => {
          if (b.dropRate !== a.dropRate) return b.dropRate - a.dropRate
          return b.dropped - a.dropped
        })[0] ?? null

  const visitCount = adVisits.length
  const converted = adVisits.filter((visit) => visit.convertedAt).length
  const dropped = visitCount - converted

  return {
    visits: visitCount,
    converted,
    dropped,
    dropRate: visitCount === 0 ? 0 : dropped / visitCount,
    lanes,
    bottleneck,
  }
}

export async function recordLandingVisit(input: {
  visitorId: string
  landingPath: AdLandingPath
  attribution: AttributionPayload
}) {
  const fromAd = isFromAd(input.attribution)
  const existing = await prisma.landingVisit.findUnique({
    where: {
      visitorId_landingPath: {
        visitorId: input.visitorId,
        landingPath: input.landingPath,
      },
    },
  })

  if (!existing) {
    return prisma.landingVisit.create({
      data: {
        visitorId: input.visitorId,
        landingPath: input.landingPath,
        fromAd,
        fbclid: input.attribution.fbclid,
        fbp: input.attribution.fbp,
        fbc: input.attribution.fbc,
        utmSource: input.attribution.utmSource,
        utmMedium: input.attribution.utmMedium,
        utmCampaign: input.attribution.utmCampaign,
      },
      select: { id: true },
    })
  }

  const data: {
    lastSeenAt: Date
    fromAd?: boolean
    fbclid?: string
    fbp?: string
    fbc?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  } = { lastSeenAt: new Date() }

  if (fromAd && !existing.fromAd) data.fromAd = true
  if (input.attribution.fbclid && !existing.fbclid) data.fbclid = input.attribution.fbclid
  if (input.attribution.fbp && !existing.fbp) data.fbp = input.attribution.fbp
  if (input.attribution.fbc && !existing.fbc) data.fbc = input.attribution.fbc
  if (input.attribution.utmSource && !existing.utmSource) data.utmSource = input.attribution.utmSource
  if (input.attribution.utmMedium && !existing.utmMedium) data.utmMedium = input.attribution.utmMedium
  if (input.attribution.utmCampaign && !existing.utmCampaign) {
    data.utmCampaign = input.attribution.utmCampaign
  }

  return prisma.landingVisit.update({
    where: { id: existing.id },
    data,
    select: { id: true },
  })
}

export async function markLandingConverted(input: {
  visitorId?: string
  landingPath: AdLandingPath
  conversion: AdLandingConversion
  attribution?: AttributionPayload
}) {
  const convertedAt = new Date()
  const conversionData = { convertedAt, conversion: input.conversion }

  if (input.visitorId) {
    const visit = await prisma.landingVisit.findUnique({
      where: {
        visitorId_landingPath: {
          visitorId: input.visitorId,
          landingPath: input.landingPath,
        },
      },
      select: { id: true, convertedAt: true },
    })
    if (visit) {
      if (!visit.convertedAt) {
        await prisma.landingVisit.update({
          where: { id: visit.id },
          data: conversionData,
        })
      }
      return
    }
  }

  const fbclid = input.attribution?.fbclid
  if (fbclid) {
    const result = await prisma.landingVisit.updateMany({
      where: { landingPath: input.landingPath, fbclid, convertedAt: null },
      data: conversionData,
    })
    if (result.count > 0) return
  }

  const fbp = input.attribution?.fbp
  if (!fbp) return

  const visit = await prisma.landingVisit.findFirst({
    where: { landingPath: input.landingPath, fbp, convertedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  })
  if (!visit) return

  await prisma.landingVisit.update({
    where: { id: visit.id },
    data: conversionData,
  })
}
