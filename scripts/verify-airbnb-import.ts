/**
 * Conteos post-import en la Neon del CRM. No imprime PII ni URLs.
 *
 *   pnpm airbnb:verify
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { PrismaClient } from "../prisma/generated/client/index.js"

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) throw new Error(`No encontré ${filePath}.`)
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
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
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env"))
const prisma = new PrismaClient()

try {
  const [
    leads,
    messages,
    hostContacts,
    accounts,
    commercial,
    handoff,
    scheduled,
    takeover,
    won,
  ] = await Promise.all([
    prisma.airbnbLead.count(),
    prisma.airbnbMessage.count(),
    prisma.hostContact.count(),
    prisma.prospectAccount.count(),
    prisma.airbnbCommercial.count(),
    prisma.airbnbCommercial.count({ where: { stage: "HANDOFF" } }),
    prisma.airbnbCommercial.count({ where: { stage: "SCHEDULED" } }),
    prisma.airbnbLead.count({ where: { status: "HUMAN_TAKEOVER" } }),
    prisma.airbnbLead.count({ where: { status: "CLOSED_WON" } }),
  ])

  const sample = await prisma.airbnbLead.findFirst({
    where: { commercial: { isNot: null } },
    include: { commercial: true, messages: { take: 1 }, hostContact: true },
  })

  console.log(
    JSON.stringify(
      {
        leads,
        messages,
        hostContacts,
        accounts,
        commercial,
        commercialHandoff: handoff,
        commercialScheduled: scheduled,
        leadHumanTakeover: takeover,
        leadClosedWon: won,
        sample: sample
          ? {
              status: sample.status,
              commercialStage: sample.commercial?.stage,
              hasMessages: sample.messages.length > 0,
              hasHostContact: Boolean(sample.hostContact),
            }
          : null,
      },
      null,
      2,
    ),
  )
} finally {
  await prisma.$disconnect()
}
