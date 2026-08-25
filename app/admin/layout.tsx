import { Open_Sans } from "next/font/google"
import { AdminTheme } from "@/components/admin/admin-theme"
import "./admin.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-admin",
})

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`admin-shell ${openSans.variable} ${openSans.className}`}>
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
