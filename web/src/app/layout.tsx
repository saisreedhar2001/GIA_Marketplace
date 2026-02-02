import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientProvider from '@/components/ClientProvider'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#B85C3C',
}

export const metadata: Metadata = {
  title: 'GIA - Great India Arts | Indian Art & Crafts Marketplace',
  description: 'Discover authentic Indian art, handmade crafts, and artisan products. Celebrate heritage, support artists, and own unique pieces of Indian culture.',
  keywords: 'Indian art, crafts, handmade, marketplace, artisan, heritage',
  authors: [{ name: 'GIA Team' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'GIA - Great India Arts',
    description: 'Authentic Indian art & crafts marketplace',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-off-white text-indigo font-sans">
        <ClientProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  )
}
