import Link from 'next/link'
import type { BuildSummary } from '@/lib/api'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-surface-alt px-3 py-2 min-w-[64px]">
      <span className="text-[9px] text-ink-faint uppercase tracking-wide font-medium">{label}</span>
      <span className="text-sm font-semibold text-ink tabular-nums mt-0.5">{value}</span>
    </div>
  )
}

export default function BuildCard({ build }: { build: BuildSummary }) {
  return (
    <Link
      href={`/builds/${build.id}`}
      className="group block rounded-2xl border border-line bg-surface hover:border-accent/40 hover:shadow-[0_0_24px_rgba(77,142,240,0.07)] transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink group-hover:text-accent transition-colors truncate">
            {build.case_name}
          </p>
          {build.volume_liters && (
            <span className="text-[11px] text-ink-faint">{build.volume_liters}L</span>
          )}
        </div>
        {build.has_benchmarks && (
          <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-sff-green bg-sff-green/10 rounded-full px-2 py-0.5">
            Benchmarked
          </span>
        )}
      </div>

      <div className="space-y-1.5 mb-4">
        <p className="text-sm text-ink-muted truncate">
          <span className="text-[9px] text-ink-faint uppercase tracking-wide mr-1.5 font-semibold">CPU</span>
          {build.cpu ?? '—'}
        </p>
        <p className="text-sm text-ink-muted truncate">
          <span className="text-[9px] text-ink-faint uppercase tracking-wide mr-1.5 font-semibold">GPU</span>
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
