import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Compare Builds',
  description: 'Compare two or more SFF PC builds side-by-side — benchmarks, thermals, components, and prices.',
}

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink mb-1">Price tracker</h1>
        <p className="text-sm text-ink-muted">Track component prices across Newegg, Amazon, Best Buy, and eBay in real-time.</p>
      </div>

      <div className="rounded-2xl border border-dashed border-line bg-surface p-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-5">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-ink mb-3">Price comparison coming soon</h2>
        <p className="text-sm text-ink-muted max-w-md mx-auto mb-6">
          Search any GPU, CPU, or case and see current prices across Newegg, Amazon,
          Best Buy, and eBay side by side — with price history and drop alerts.
        </p>
        <Link
          href="/builds"
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          Browse builds
        </Link>
      </div>
    </div>
  )
}
