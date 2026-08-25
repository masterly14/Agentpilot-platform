import { getConfluenceConfig, isConfluenceConfigured } from "@/lib/confluence/config"
import { analysisToken, recordingToken, type FathomMeeting } from "@/lib/fathom/payload"
import { meetingPageBody, meetingPageTitle } from "@/lib/fathom/page-body"

export class ConfluenceError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: string,
  ) {
    super(message)
  }
}

type ConfluencePage = {
  id: string
  title: string
  status?: string
  _links?: { webui?: string; base?: string }
  body?: { storage?: { value?: string } }
}

type SpaceResponse = {
  id: string
  key?: string
  homepageId?: string
}

type PageListResponse = {
  results?: ConfluencePage[]
}

type CqlSearchResponse = {
  results?: Array<{ content?: { id?: string; title?: string }; url?: string }>
}

export type PublishMeetingResult = {
  pageId: string
  title: string
  url: string
  created: boolean
}

function wikiUrl(site: string, path: string) {
  return `https://${site}/wiki${path}`
}

function pageUrl(site: string, page: ConfluencePage) {
  if (page._links?.webui) {
    return `https://${site}/wiki${page._links.webui}`
  }
  return `https://${site}/wiki/spaces/viewpage.action?pageId=${page.id}`
}

async function confluenceFetch(path: string, init?: RequestInit) {
  const config = getConfluenceConfig()
  const auth = Buffer.from(`${config.email}:${config.token}`).toString("base64")
  const response = await fetch(wikiUrl(config.site, path), {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  })
  const text = await response.text()
  if (!response.ok) {
    throw new ConfluenceError(`Confluence ${response.status} ${path}`, response.status, text)
  }
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ConfluenceError("Confluence devolvió JSON inválido", response.status, text)
  }
}

async function getSpace() {
  const { spaceId } = getConfluenceConfig()
  return (await confluenceFetch(`/api/v2/spaces/${encodeURIComponent(spaceId)}`)) as SpaceResponse
}

async function findPageByTitle(spaceId: string, title: string) {
  const params = new URLSearchParams({
    title,
    status: "current",
    limit: "25",
  })
  const data = (await confluenceFetch(
    `/api/v2/spaces/${encodeURIComponent(spaceId)}/pages?${params}`,
  )) as PageListResponse
  return data.results?.find((page) => page.title === title) ?? null
}

async function getPageStorage(pageId: string) {
  const params = new URLSearchParams({ "body-format": "storage" })
  return (await confluenceFetch(`/api/v2/pages/${encodeURIComponent(pageId)}?${params}`)) as ConfluencePage
}

async function findPageByToken(spaceKey: string | undefined, token: string) {
  const cql = spaceKey
    ? `space = "${spaceKey}" AND type = page AND text ~ "${token}"`
    : `type = page AND text ~ "${token}"`
  const params = new URLSearchParams({
    cql,
    limit: "5",
  })
  try {
    const data = (await confluenceFetch(`/rest/api/content/search?${params}`)) as CqlSearchResponse
    const match = data.results?.find((row) => row.content?.id)
    if (match?.content?.id) {
      return {
        id: match.content.id,
        title: match.content.title || token,
      } satisfies ConfluencePage
    }
  } catch (error) {
    console.warn("[confluence] búsqueda CQL falló", error)
  }
  return null
}

async function findPageByRecordingId(spaceKey: string | undefined, recordingId: number) {
  return findPageByToken(spaceKey, recordingToken(recordingId))
}

async function createPage(input: {
  spaceId: string
  title: string
  parentId: string
  body: string
}) {
  return (await confluenceFetch("/api/v2/pages", {
    method: "POST",
    body: JSON.stringify({
      spaceId: input.spaceId,
      status: "current",
      title: input.title,
      parentId: input.parentId,
      body: {
        representation: "storage",
        value: input.body,
      },
    }),
  })) as ConfluencePage
}

