import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientToaster } from '@/components/client-toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Website Absensi Penderesan ASAD Padepokan Jakarta Barat Cengkareng',
  description: 'Website Absensi Penderesan ASAD Padepokan Jakarta Barat Cengkareng',
  keywords: 'absensi, ASAD, cengkareng, jakarta barat, padepokan, penderesan, website, kelompok',
  authors: [{ name: 'ASAD Development Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
        <ClientToaster />
      </body>
    </html>
  )
}