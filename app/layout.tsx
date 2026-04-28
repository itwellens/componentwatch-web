import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ComponentWatch — SFF PC Build Library',
    template: '%s | ComponentWatch',
  },
  description:
    'Community-verified benchmarks and real-world data for small-form-factor PC builders. Browse 235+ SFF builds with Cinebench, Heaven, and Furmark results.',
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
        <body className="min-h-screen bg-surface-alt text-ink flex flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
