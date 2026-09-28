import VideoOutreachEmail, {
  VIDEO_OUTREACH_EMAIL_SUBJECT,
} from "@/emails/video-outreach"
import { getResendFromAddress } from "@/lib/email"
import { resend } from "@/lib/resend"

export async function sendVideoOutreachEmail({
  email,
  firstName,
  bookingUrl,
  replyTo,
}: {
  email: string
  firstName: string
  bookingUrl: string
  replyTo?: string
}) {
  return resend.emails.send({
    from: getResendFromAddress(),
    to: email,
    replyTo,
    subject: VIDEO_OUTREACH_EMAIL_SUBJECT,
    react: VideoOutreachEmail({ firstName, bookingUrl }),
  })
}
