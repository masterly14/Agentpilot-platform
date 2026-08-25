import { FacebookPixel } from "@/components/analytics/facebook-pixel"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <FacebookPixel />
      {children}
    </>
  )
}
