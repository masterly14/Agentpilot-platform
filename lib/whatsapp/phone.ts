export function toPhoneE164(countryCode: string, phoneNumber: string) {
  const countryDigits = countryCode.replace(/\D/g, "")
  const nationalDigits = phoneNumber.replace(/\D/g, "")
  if (!countryDigits || !nationalDigits) {
    throw new Error("Teléfono incompleto para armar E.164")
  }
  return `${countryDigits}${nationalDigits}`
}

export function firstNameFromFullName(fullName: string) {
  const token = fullName.trim().split(/\s+/)[0]
  return token || fullName.trim()
}
