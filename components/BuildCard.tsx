import Link from 'next/link'
import type { BuildSummary } from '@/lib/api'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-surface-alt px-3 py-2 min-w-[64px]">
      <span className="text-[10px] text-ink-muted uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-ink tabular-nums">{value}</span>
    </div>
  )
}

export default function BuildCard({ build }: { build: BuildSummary }) {
  const slug = build.id

  return (
    <Link
      href={`/builds/${slug}`}
      className="group block rounded-2xl border border-line bg-surface hover:border-accent/40 hover:shadow-sm transition-all p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink group-hover:text-accent transition-colors truncate">
            {build.case_name}
          </p>
          {build.volume_liters && (
            <span className="text-xs text-ink-muted">{build.volume_liters}L</span>
          )}
        </div>
        {build.has_benchmarks && (
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-sff-green bg-sff-green/10 rounded-full px-2 py-0.5">
            Benchmarked
          </span>
        )}
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-sm text-ink-muted truncate">
          <span className="text-ink-faint text-xs uppercase tracking-wide mr-1.5">CPU</span>
          {build.cpu ?? '—'}
        </p>
        <p className="text-sm text-ink-muted truncate">
          <span className="text-ink-faint text-xs uppercase tracking-wide mr-1.5">GPU</span>
          {build.gpu ?? 'APU only'}
        </p>
      </div>

      {build.has_benchmarks && (
        <div className="flex gap-2 flex-wrap">
          {build.cb23_multi != null && (
            <Stat label="CB23" value={build.cb23_multi.toLocaleString()} />
          )}
          {build.heaven_1080p_fps != null && (
            <Stat label="1080p" value={`${Math.round(build.heaven_1080p_fps)} fps`} />
          )}
          {build.cpu_stress_max_c != null && (
            <Stat label="CPU°" value={`${build.cpu_stress_max_c}°`} />
          )}
          {build.gpu_stress_max_c != null && (
            <Stat label="GPU°" value={`${build.gpu_stress_max_c}°`} />
          )}
        </div>
      )}
    </Link>
  )
}
