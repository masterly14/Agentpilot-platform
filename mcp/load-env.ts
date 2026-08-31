import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

function mcpDir() {
  if (typeof import.meta !== "undefined" && import.meta.url) {
    return path.dirname(fileURLToPath(import.meta.url))
  }
  const entry = process.argv[1] ? path.resolve(process.argv[1]) : ""
  if (entry && path.basename(path.dirname(entry)) === "mcp") {
    return path.dirname(entry)
  }
  return path.resolve(process.cwd(), "mcp")
}

export function projectRoot() {
  return path.resolve(mcpDir(), "..")
}

function applyEnvFile(filePath: string) {
  if (!existsSync(filePath)) return false
  const text = readFileSync(filePath, "utf8")
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
    if (process.env[key] === undefined) process.env[key] = value
  }
  return true
}

export function loadMcpEnv() {
  const root = projectRoot()
  if (process.cwd() !== root) process.chdir(root)

  const loaded = [".env", ".env.local"]
    .map((file) => applyEnvFile(path.resolve(root, file)))
    .some(Boolean)

  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error(
      loaded
        ? "DATABASE_URL está vacío. Revisa .env o .env.local."
        : `No encontré .env en ${root}. El MCP de leads necesita DATABASE_URL.`,
    )
  }
}
