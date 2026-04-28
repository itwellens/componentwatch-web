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
        <h1 className="text-3xl font-bold text-ink mb-2">Compare builds</h1>
        <p className="text-ink-muted">Select two builds to compare their components, benchmarks, and thermal data side by side.</p>
      </div>

      <div className="rounded-2xl border border-dashed border-line bg-surface p-16 text-center">
        <div className="text-4xl mb-4">⚖️</div>
        <h2 className="text-xl font-semibold text-ink mb-3">Build comparison coming soon</h2>
        <p className="text-sm text-ink-muted max-w-md mx-auto mb-6">
          Pick any two builds from the library and compare them head-to-head —
          Cinebench scores, Heaven FPS at each resolution, stress temps, and power draw.
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