async function ensureParentPage(title: string, introHtml: string) {
  const config = getConfluenceConfig()
  const space = await getSpace()
  const existing = await findPageByTitle(config.spaceId, title)
  if (existing) return existing
  if (!space.homepageId) {
    throw new ConfluenceError("El espacio de Confluence no tiene homepageId", 500)
  }
  return createPage({
    spaceId: config.spaceId,
    title,
    parentId: space.homepageId,
    body: introHtml,
  })
}

function isTitleConflict(error: unknown) {
  if (!(error instanceof ConfluenceError) || error.status !== 400) return false
  const details = (error.details || "").toLowerCase()
  return details.includes("already exists")
}

async function createTokenPage(input: {
  spaceId: string
  parentId: string
  title: string
  body: string
  token: string
}) {
  try {
    return { page: await createPage(input), created: true }
  } catch (error) {
    if (!isTitleConflict(error)) throw error
    const existing = await findPageByTitle(input.spaceId, input.title)
    if (!existing) throw error
    const withBody = await getPageStorage(existing.id)
    if ((withBody.body?.storage?.value || "").includes(input.token)) {
      return { page: existing, created: false }
    }
    const uniqueTitle = `${input.title} · ${input.token}`
    return {
      page: await createPage({ ...input, title: uniqueTitle.slice(0, 240) }),
      created: true,
    }
  }
}

async function createMeetingPage(input: {
  spaceId: string
  parentId: string
  title: string
  body: string
  recordingId: number
}) {
  return createTokenPage({
    ...input,
    token: recordingToken(input.recordingId),
  })
}

export async function publishMeetingToConfluence(meeting: FathomMeeting): Promise<PublishMeetingResult> {
  if (!isConfluenceConfigured()) {
    throw new ConfluenceError("Confluence no está configurado", 503)
  }

  const config = getConfluenceConfig()
  const space = await getSpace()
  const existing = await findPageByRecordingId(space.key, meeting.recording_id)
  if (existing) {
    return {
      pageId: existing.id,
      title: existing.title,
      url: pageUrl(config.site, existing),
      created: false,
    }
  }

  const parent = await ensureParentPage(
    config.parentTitle,
    "<p>Notas automáticas de reuniones grabadas en Fathom.</p>",
  )
  const title = meetingPageTitle(meeting)
  const body = meetingPageBody(meeting)
  const { page, created } = await createMeetingPage({
    spaceId: config.spaceId,
    parentId: parent.id,
    title,
    body,
    recordingId: meeting.recording_id,
  })

  return {
    pageId: page.id,
    title: page.title,
    url: pageUrl(config.site, page),
    created,
  }
}

function storageToPlain(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|li|tr|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export async function getConfluencePagePlainText(pageId: string) {
  const page = await getPageStorage(pageId)
  const storage = page.body?.storage?.value || ""
  return storageToPlain(storage)
}

export async function publishAnalysisToConfluence(input: {
  recordingId: number
  title: string
  body: string
}): Promise<PublishMeetingResult> {
  if (!isConfluenceConfigured()) {
    throw new ConfluenceError("Confluence no está configurado", 503)
  }

  const config = getConfluenceConfig()
  const token = analysisToken(input.recordingId)
  const space = await getSpace()
  const existing = await findPageByToken(space.key, token)
  if (existing) {
    return {
      pageId: existing.id,
      title: existing.title,
      url: pageUrl(config.site, existing),
      created: false,
    }
  }

  const parent = await ensureParentPage(
    config.analysisParentTitle,
    "<p>Coaching automático de llamadas de venta. Cada página evalúa pitch, objeciones, estructura y cierre.</p>",
  )
  const { page, created } = await createTokenPage({
    spaceId: config.spaceId,
    parentId: parent.id,
    title: input.title,
    body: input.body,
    token,
  })

  return {
    pageId: page.id,
    title: page.title,
    url: pageUrl(config.site, page),
    created,
  }
}
