import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
      <p className="text-6xl font-bold text-ink-faint mb-6 tabular-nums">404</p>
      <h1 className="text-2xl font-semibold text-ink mb-3">Page not found</h1>
      <p className="text-ink-muted mb-8">That build, case, or page doesn&apos;t exist.</p>
      <div className="flex gap-4">
        <Link
          href="/builds"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          Browse builds
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface-alt transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
