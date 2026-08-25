import { PrismaClient } from "../prisma/generated/client/index.js"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

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
  const mutex = await prisma.systemState.findUnique({
    where: { key: "IS_PLAYWRIGHT_RUNNING" },
  })
  if (mutex && mutex.value !== "false") {
    await prisma.systemState.update({
      where: { key: "IS_PLAYWRIGHT_RUNNING" },
      data: { value: "false" },
    })
    console.log("Reset IS_PLAYWRIGHT_RUNNING to false (no workers were running during cutover).")
  } else {
    console.log("IS_PLAYWRIGHT_RUNNING already false or missing.")
  }
} finally {
  await prisma.$disconnect()
}
