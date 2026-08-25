/**
 * Corre landings + acciones reales del funnel contra la app en marcha.
 *
 * Requiere: pnpm dev, DATABASE_URL, ADMIN_PASSWORD, Pixel, CAPI token y META_TEST_EVENT_CODE.
 *
 *   pnpm test:funnel
 */
import { cleanupTestLeads, loadEnvFile, printResults, prisma, requireEnv } from "./funnel-test/lib.ts"
import { runFunnelChecks } from "./funnel-test/funnel.ts"
import { runLandingChecks } from "./funnel-test/landings.ts"

loadEnvFile()

async function assertAppUp() {
  const base = (process.env.FUNNEL_TEST_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "")
  try {
    const response = await fetch(base, { method: "GET", redirect: "manual" })
    await response.arrayBuffer()
  } catch (error) {
    const extra = error instanceof Error ? error.message : String(error)
    throw new Error(`No pude hablar con ${base}. Arranca pnpm dev (o FUNNEL_TEST_BASE_URL). (${extra})`)
  }
}

try {
  requireEnv("DATABASE_URL")
  requireEnv("ADMIN_PASSWORD")
  requireEnv("META_CAPI_ACCESS_TOKEN")
  requireEnv("META_TEST_EVENT_CODE")
  if (!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim() && !process.env.META_PIXEL_ID?.trim()) {
    throw new Error("Falta NEXT_PUBLIC_FACEBOOK_PIXEL_ID o META_PIXEL_ID")
  }
  await assertAppUp()

  const landingResults = await runLandingChecks()
  const funnelResults = await runFunnelChecks()
  await cleanupTestLeads()

  const failed =
    printResults("Landings / Pixel / UTMs", landingResults) +
    printResults("Funnel (Lead → Purchase)", funnelResults)

  if (failed > 0) {
    console.error(`\n${failed} check(s) en FAIL`)
    process.exit(1)
  }
  console.log("\nFunnel verde")
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
