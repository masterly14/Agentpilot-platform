import type { Metadata } from 'next'
import { EbookCover3D } from '@/components/three/ebook-cover-3d'

export const metadata: Metadata = {
  title: 'Portada 3D del ebook',
  description: 'Vista previa del componente 3D que renderiza la portada del ebook.',
  robots: { index: false, follow: false },
}

export default function EbookCover3DPage() {
  return (
    <main className="min-h-svh bg-black">
      <EbookCover3D
        cover="/lead-magnet/portada-ebook-texture.webp"
        poster="/lead-magnet/portada-ebook.png"
        className="h-svh w-full"
      />
    </main>
  )
}
