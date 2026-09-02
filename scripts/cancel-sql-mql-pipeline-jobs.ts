import { existsSync, readFileSync } from "node:fs"
import { PrismaClient } from "../prisma/generated/client/index.js"
import { cancelPendingPipelineJobs } from "../lib/pipeline/schedule.js"

if (existsSync(".env")) {
  for (const raw of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const line = raw.trim()
    const separator = line.indexOf("=")
    if (!line || line.startsWith("#") || separator < 1) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

const prisma = new PrismaClient()

async function main() {
  const pipelines = await prisma.leadPipeline.findMany({
    include: {
      contact: {
        include: {
          submissions: {
            where: { qualification: { in: ["SQL", "MQL"] } },
            select: { id: true },
          },
        },
      },
    },
  })

  const targets = pipelines.filter((pipeline) => pipeline.contact.submissions.length > 0)
  for (const pipeline of targets) {
    await cancelPendingPipelineJobs(pipeline.id)
  }

  const pending = await prisma.pipelineJob.count({
    where: { pipelineId: { in: targets.map((pipeline) => pipeline.id) }, status: "PENDING" },
  })
  console.log(`Cancelados los trabajos pendientes de ${targets.length} pipelines SQL/MQL. Restantes: ${pending}.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
