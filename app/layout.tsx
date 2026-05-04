import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ComponentWatch — PC Price Tracker & SFF Build Library',
    template: '%s | ComponentWatch',
  },
  description:
    'Track PC component prices across Newegg, Amazon, Best Buy, and eBay in real-time. Browse community-verified SFF builds with real benchmarks and thermal data.',
  openGraph: {
    siteName: 'ComponentWatch',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen text-ink flex flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
