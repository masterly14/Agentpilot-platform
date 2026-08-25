import {
  eventIdFor,
  fail,
  pass,
  prisma,
  request,
  sqlLeadPayload,
  uniquePhone,
  uniqueTestEmail,
  waitForCapi,
  type CheckResult,
  type CookieJar,
  UTM_QUERY,
} from "./lib.ts"

type SubmitJson = {
  success?: boolean
  id?: string
  token?: string
  eventId?: string | null
  qualification?: string
  error?: string
}

type MonthJson = {
  availableDays?: number[]
  slotsByDate?: Record<string, { start: string; available?: boolean }[]>
  error?: string
}

type BookingJson = {
  success?: boolean
  marketingEventId?: string | null
  error?: string
}

async function visitWithUtm() {
  const jar: CookieJar = new Map()
  const response = await request(`/ebook?${UTM_QUERY}`, { jar, redirect: "follow" })
  await response.text()
  return jar
}

async function submitLead(jar: CookieJar, email: string, phoneNumber: string) {
  const response = await request("/api/submit-form", {
    method: "POST",
    jar,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(sqlLeadPayload({ email, phoneNumber })),
  })
  const json = (await response.json().catch(() => ({}))) as SubmitJson
  return { status: response.status, json }
}

async function assertCapi(results: CheckResult[], eventId: string, label: string) {
  const capi = await waitForCapi(eventId)
  results.push(
    capi.sent
      ? pass(`${label} CAPI sentToMeta`, "true")
      : fail(`${label} CAPI sentToMeta`, "el evento no se envió a Meta"),
  )
  if (capi.sent) {
    results.push(
      capi.eventsReceived >= 1
        ? pass(`${label} CAPI events_received`, String(capi.eventsReceived))
        : fail(`${label} CAPI events_received`, `events_received=${capi.eventsReceived}`),
    )
  }
}

async function adminLogin() {
  const jar: CookieJar = new Map()
  const password = process.env.ADMIN_PASSWORD?.trim()
  if (!password) throw new Error("Falta ADMIN_PASSWORD")
  const response = await request("/api/admin/login", {
    method: "POST",
    jar,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  })
  if (response.status !== 200) {
    throw new Error(`login admin ${response.status}: ${await response.text()}`)
  }
  return jar
}

async function pickBookingSlot() {
  const monthRes = await request("/api/booking/month")
  if (!monthRes.ok) {
    return { error: `month ${monthRes.status}: ${await monthRes.text()}` }
  }
  const month = (await monthRes.json()) as MonthJson
  for (const [date, slots] of Object.entries(month.slotsByDate ?? {})) {
    const start = slots?.find((slot) => slot.available !== false)?.start
    if (date && start) return { date, slotStart: start }
  }
  return { error: "sin slots en /api/booking/month" }
}

