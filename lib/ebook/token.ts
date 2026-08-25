import { randomBytes } from "node:crypto"

export function generatePdfToken() {
  return randomBytes(24).toString("base64url")
}
