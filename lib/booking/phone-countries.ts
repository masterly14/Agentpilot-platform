export const DEFAULT_PHONE_COUNTRY_CODE = "+57"

export const PHONE_COUNTRY_OPTIONS = [
  { code: "+57", label: "Colombia (+57)" },
  { code: "+52", label: "México (+52)" },
  { code: "+54", label: "Argentina (+54)" },
  { code: "+56", label: "Chile (+56)" },
  { code: "+51", label: "Perú (+51)" },
  { code: "+593", label: "Ecuador (+593)" },
  { code: "+58", label: "Venezuela (+58)" },
  { code: "+591", label: "Bolivia (+591)" },
  { code: "+595", label: "Paraguay (+595)" },
  { code: "+598", label: "Uruguay (+598)" },
  { code: "+506", label: "Costa Rica (+506)" },
  { code: "+507", label: "Panamá (+507)" },
  { code: "+502", label: "Guatemala (+502)" },
  { code: "+503", label: "El Salvador (+503)" },
  { code: "+504", label: "Honduras (+504)" },
  { code: "+505", label: "Nicaragua (+505)" },
  { code: "+1", label: "Estados Unidos (+1)" },
  { code: "+34", label: "España (+34)" },
  { code: "+55", label: "Brasil (+55)" },
] as const

export function formatPhoneNumber(countryCode: string, phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "")
  if (!digits) return ""
  return `${countryCode} ${digits}`
}

export function isValidPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "")
  return digits.length >= 6 && digits.length <= 15
}
