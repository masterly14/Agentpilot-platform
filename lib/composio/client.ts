import { Composio } from "@composio/core"
import { bookingConfig, isComposioConfigured } from "@/lib/booking/config"

let composioClient: Composio | null = null

export function getComposioClient() {
  if (!isComposioConfigured()) {
    throw new Error("Composio is not configured")
  }

  if (!composioClient) {
    composioClient = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY!,
      toolkitVersions: {
        googlecalendar: bookingConfig.googleCalendarToolkitVersion,
      },
    })
  }

  return composioClient
}

export function getComposioUserId() {
  return bookingConfig.composioUserId
}
