import type { Metadata } from 'next'
import { Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AttributionCapture } from '@/components/analytics/attribution-capture'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: {
    default: 'Santiago Cano Varón — Software a medida',
    template: '%s | Santiago Cano Varón',
  },
  description:
    'Colaboramos con dueños de negocio y fundadores para crear infraestructura de IA, automatizaciones y software a medida, para optimizar sus procesos y aumentar su productividad.',
  keywords: [
    'software a medida',
    'desarrollo de software',
    'automatización',
    'inteligencia artificial',
    'Santiago Cano Varón',
  ],
  authors: [{ name: 'Santiago Cano Varón' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    title: 'Santiago Cano Varón — Software a medida',
    description:
      'Infraestructura de IA, automatizaciones y software a medida para optimizar procesos y aumentar la productividad.',
    siteName: 'Santiago Cano Varón',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Santiago Cano Varón — Software a medida',
    description:
      'Infraestructura de IA, automatizaciones y software a medida para optimizar procesos y aumentar la productividad.',
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark bg-black" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${instrumentSerif.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AttributionCapture />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
