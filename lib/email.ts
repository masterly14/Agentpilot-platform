const FROM_EMAIL_PATTERN =
  /^([^<>\s@]+@[^<>\s@]+|.+<[^<>\s@]+@[^<>\s@]+>)$/

export function getResendFromAddress() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim()

  if (configured && FROM_EMAIL_PATTERN.test(configured)) {
    return configured
  }

  if (configured) {
    console.warn(
      `RESEND_FROM_EMAIL inválido ("${configured}"). Usando onboarding@resend.dev como remitente.`
    )
  }

  return "Santiago Varón <onboarding@resend.dev>"
}
