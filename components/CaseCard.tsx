import Link from 'next/link'
import type { SFFCase } from '@/lib/api'

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CaseCard({ sffCase }: { sffCase: SFFCase }) {
  return (
    <Link
      href={`/cases/${slugify(sffCase.name)}-${sffCase.id}`}
      className="group block rounded-2xl border border-line bg-surface hover:border-accent/40 hover:shadow-sm transition-all p-5"
    >
      <p className="font-semibold text-ink group-hover:text-accent transition-colors mb-1 leading-tight">
        {sffCase.name}
      </p>

      <div className="flex items-center gap-3 mt-3 text-sm text-ink-muted">
        {sffCase.volume_liters && (
          <span className="rounded-full bg-surface-alt border border-line px-2.5 py-0.5 text-xs">
            {sffCase.volume_liters}L
          </span>
        )}
        <span>{sffCase.build_count} build{sffCase.build_count !== 1 ? 's' : ''}</span>
        {sffCase.benchmark_count > 0 && (
          <span className="text-sff-green text-xs font-medium">
            {sffCase.benchmark_count} benchmarks
          </span>
        )}
      </div>
    </Link>
  )
}
