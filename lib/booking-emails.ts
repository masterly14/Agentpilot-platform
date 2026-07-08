import { bookingConfig } from "@/lib/booking/config"
import { parseBookingDateTime } from "@/lib/booking/datetime"
import {
  formatBookingAnswersForDescription,
  PMS_OPTIONS,
  PROPERTY_OPTIONS,
  REVENUE_OPTIONS,
} from "@/lib/booking/form-options"
import { formatPhoneNumber } from "@/lib/booking/phone-countries"
import type { BookingFormPayload, BookingCreateResponse } from "@/lib/booking/types"
import { getResendFromAddress } from "@/lib/email"
import { getVisitorFirstName } from "@/lib/visitor-confirmation-email"
import { resend } from "@/lib/resend"

const BOOKING_NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL?.trim() || "svaron066@gmail.com"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function getOptionLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

export function formatMeetingDateTime(slotStart: string) {
  const date = parseBookingDateTime(slotStart)

  const datePart = new Intl.DateTimeFormat("es-CO", {
    timeZone: bookingConfig.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)

  const timePart = new Intl.DateTimeFormat("es-CO", {
    timeZone: bookingConfig.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)

  return `${datePart} · ${timePart}`
}

function buildLeadBookingConfirmationEmail(payload: BookingFormPayload, result: BookingCreateResponse) {
  const firstName = escapeHtml(getVisitorFirstName(payload.fullName))
  const meetingWhen = escapeHtml(formatMeetingDateTime(payload.slotStart))
  const meetLink = result.meetLink

  return {
    subject: "Tu reunión está confirmada — Santiago Varón",
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; line-height: 1.7; max-width: 560px;">
        <p style="font-size: 18px; margin-bottom: 24px;">Hola ${firstName},</p>

        <p>Tu reunión con <strong>Santiago Varón</strong> quedó agendada para:</p>

        <p style="margin: 20px 0; padding: 16px 20px; background: #f5f5f5; border-radius: 8px;">
          <strong>${meetingWhen}</strong><br />
          <span style="color: #555;">Zona horaria: ${escapeHtml(bookingConfig.timezone)}</span>
        </p>

        <p>Recibirás también la invitación en Google Calendar con los detalles de la videollamada.</p>

        ${
          meetLink
            ? `<p><a href="${escapeHtml(meetLink)}" style="color: #4338ca;">Abrir enlace de Google Meet</a></p>`
            : ""
        }

        <p style="margin-top: 32px;">
          Nos vemos pronto,<br />
          <strong>Santiago Varón</strong>
        </p>
      </div>
    `,
  }
}

function buildBookingNotificationEmail(payload: BookingFormPayload, result: BookingCreateResponse) {
  const meetingWhen = escapeHtml(formatMeetingDateTime(payload.slotStart))
  const answers = formatBookingAnswersForDescription(payload)
    .split("\n")
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("\n")
  const phone = formatPhoneNumber(payload.phoneCountryCode, payload.phoneNumber)

  return {
    subject: `Nueva llamada agendada: ${payload.fullName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 560px;">
        <h1 style="font-size: 20px; margin-bottom: 16px;">Nueva llamada agendada</h1>

        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Lead</h2>
        <ul>
          <li><strong>Nombre:</strong> ${escapeHtml(payload.fullName)}</li>
          <li><strong>Correo:</strong> ${escapeHtml(payload.email)}</li>
          <li><strong>Teléfono:</strong> ${escapeHtml(phone)}</li>
          ${
            payload.companyName
              ? `<li><strong>Empresa:</strong> ${escapeHtml(payload.companyName)}</li>`
              : ""
          }
          ${
            payload.websiteUrl
              ? `<li><strong>Sitio web:</strong> <a href="${escapeHtml(payload.websiteUrl)}">${escapeHtml(payload.websiteUrl)}</a></li>`
              : ""
          }
        </ul>

        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Reunión</h2>
        <ul>
          <li><strong>Fecha y hora:</strong> ${meetingWhen}</li>
          <li><strong>Duración:</strong> ${bookingConfig.slotMinutes} minutos</li>
          ${
            result.meetLink
              ? `<li><strong>Google Meet:</strong> <a href="${escapeHtml(result.meetLink)}">${escapeHtml(result.meetLink)}</a></li>`
              : ""
          }
          ${
            result.htmlLink
              ? `<li><strong>Calendario:</strong> <a href="${escapeHtml(result.htmlLink)}">Ver evento</a></li>`
              : ""
          }
        </ul>

        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #666;">Calificación</h2>
        <ul>
          ${answers}
        </ul>

        <p style="margin-top: 24px; color: #666; font-size: 13px;">
          PMS: ${escapeHtml(getOptionLabel(PMS_OPTIONS, payload.usesPms))}<br />
          Propiedades: ${escapeHtml(getOptionLabel(PROPERTY_OPTIONS, payload.propertyCount))}<br />
          Facturación: ${escapeHtml(getOptionLabel(REVENUE_OPTIONS, payload.revenueRange))}
        </p>
      </div>
    `,
  }
}

export async function sendBookingConfirmationEmails(
  payload: BookingFormPayload,
  result: BookingCreateResponse
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY no configurada: se omitieron los correos de confirmación de booking.")
    return
  }

  const from = getResendFromAddress()
  const replyTo = BOOKING_NOTIFICATION_EMAIL

  const leadEmail = buildLeadBookingConfirmationEmail(payload, result)
  const { error: leadError } = await resend.emails.send({
    from,
    to: payload.email.trim(),
    replyTo,
    subject: leadEmail.subject,
    html: leadEmail.html,
  })

  if (leadError) {
    console.error("[booking/email] Error enviando confirmación al lead:", leadError)
  }

  const notificationEmail = buildBookingNotificationEmail(payload, result)
  const { error: notificationError } = await resend.emails.send({
    from,
    to: BOOKING_NOTIFICATION_EMAIL,
    replyTo: payload.email.trim(),
    subject: notificationEmail.subject,
    html: notificationEmail.html,
  })

  if (notificationError) {
    console.error("[booking/email] Error enviando notificación interna:", notificationError)
  }
}
