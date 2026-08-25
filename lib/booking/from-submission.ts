import type { FormSubmission } from "@/prisma/generated/client"
import {
  INDUSTRY_TIME_FORM,
  PMS_USAGE_FORM,
  PROPERTY_COUNT_FORM,
  REVENUE_RANGE_FORM,
  YES_NO_FORM,
} from "@/lib/booking/form-options"
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/booking/phone-countries"
import type { BookingFormData } from "@/lib/booking/types"

export function bookingFormDataFromSubmission(submission: FormSubmission): BookingFormData {
  return {
    fullName: submission.fullName || "",
    email: submission.email || "",
    phoneCountryCode: submission.phoneCountryCode || DEFAULT_PHONE_COUNTRY_CODE,
    phoneNumber: submission.phoneNumber || "",
    companyName: submission.companyName || "",
    websiteUrl: submission.websiteUrl || "",
    instagramUrl: submission.instagramUrl || "",
    usesPms: submission.usesPms ? PMS_USAGE_FORM[submission.usesPms] : "",
    propertyCount: submission.propertyCount ? PROPERTY_COUNT_FORM[submission.propertyCount] : "",
    revenueRange: submission.revenueRange ? REVENUE_RANGE_FORM[submission.revenueRange] : "",
    isTodero: submission.isTodero ? YES_NO_FORM[submission.isTodero] : "",
    usesAi: submission.usesAi ? YES_NO_FORM[submission.usesAi] : "",
    wantsToScale: submission.wantsToScale ? YES_NO_FORM[submission.wantsToScale] : "",
    industryTime: submission.industryTime ? INDUSTRY_TIME_FORM[submission.industryTime] : "",
  }
}