export async function runFunnelChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  const jar = await visitWithUtm()
  results.push(
    jar.get("ap_utm_source") && jar.get("ap_fbclid")
      ? pass("visita UTM", "cookies de atribución listas")
      : fail("visita UTM", `cookies=${[...jar.keys()].join(",")}`),
  )

  const submittedA = await submitLead(jar, uniqueTestEmail("a"), uniquePhone())
  const submittedB = await submitLead(jar, uniqueTestEmail("b"), uniquePhone())

  results.push(
    submittedA.status === 200 && submittedA.json.id
      ? pass("submit-form A", submittedA.json.id)
      : fail("submit-form A", `${submittedA.status} ${submittedA.json.error ?? JSON.stringify(submittedA.json)}`),
  )
  results.push(
    submittedB.status === 200 && submittedB.json.id
      ? pass("submit-form B", submittedB.json.id)
      : fail("submit-form B", `${submittedB.status} ${submittedB.json.error ?? JSON.stringify(submittedB.json)}`),
  )

  if (!submittedA.json.id || !submittedA.json.token) return results

  const submissionA = await prisma.formSubmission.findUnique({
    where: { id: submittedA.json.id },
    include: { events: true },
  })
  if (!submissionA) {
    results.push(fail("lead persistido", "no está en Prisma"))
    return results
  }

  const leadEventId = eventIdFor(submissionA.id, "Lead")
  results.push(
    submissionA.utmSource === "meta" &&
      submissionA.utmCampaign === "funnel_test" &&
      submissionA.fbclid === "TESTCLID"
      ? pass("atribución first-touch", `${submissionA.utmSource}/${submissionA.utmCampaign}/${submissionA.fbclid}`)
      : fail(
          "atribución first-touch",
          `utmSource=${submissionA.utmSource} utmCampaign=${submissionA.utmCampaign} fbclid=${submissionA.fbclid}`,
        ),
  )
  results.push(
    submissionA.marketingFunnelStage === "LEAD_MAGNET_SENT"
      ? pass("etapa guía", "LEAD_MAGNET_SENT")
      : fail("etapa guía", String(submissionA.marketingFunnelStage)),
  )
  const leadEvent = submissionA.events.find((event) => event.eventName === "LEAD")
  results.push(
    leadEvent?.id === leadEventId
      ? pass("eventId Lead", leadEventId)
      : fail("eventId Lead", `db=${leadEvent?.id} esperado=${leadEventId}`),
  )
  results.push(
    submittedA.json.eventId === leadEventId
      ? pass("JSON eventId alineado al Pixel", String(submittedA.json.eventId))
      : fail("JSON eventId alineado al Pixel", `json=${submittedA.json.eventId} esperado=${leadEventId}`),
  )
  await assertCapi(results, leadEventId, "Lead")

  const video = await request(`/api/pipeline/video?token=${encodeURIComponent(submissionA.pdfToken)}`)
  results.push(
    video.status === 307 || video.status === 302 || video.status === 200
      ? pass("click video", `status ${video.status}`)
      : fail("click video", `status ${video.status}`),
  )
  const afterVideo = await prisma.formSubmission.findUnique({
    where: { id: submissionA.id },
    include: { events: true },
  })
  const viewEventId = eventIdFor(submissionA.id, "ViewContent")
  const viewEvent = afterVideo?.events.find((event) => event.eventName === "VIEW_CONTENT")
  results.push(
    afterVideo?.marketingFunnelStage === "VIDEO_SENT"
      ? pass("etapa video", "VIDEO_SENT")
      : fail("etapa video", String(afterVideo?.marketingFunnelStage)),
  )
  results.push(
    viewEvent?.id === viewEventId && Number(viewEvent.value) === 1
      ? pass("evento ViewContent", `${viewEventId} value=1`)
      : fail("evento ViewContent", `id=${viewEvent?.id} value=${viewEvent?.value}`),
  )
  if (viewEvent) await assertCapi(results, viewEventId, "ViewContent")

  const slot = await pickBookingSlot()
  if ("error" in slot && slot.error) {
    results.push(fail("Schedule calendar", slot.error))
  } else if ("date" in slot && slot.date && slot.slotStart) {
    const booked = await request("/api/booking", {
      method: "POST",
      jar,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        date: slot.date,
        slotStart: slot.slotStart,
        leadToken: submissionA.pdfToken,
        bookingFlow: "EBOOK_SQL",
      }),
    })
    const bookedJson = (await booked.json().catch(() => ({}))) as BookingJson
    results.push(
      booked.ok && bookedJson.success !== false && booked.status < 400
        ? pass("POST booking", `${slot.date} ${slot.slotStart}`)
        : fail("POST booking", `${booked.status} ${bookedJson.error ?? JSON.stringify(bookedJson)}`),
    )
    const afterBook = await prisma.formSubmission.findUnique({
      where: { id: submissionA.id },
      include: { events: true },
    })
    const scheduleId = eventIdFor(submissionA.id, "Schedule")
    const scheduleEvent = afterBook?.events.find((event) => event.eventName === "SCHEDULE")
    results.push(
      afterBook?.marketingFunnelStage === "SCHEDULED"
        ? pass("etapa agendado", "SCHEDULED")
        : fail("etapa agendado", String(afterBook?.marketingFunnelStage)),
    )
    results.push(
      scheduleEvent?.id === scheduleId && Number(scheduleEvent.value) === 25
        ? pass("evento Schedule", `${scheduleId} value=25`)
        : fail("evento Schedule", `id=${scheduleEvent?.id} value=${scheduleEvent?.value}`),
    )
    results.push(
      bookedJson.marketingEventId === scheduleId || bookedJson.marketingEventId == null
        ? bookedJson.marketingEventId === scheduleId
          ? pass("marketingEventId = trackSchedule", String(bookedJson.marketingEventId))
          : fail("marketingEventId = trackSchedule", `json=${bookedJson.marketingEventId} esperado=${scheduleId}`)
        : fail("marketingEventId = trackSchedule", `json=${bookedJson.marketingEventId} esperado=${scheduleId}`),
    )
    if (scheduleEvent) await assertCapi(results, scheduleId, "Schedule")
  }

  let adminJar: CookieJar
  try {
    adminJar = await adminLogin()
    results.push(pass("admin login", "sv_admin_session"))
  } catch (error) {
    results.push(fail("admin login", error instanceof Error ? error.message : String(error)))
    return results
  }

  const attend = await request("/api/admin/pipeline/attend", {
    method: "POST",
    jar: adminJar,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ submissionId: submissionA.id }),
  })
  results.push(
    attend.ok
      ? pass("POST attend", `${attend.status}`)
      : fail("POST attend", `${attend.status} ${await attend.text()}`),
  )
  const afterAttend = await prisma.formSubmission.findUnique({
    where: { id: submissionA.id },
    include: { events: true },
  })
  const showId = eventIdFor(submissionA.id, "ShowUp")
  const showEvent = afterAttend?.events.find((event) => event.eventName === "SHOW_UP")
  results.push(
    afterAttend?.marketingFunnelStage === "SHOWED_UP"
      ? pass("etapa show-up", "SHOWED_UP")
      : fail("etapa show-up", String(afterAttend?.marketingFunnelStage)),
  )
  results.push(
    showEvent?.id === showId && Number(showEvent.value) === 60
      ? pass("evento ShowUp", `${showId} value=60`)
      : fail("evento ShowUp", `id=${showEvent?.id} value=${showEvent?.value}`),
  )
  if (showEvent) await assertCapi(results, showId, "ShowUp")

  if (submittedB.json.id) {
    const noShow = await request("/api/admin/pipeline/no-show", {
      method: "POST",
      jar: adminJar,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ submissionId: submittedB.json.id }),
    })
    results.push(
      noShow.ok
        ? pass("POST no-show", `${noShow.status}`)
        : fail("POST no-show", `${noShow.status} ${await noShow.text()}`),
    )
    const leadB = await prisma.formSubmission.findUnique({
      where: { id: submittedB.json.id },
      include: { events: true },
    })
    const banned = leadB?.events.filter((event) => event.eventName === "SHOW_UP" || event.eventName === "PURCHASE") ?? []
    results.push(
      leadB?.marketingFunnelStage === "NO_SHOW"
        ? pass("etapa no-show", "NO_SHOW")
        : fail("etapa no-show", String(leadB?.marketingFunnelStage)),
    )
    results.push(
      banned.length === 0
        ? pass("no-show sin ShowUp/Purchase", "0 eventos CAPI de cierre")
        : fail("no-show sin ShowUp/Purchase", banned.map((event) => event.eventName).join(",")),
    )
  }

  const closeNoAmount = await request(`/api/submissions/${submissionA.id}`, {
    method: "PATCH",
    jar: adminJar,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "CLOSED_WON" }),
  })
  results.push(
    closeNoAmount.status === 400
      ? pass("cierre sin monto", "400")
      : fail("cierre sin monto", `status ${closeNoAmount.status}`),
  )

  const close = await request(`/api/submissions/${submissionA.id}`, {
    method: "PATCH",
    jar: adminJar,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      status: "CLOSED_WON",
      contractValueUsd: 3000,
      contractPlan: "THREE_MONTH",
    }),
  })
  results.push(
    close.ok
      ? pass("cierre con monto", `${close.status}`)
      : fail("cierre con monto", `${close.status} ${await close.text()}`),
  )
  const afterClose = await prisma.formSubmission.findUnique({
    where: { id: submissionA.id },
    include: { events: true },
  })
  const purchaseId = eventIdFor(submissionA.id, "Purchase")
  const purchaseEvent = afterClose?.events.find((event) => event.eventName === "PURCHASE")
  results.push(
    afterClose?.marketingFunnelStage === "PURCHASED"
      ? pass("etapa comprado", "PURCHASED")
      : fail("etapa comprado", String(afterClose?.marketingFunnelStage)),
  )
  results.push(
    purchaseEvent?.id === purchaseId && Number(purchaseEvent.value) === 3000
      ? pass("evento Purchase", `${purchaseId} value=3000`)
      : fail("evento Purchase", `id=${purchaseEvent?.id} value=${purchaseEvent?.value}`),
  )
  if (purchaseEvent) await assertCapi(results, purchaseId, "Purchase")

  return results
}
