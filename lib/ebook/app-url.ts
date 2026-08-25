export function getAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "")
  if (explicit) return explicit

  const vercel = process.env.VERCEL_URL?.trim().replace(/\/$/, "")
  if (vercel) return `https://${vercel}`

  return "http://localhost:3000"
}

export function getEbookDownloadUrl(token: string) {
  return `${getAppUrl()}/api/ebook/download?lead=${encodeURIComponent(token)}`
}

export function getAgendarUrl(token: string) {
  return `${getAppUrl()}/agendar?lead=${encodeURIComponent(token)}`
}

export function getSqlDiagnosticoUrl(token: string) {
  return `${getAppUrl()}/diagnostico?lead=${encodeURIComponent(token)}`
}

export function getMqlThanksUrl(token: string) {
  return `${getAppUrl()}/gracias?lead=${encodeURIComponent(token)}`
}
