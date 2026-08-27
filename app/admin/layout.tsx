import { IBM_Plex_Mono, IBM_Plex_Sans, Open_Sans } from "next/font/google"
import { AdminTheme } from "@/components/admin/admin-theme"
import "./admin.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-admin",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-informe-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-informe-mono",
})

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className={`admin-shell ${openSans.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${openSans.className}`}
    >
      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.documentElement.classList.remove('dark');document.documentElement.classList.add('admin-light');document.documentElement.style.backgroundColor='#f2f3f3';",
        }}
      />
      <AdminTheme />
      {children}
    </div>
  )
}
