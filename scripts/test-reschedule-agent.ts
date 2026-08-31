import assert from "node:assert/strict"
const intent = (body = "", buttonId = "") =>
  buttonId.startsWith("reschedule_") ||
  /\b(reagend|reprogram|no (puedo|voy a poder)|otro d[ií]a|cambiar (la )?hora|me surgi[oó]|imprevisto)\b/i.test(body)
const window = (body: string) =>
  /\b(mañana|manana|am|temprano)\b/i.test(body) ? "morning" : /\b(tarde|pm)\b/i.test(body) ? "afternoon" : undefined

assert.equal(window("me surgió algo en la tarde"), "afternoon")
assert.equal(window("solo puedo en la mañana"), "morning")
assert.equal(intent("No voy a poder asistir, ¿podemos reagendar?"), true)
assert.equal(intent("Gracias, nos vemos"), false)
assert.equal(intent("", "reschedule_confirm"), true)

console.log("reschedule-agent tests passed")
