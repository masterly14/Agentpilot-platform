import { existsSync, readFileSync } from "node:fs"
import { PrismaClient } from "../prisma/generated/client/index.js"

for (const file of [".env", ".env.local"]) {
  if (!existsSync(file)) continue
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim()
    const separator = line.indexOf("=")
    if (!line || line.startsWith("#") || separator < 1) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

const prisma = new PrismaClient()

const BLOCKED_STAGES = ["SCHEDULED", "SHOWED_UP", "DEMO_SCHEDULED", "DISCARDED", "PURCHASED"] as const

async function main() {
  const leads = await prisma.formSubmission.findMany({
    where: {
      qualification: "SQL",
      bookedAt: null,
      status: { not: "PARTIAL" },
      OR: [
        { marketingFunnelStage: null },
        { marketingFunnelStage: { notIn: [...BLOCKED_STAGES] } },
      ],
    },
    select: { id: true, fullName: true, contactId: true, marketingFunnelStage: true },
  })

  if (leads.length === 0) {
    console.log("No hay SQL sin agendar para mover a PENDING_CALL.")
    return
  }

  const ids = leads.map((lead) => lead.id)
  const contactIds = leads.map((lead) => lead.contactId).filter((id): id is string => Boolean(id))

  await prisma.formSubmission.updateMany({
    where: { id: { in: ids } },
    data: { marketingFunnelStage: "PENDING_CALL" },
  })

  if (contactIds.length > 0) {
    await prisma.leadPipeline.updateMany({
      where: {
        contactId: { in: contactIds },
        currentStage: "NURTURING",
      },
      data: { currentState: "COLD_CALL_QUEUED" },
    })
  }

  console.log(
    `Movidos ${leads.length} SQL sin agendar a PENDING_CALL: ${leads
      .map((lead) => `${lead.fullName} (${lead.marketingFunnelStage ?? "sin etapa"} → PENDING_CALL)`)
      .join("; ")}`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
