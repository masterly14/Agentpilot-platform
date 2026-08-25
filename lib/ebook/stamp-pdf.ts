import { readFile } from "node:fs/promises"
import path from "node:path"
import { PDFArray, PDFDict, PDFDocument, PDFHexString, PDFName, PDFString } from "pdf-lib"
import { getAgendarUrl } from "@/lib/ebook/app-url"

export const EBOOK_TEMPLATE_PATH = path.join(process.cwd(), "content", "ebook.pdf")
export const CALENDLY_BOOKING_URI = "https://calendly.com/agentpilot/diagnostico"

let templateBytes: Uint8Array | null = null

async function getTemplateBytes() {
  if (templateBytes) return templateBytes
  templateBytes = await readFile(EBOOK_TEMPLATE_PATH)
  return templateBytes
}

function readPdfText(value: unknown) {
  if (value instanceof PDFString || value instanceof PDFHexString) {
    return value.decodeText()
  }
  return null
}

function replaceUriInDict(dict: PDFDict, from: string, to: string) {
  const uri = dict.lookup(PDFName.of("URI"))
  const current = readPdfText(uri)
  if (current !== from) return false
  dict.set(PDFName.of("URI"), PDFString.of(to))
  return true
}

export async function stampEbookPdf(token: string) {
  const bookingUrl = getAgendarUrl(token)
  const pdf = await PDFDocument.load(await getTemplateBytes(), {
    updateMetadata: false,
  })

  let replaced = 0

  for (const page of pdf.getPages()) {
    const annots = page.node.Annots()
    if (!(annots instanceof PDFArray)) continue

    for (let index = 0; index < annots.size(); index += 1) {
      const annot = annots.lookup(index)
      if (!(annot instanceof PDFDict)) continue

      if (replaceUriInDict(annot, CALENDLY_BOOKING_URI, bookingUrl)) {
        replaced += 1
      }

      const action = annot.lookup(PDFName.of("A"))
      if (action instanceof PDFDict && replaceUriInDict(action, CALENDLY_BOOKING_URI, bookingUrl)) {
        replaced += 1
      }
    }
  }

  if (replaced === 0) {
    throw new Error("No se encontró el enlace de agendamiento en la plantilla del ebook")
  }

  return pdf.save({ useObjectStreams: false })
}
