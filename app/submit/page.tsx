import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Submit a Build',
  description: 'Share your small-form-factor PC build with the community. Add benchmarks and thermal data to contribute to the library.',
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-prose px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink mb-3">Submit your build</h1>
        <p className="text-ink-muted leading-relaxed">
          Every build in the library was contributed by someone who actually built it.
          If you have benchmarks and thermal data, your build becomes a permanent reference
          for future builders looking at the same case or components.
        </p>
      </div>

      {/* What we need */}
      <section className="rounded-2xl border border-line bg-surface p-6 mb-8">
        <h2 className="text-base font-semibold text-ink mb-4">What makes a good submission</h2>
        <ul className="space-y-3 text-sm text-ink-muted">
          {[
            'Case name and volume (if known)',
            'Full component list: CPU, GPU, cooler, RAM, PSU, storage',
            'Thermal readings: idle, gaming/work, and stress test temps for CPU and GPU',
            'At least one benchmark: Cinebench R23 or R24 (CPU), Unigine Heaven or Furmark (GPU)',
            'Ambient temperature when testing',
            'Any build notes or tips for others using the same case',
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-sff-green mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Benchmark tools */}
      <section className="rounded-2xl border border-line bg-surface p-6 mb-8">
        <h2 className="text-base font-semibold text-ink mb-4">Recommended benchmark tools</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { name: 'Cinebench R23', use: 'CPU multi/single core', free: true },
            { name: 'Cinebench R24', use: 'CPU + GPU score', free: true },
            { name: 'Unigine Heaven', use: 'GPU at multiple resolutions', free: true },
            { name: 'Furmark',       use: 'GPU stress / power draw', free: true },
          ].map(tool => (
            <div key={tool.name} className="rounded-xl bg-surface-alt p-3">
              <p className="font-medium text-ink">{tool.name}</p>
              <p className="text-ink-muted text-xs mt-0.5">{tool.use}</p>
              {tool.free && <p className="text-sff-green text-xs mt-1 font-medium">Free</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Submission form placeholder */}
      <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
        <h2 className="text-lg font-semibold text-ink mb-3">Submission form coming soon</h2>
        <p className="text-sm text-ink-muted max-w-sm mx-auto mb-6">
          In the meantime, email your build notes to{' '}
          <a href="mailto:ike@componentwatch.com" className="text-accent hover:underline">
            ike@componentwatch.com
          </a>{' '}
          and we&apos;ll add it to the library manually.
        </p>
        <Link
          href="/builds"
          className="rounded-xl border border-line bg-surface px-5 py-2 text-sm font-medium text-ink hover:bg-surface-alt transition-colors"
        >
          Browse existing builds
        </Link>
      </div>
    </div>
  )
}
