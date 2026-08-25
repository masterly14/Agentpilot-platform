import {
  fail,
  getPixelId,
  pass,
  pixelSnippetPresent,
  request,
  type CheckResult,
  type CookieJar,
  UTM_QUERY,
} from "./lib.ts"

const PUBLIC_LANDINGS = [
  "/",
  "/ebook",
  "/ebook-3d",
  "/qualificacion",
  "/diagnosis",
  "/agendar",
  "/Cozy-apartments",
  "/gracias",
  "/resultados",
  "/proteccion-de-datos",
]

function hasAttributionCookies(jar: CookieJar) {
  return Boolean(jar.get("ap_utm_source") && jar.get("ap_utm_campaign") && jar.get("ap_fbclid"))
}

export async function runLandingChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  const pixelId = getPixelId()
  if (!pixelId) {
    results.push(fail("pixel-id", "NEXT_PUBLIC_FACEBOOK_PIXEL_ID / META_PIXEL_ID no está definido"))
  }

  for (const route of PUBLIC_LANDINGS) {
    const jar: CookieJar = new Map()
    const response = await request(`${route}?${UTM_QUERY}`, { jar, redirect: "follow" })
    const html = await response.text()
    results.push(
      response.status === 200
        ? pass(`landing ${route} status`, "200")
        : fail(`landing ${route} status`, `status ${response.status}`),
    )
    if (pixelId) {
      results.push(
        pixelSnippetPresent(html, pixelId)
          ? pass(`landing ${route} pixel`, "Pixel + PageView")
          : fail(`landing ${route} pixel`, "HTML no incluye Pixel ID / PageView / fbevents"),
      )
    }
    results.push(
      hasAttributionCookies(jar)
        ? pass(`landing ${route} utm cookies`, "ap_utm_source, ap_utm_campaign, ap_fbclid")
        : fail(
            `landing ${route} utm cookies`,
            `cookies=${[...jar.keys()].join(",") || "(ninguna)"}`,
          ),
    )
  }

  const diagnostico = await request("/diagnostico")
  results.push(
    diagnostico.status === 404
      ? pass("diagnostico sin lead", "404")
      : fail("diagnostico sin lead", `status ${diagnostico.status}, se esperaba 404`),
  )

  const adminJar: CookieJar = new Map()
  const admin = await request("/admin", { jar: adminJar, redirect: "follow" })
  const adminHtml = await admin.text()
  if (pixelId) {
    results.push(
      pixelSnippetPresent(adminHtml, pixelId)
        ? fail("admin sin pixel", "/admin incluye el snippet del Pixel")
        : pass("admin sin pixel", "no hay PageView de CRM hacia Meta"),
    )
  }

  return results
}
