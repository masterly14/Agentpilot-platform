function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

export function getVisitorFirstName(fullName: string) {
  const trimmed = fullName.trim()
  if (!trimmed) return "amigo"
  return trimmed.split(/\s+/)[0]
}

export function buildVisitorConfirmationEmail(fullName: string) {
  const firstName = escapeHtml(getVisitorFirstName(fullName))

  return {
    subject: "Recibimos tu solicitud — Santiago Varón",
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; line-height: 1.7; max-width: 560px;">
        <p style="font-size: 18px; margin-bottom: 24px;">Hola ${firstName},</p>

        <p>Soy <strong>Santiago</strong>. Muchas gracias por tomarte el tiempo de compartir tus datos y contarme sobre tu proyecto.</p>

        <p>Ya recibimos tu solicitud y nuestro equipo está revisando la información con atención. Queremos entender bien tu idea antes de escribirte de vuelta.</p>

        <p>Te agradezco la confianza. Muy pronto tendrás una respuesta de nuestra parte.</p>

        <p style="margin-top: 32px;">
          Con aprecio,<br />
          <strong>Santiago Varón</strong><br />
          <span style="color: #555;">Desarrollo de Software</span>
        </p>
      </div>
    `,
  }
}
