/**
 * Copia tablas operativas de Airbnb → Neon del CRM (IDs UUID iguales)
 * y backfillea AirbnbCommercial. No crea FormSubmission ni LeadEvent/CAPI.
 *
 *   pnpm airbnb:import -- --source-env "../Agent Pilot Prospect Airbnb/.env"
 *   pnpm airbnb:import -- --dry-run --source-env "..."
 *   pnpm airbnb:import -- --force --source-env "..."
 *   pnpm airbnb:import -- --backfill-only
 *
 * Origen: AIRBNB_SOURCE_DATABASE_URL, o DATABASE_URL del --source-env.
 * Destino: DATABASE_URL del .env del CRM.
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { PrismaClient } from "../prisma/generated/client/index.js"

const CRM_ENV = path.resolve(process.cwd(), ".env")
const BATCH = 200

function loadEnvFile(filePath: string, overwrite = false) {
  if (!existsSync(filePath)) {
    throw new Error(`No encontré ${filePath}.`)
  }
  const text = readFileSync(filePath, "utf8")
  const parsed: Record<string, string> = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    parsed[key] = value
    if (overwrite || process.env[key] === undefined) process.env[key] = value
  }
  return parsed
}

function argValue(flag: string) {
  const idx = process.argv.indexOf(flag)
  if (idx < 0) return null
  return process.argv[idx + 1] ?? null
}

function hasFlag(flag: string) {
  return process.argv.includes(flag)
}

function requireUrl(name: string, value: string | undefined) {
  const trimmed = value?.trim()
  if (!trimmed) throw new Error(`Falta ${name}.`)
  return trimmed
}

function chunk<T>(items: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

async function copyMany<T extends { id?: string; key?: string }>(
  label: string,
  rows: T[],
  write: (batch: T[]) => Promise<{ count: number }>,
) {
  let copied = 0
  for (const batch of chunk(rows, BATCH)) {
    const result = await write(batch)
    copied += result.count
  }
  console.log(`  ${label}: ${copied}/${rows.length}`)
  return copied
}

type Counts = {
  prospectAccount: number
  systemState: number
  dailyOutboundStats: number
  leadIdentityAlias: number
  airbnbLead: number
  airbnbMessage: number
  hostContact: number
  calBooking: number
  accountBlockEvent: number
  airbnbCommercial?: number
}

async function readCounts(client: PrismaClient, includeCommercial: boolean): Promise<Counts> {
  const [
    prospectAccount,
    systemState,
    dailyOutboundStats,
    leadIdentityAlias,
    airbnbLead,
    airbnbMessage,
    hostContact,
    calBooking,
    accountBlockEvent,
  ] = await Promise.all([
    client.prospectAccount.count(),
    client.systemState.count(),
    client.dailyOutboundStats.count(),
    client.leadIdentityAlias.count(),
    client.airbnbLead.count(),
    client.airbnbMessage.count(),
    client.hostContact.count(),
    client.calBooking.count(),
    client.accountBlockEvent.count(),
  ])
  return {
    prospectAccount,
    systemState,
    dailyOutboundStats,
    leadIdentityAlias,
    airbnbLead,
    airbnbMessage,
    hostContact,
    calBooking,
    accountBlockEvent,
    ...(includeCommercial ? { airbnbCommercial: await client.airbnbCommercial.count() } : {}),
  }
}

function printCounts(title: string, counts: Counts) {
  console.log(title)
  for (const [key, value] of Object.entries(counts)) {
    console.log(`  ${key}: ${value}`)
  }
}

async function importOperational(source: PrismaClient, dest: PrismaClient, force: boolean) {
  const destCounts = await readCounts(dest, true)
  if (destCounts.airbnbLead > 0 && !force) {
    throw new Error(
      `El destino ya tiene ${destCounts.airbnbLead} leads Airbnb. Usa --force para skipDuplicates.`,
    )
  }

  const skipDuplicates = force

  const prospectAccounts = await source.prospectAccount.findMany()
  await copyMany("ProspectAccount", prospectAccounts, (data) =>
    dest.prospectAccount.createMany({ data, skipDuplicates }),
  )

  const systemStates = await source.systemState.findMany()
  await copyMany("SystemState", systemStates, (data) =>
    dest.systemState.createMany({ data, skipDuplicates }),
  )

  const dailyStats = await source.dailyOutboundStats.findMany()
  await copyMany("DailyOutboundStats", dailyStats, (data) =>
    dest.dailyOutboundStats.createMany({ data, skipDuplicates }),
  )

  const aliases = await source.leadIdentityAlias.findMany()
  await copyMany("LeadIdentityAlias", aliases, (data) =>
    dest.leadIdentityAlias.createMany({ data, skipDuplicates }),
  )

  // El origen no tiene hostEmail/contactId (columnas solo CRM).
  const leads = await source.airbnbLead.findMany({
    select: {
      id: true,
      hostAirbnbId: true,
      threadId: true,
      name: true,
      hostProfileUrl: true,
      primaryListingUrl: true,
      primaryListingName: true,
      totalProperties: true,
      companyName: true,
      isSuperhost: true,
      market: true,
      icpSkipReason: true,
      status: true,
      businessScale: true,
      painPoints: true,
      executiveSummary: true,
      lastContactedAt: true,
      nextFollowUpAt: true,
      botReplyCount: true,
      calLinkSent: true,
      calBookedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  await copyMany("Lead", leads, (data) => dest.airbnbLead.createMany({ data, skipDuplicates }))

  const messages = await source.airbnbMessage.findMany()
  await copyMany("Message", messages, (data) =>
    dest.airbnbMessage.createMany({ data, skipDuplicates }),
  )

  const hostContacts = await source.hostContact.findMany()
  await copyMany("HostContact", hostContacts, (data) =>
    dest.hostContact.createMany({ data, skipDuplicates }),
  )

  const calBookings = await source.calBooking.findMany()
  await copyMany("CalBooking", calBookings, (data) =>
    dest.calBooking.createMany({ data, skipDuplicates }),
  )

  const blockEvents = await source.accountBlockEvent.findMany()
  await copyMany("AccountBlockEvent", blockEvents, (data) =>
    dest.accountBlockEvent.createMany({ data, skipDuplicates }),
  )
}

async function backfillCommercial(dest: PrismaClient) {
  const leads = await dest.airbnbLead.findMany({
    where: { status: { in: ["HUMAN_TAKEOVER", "CLOSED_WON"] } },
    include: {
      calBookings: { orderBy: { startTime: "asc" } },
      commercial: true,
    },
  })

  let created = 0
  let skipped = 0
  let hostEmails = 0

  for (const lead of leads) {
    const booking = lead.calBookings[0]
    const attendeeEmail = booking?.attendeeEmail?.trim() || null
    const meetingTime = lead.calBookedAt ?? booking?.startTime ?? null

    if (attendeeEmail && lead.hostEmail !== attendeeEmail) {
      await dest.airbnbLead.update({
        where: { id: lead.id },
        data: { hostEmail: attendeeEmail },
      })
      hostEmails += 1
    }

    const stage =
      lead.status === "CLOSED_WON" && meetingTime ? "SCHEDULED" : "HANDOFF"

    if (lead.commercial) {
      skipped += 1
      continue
    }

    await dest.airbnbCommercial.create({
      data: {
        leadId: lead.id,
        stage,
        hostEmail: attendeeEmail ?? lead.hostEmail,
        meetingTime: stage === "SCHEDULED" ? meetingTime : null,
      },
    })
    created += 1
  }

  console.log(
    `  AirbnbCommercial: created=${created} skipped=${skipped} hostEmailUpdated=${hostEmails} candidates=${leads.length}`,
  )
  console.log("  LeadEvent/CAPI: none (histórico a propósito)")
}

async function main() {
  loadEnvFile(CRM_ENV)

  const sourceEnvPath = argValue("--source-env")
  const sourceFromFile = sourceEnvPath
    ? loadEnvFile(path.resolve(sourceEnvPath), false).DATABASE_URL
    : undefined

  const destUrl = requireUrl("DATABASE_URL", process.env.DATABASE_URL)
  const sourceUrl = requireUrl(
    "AIRBNB_SOURCE_DATABASE_URL",
    process.env.AIRBNB_SOURCE_DATABASE_URL || sourceFromFile,
  )

  if (sourceUrl === destUrl) {
    throw new Error("Origen y destino son la misma URL. Abortando.")
  }

  const dryRun = hasFlag("--dry-run")
  const force = hasFlag("--force")
  const backfillOnly = hasFlag("--backfill-only")

  const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } })
  const dest = new PrismaClient({ datasources: { db: { url: destUrl } } })

  try {
    await dest.$queryRaw`SELECT 1`
    if (!backfillOnly) await source.$queryRaw`SELECT 1`

    if (!backfillOnly) {
      printCounts("Origen", await readCounts(source, false))
      printCounts("Destino (antes)", await readCounts(dest, true))
    } else {
      printCounts("Destino (antes)", await readCounts(dest, true))
    }

    if (dryRun) {
      console.log("Dry-run: no se escribió nada.")
      return
    }

    if (!backfillOnly) {
      console.log("Copiando tablas operativas…")
      await importOperational(source, dest, force)
    }

    console.log("Backfill comercial…")
    await backfillCommercial(dest)

    printCounts("Destino (después)", await readCounts(dest, true))

    const sample = await dest.airbnbLead.findFirst({
      where: { messages: { some: {} } },
      include: { messages: { take: 3 }, hostContact: true, commercial: true },
    })
    if (sample) {
      console.log(
        `Sample lead ${sample.id} status=${sample.status} messages=${sample.messages.length} hostContact=${Boolean(sample.hostContact)} commercial=${sample.commercial?.stage ?? "none"}`,
      )
    } else {
      console.log("Sample: no hay leads con mensajes en destino.")
    }
  } finally {
    await source.$disconnect()
    await dest.$disconnect()
  }
}

try {
  await main()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
