import { readFile } from "node:fs/promises"
import path from "node:path"
import LeadGuideEmail, {
  LEAD_GUIDE_COVER_CID,
  LEAD_GUIDE_EMAIL_SUBJECT,
} from "@/emails/lead-guide"
import { stampEbookPdf } from "@/lib/ebook/stamp-pdf"
import { getResendFromAddress } from "@/lib/email"
import { resend } from "@/lib/resend"
import { getVisitorFirstName } from "@/lib/visitor-confirmation-email"

const COVER_STATIC_PATH = path.join(process.cwd(), "emails/static/portada-ebook.png")
const COVER_PUBLIC_PATH = path.join(process.cwd(), "public/lead-magnet/portada-ebook.png")

async function readCoverImage() {
  try {
    return await readFile(COVER_STATIC_PATH)
  } catch {
    return readFile(COVER_PUBLIC_PATH)
  }
}

export async function sendLeadGuideEmail({
  fullName,
  email,
  downloadToken,
  replyTo,
}: {
  fullName: string
  email: string
  downloadToken: string
  replyTo?: string
}) {
  const [pdfBytes, coverBytes] = await Promise.all([
    stampEbookPdf(downloadToken),
    readCoverImage(),
  ])

  return resend.emails.send({
    from: getResendFromAddress(),
    to: email,
    replyTo,
    subject: LEAD_GUIDE_EMAIL_SUBJECT,
    react: LeadGuideEmail({
      firstName: getVisitorFirstName(fullName),
      coverUrl: `cid:${LEAD_GUIDE_COVER_CID}`,
    }),
    attachments: [
      {
        filename: "guia-agent-pilot.pdf",
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      },
      {
        filename: "portada-ebook.png",
        content: coverBytes,
        contentType: "image/png",
        contentId: LEAD_GUIDE_COVER_CID,
      },
    ],
  })
}
