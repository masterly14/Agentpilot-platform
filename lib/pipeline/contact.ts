import { prisma } from "@/lib/prisma"
import { toPhoneE164 } from "@/lib/whatsapp/phone"

export type ContactProfileInput = {
  fullName: string
  email?: string | null
  phoneCountryCode: string
  phoneNumber: string
  companyName?: string | null
  websiteUrl?: string | null
  instagramUrl?: string | null
}

export async function upsertContactFromLead(input: ContactProfileInput) {
  const phoneE164 = toPhoneE164(input.phoneCountryCode, input.phoneNumber)

  return prisma.contact.upsert({
    where: { phoneE164 },
    create: {
      fullName: input.fullName,
      email: input.email || null,
      phoneE164,
      phoneCountryCode: input.phoneCountryCode,
      phoneNumber: input.phoneNumber.replace(/\D/g, ""),
      companyName: input.companyName || null,
      websiteUrl: input.websiteUrl || null,
      instagramUrl: input.instagramUrl || null,
    },
    update: {
      fullName: input.fullName,
      email: input.email || undefined,
      phoneCountryCode: input.phoneCountryCode,
      phoneNumber: input.phoneNumber.replace(/\D/g, ""),
      companyName: input.companyName || undefined,
      websiteUrl: input.websiteUrl || undefined,
      instagramUrl: input.instagramUrl || undefined,
    },
  })
}

export async function findContactByWaId(waId: string) {
  const digits = waId.replace(/\D/g, "")
  const candidates = [...new Set([waId, digits].filter(Boolean))]
  return prisma.contact.findFirst({
    where: {
      OR: candidates.flatMap((value) => [{ waId: value }, { phoneE164: value }]),
    },
  })
}

export async function linkContactWaId(contactId: string, waId: string) {
  return prisma.contact.update({
    where: { id: contactId },
    data: { waId },
  })
}
