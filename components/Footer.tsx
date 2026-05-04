import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface mt-24">
      <div className="mx-auto max-w-content px-6 py-14 flex flex-col md:flex-row items-start justify-between gap-10">

        {/* Brand */}
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center text-white text-[10px] font-bold">
              CW
            </div>
            <span className="font-semibold text-ink text-sm">ComponentWatch</span>
          </div>
          <p className="text-sm text-ink-muted leading-relaxed">
            Real-time PC component price tracking and community-verified SFF build data.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-14 text-sm">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Prices</p>
            <Link href="/compare"   className="block text-ink-muted hover:text-ink transition-colors">Compare</Link>
            <Link href="/ai-builds" className="block text-ink-muted hover:text-ink transition-colors">AI Builds</Link>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Community</p>
            <Link href="/builds" className="block text-ink-muted hover:text-ink transition-colors">Builds</Link>
            <Link href="/cases"  className="block text-ink-muted hover:text-ink transition-colors">Cases</Link>
            <Link href="/submit" className="block text-ink-muted hover:text-ink transition-colors">Submit a build</Link>
            <a
              href="https://reddit.com/r/sffpc"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-ink-muted hover:text-ink transition-colors"
            >
              r/sffpc ↗
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line/40">
        <div className="mx-auto max-w-content px-6 py-4 flex items-center justify-between gap-4">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} ComponentWatch. Prices update every 30 min via affiliate links.
          </p>
          <p className="text-xs text-ink-faint hidden sm:block">Made for SFF builders</p>
        </div>
      </div>
    </footer>
  )
}
