import Link from 'next/link'
import type { SFFCase } from '@/lib/api'

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CaseCard({ sffCase }: { sffCase: SFFCase }) {
  return (
    <Link
      href={`/cases/${slugify(sffCase.name)}-${sffCase.id}`}
      className="group block rounded-2xl border border-line bg-surface hover:border-accent/40 hover:shadow-[0_0_24px_rgba(77,142,240,0.07)] transition-all duration-200 p-5"
    >
      <p className="text-sm font-semibold text-ink group-hover:text-accent transition-colors mb-3 leading-snug">
        {sffCase.name}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {sffCase.volume_liters && (
          <span className="rounded-md bg-surface-alt border border-line/60 px-2 py-0.5 text-[11px] text-ink-muted">
            {sffCase.volume_liters}L
          </span>
        )}
        <span className="text-[11px] text-ink-muted">
          {sffCase.build_count} build{sffCase.build_count !== 1 ? 's' : ''}
        </span>
        {sffCase.benchmark_count > 0 && (
          <span className="text-[11px] text-sff-green font-medium">
            {sffCase.benchmark_count} benchmarks
          </span>
        )}
      </div>
    </Link>
  )
}
