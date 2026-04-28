import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface mt-24">
      <div className="mx-auto max-w-content px-6 py-12 flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <p className="font-semibold text-ink mb-1">ComponentWatch</p>
          <p className="text-sm text-ink-muted max-w-xs">
            Community-verified benchmarks and real-world data for small-form-factor PC builders.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-3">Explore</p>
            <Link href="/builds"    className="block text-ink-muted hover:text-ink">Builds</Link>
            <Link href="/cases"     className="block text-ink-muted hover:text-ink">Cases</Link>
            <Link href="/compare"   className="block text-ink-muted hover:text-ink">Compare</Link>
            <Link href="/ai-builds" className="block text-ink-muted hover:text-ink">AI Builds</Link>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-3">Community</p>
            <Link href="/submit" className="block text-ink-muted hover:text-ink">Submit a build</Link>
            <a href="https://reddit.com/r/sffpc" target="_blank" rel="noopener noreferrer" className="block text-ink-muted hover:text-ink">r/sffpc</a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-content px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} ComponentWatch. Prices updated every 30 minutes via affiliate links.
          </p>
        </div>
      </div>
    </footer>
  )
}
