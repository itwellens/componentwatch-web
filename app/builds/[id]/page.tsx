import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSFFBuilds, getSFFBuild, type BuildDetail } from '@/lib/api'

export const revalidate = 300

const RESOLUTION_ORDER = ['720p', '900p', '1080p', '1440p', '4k']
const BENCHMARK_LABELS: Record<string, string> = {
  cinebench_r23: 'Cinebench R23',
  cinebench_r24: 'Cinebench R24',
  heaven:        'Unigine Heaven',
  furmark:       'Furmark',
}

// Pre-generate the first 50 build pages at build time.
// Returns empty on API failure — pages generate on first request via ISR instead.
export async function generateStaticParams() {
  try {
    const { builds } = await getSFFBuilds({ limit: 50 })
    return builds.map(b => ({ id: String(b.id) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const { build } = await getSFFBuild(parseInt(id))
    const title = `${build.case_name}${build.cpu ? ` — ${build.cpu.split(' ').slice(0, 3).join(' ')}` : ''}`
    return {
      title,
      description: `Real-world SFF build: ${build.case_name}${build.volume_liters ? ` (${build.volume_liters}L)` : ''}${build.cpu ? `, ${build.cpu}` : ''}${build.gpu ? `, ${build.gpu}` : ''}. Verified benchmarks and thermal data.`,
      openGraph: { title, type: 'article' },
    }
  } catch {
    return { title: 'Build not found' }
  }
}

function TempRange({ min, max }: { min: number | null; max: number | null }) {
  if (min == null && max == null) return <span className="text-ink-faint">—</span>
  if (min === max || max == null) return <span>{min}°C</span>
  return <span>{min}–{max}°C</span>
}

function PercentileBar({ value }: { value: number }) {
  const color = value >= 75 ? 'bg-sff-green' : value >= 40 ? 'bg-accent' : 'bg-sff-amber'
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 rounded-full bg-surface-alt overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-ink-muted tabular-nums w-12 text-right">top {100 - value}%</span>
    </div>
  )
}

export default async function BuildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let detail: BuildDetail

  try {
    detail = await getSFFBuild(parseInt(id))
  } catch {
    notFound()
  }

  const { build, thermals, benchmarks, analysis, prices } = detail

  const componentRows: [string, string][] = [
    ['Motherboard', build.motherboard!],
    ['CPU',         build.cpu!],
    ['Cooler',      build.cpu_cooler!],
    ['Memory',      build.memory!],
    ['GPU',         build.gpu!],
    ['PSU',         build.psu!],
    ['Storage',     build.storage_primary!],
    ['Storage 2',   build.storage_secondary!],
  ].filter(([, v]) => v) as [string, string][]

  if (build.extra_components?.length) {
    componentRows.push(['Extras', build.extra_components.join(', ')])
  }

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-muted mb-6 flex items-center gap-2">
        <Link href="/builds" className="hover:text-ink">Builds</Link>
        <span>/</span>
        <span className="text-ink truncate">{build.case_name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">{build.case_name}</h1>
          {build.volume_liters && (
            <span className="inline-block rounded-full bg-surface border border-line text-sm text-ink-muted px-3 py-0.5">
              {build.volume_liters}L
            </span>
          )}
          {build.purchase_source && (
            <p className="text-sm text-ink-muted mt-2">Purchased from {build.purchase_source}</p>
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/cases/${build.case_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${build.case_id}`}
            className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-alt transition-colors"
          >
            All {build.case_name} builds →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: components + build notes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Components */}
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-base font-semibold text-ink mb-4">Components</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {componentRows.map(([label, value]) => (
                <div key={label} className="flex gap-3 text-sm">
                  <dt className="w-24 shrink-0 text-ink-muted font-medium">{label}</dt>
                  <dd className="text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Thermals */}
          {thermals.length > 0 && (
            <section className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-base font-semibold text-ink mb-1">Thermals</h2>
              {build.ambient_temp_c != null && (
                <p className="text-sm text-ink-muted mb-4">Ambient: {build.ambient_temp_c}°C</p>
              )}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-ink-muted border-b border-line">
                    <th className="pb-2 font-medium w-16">Part</th>
                    <th className="pb-2 font-medium">Idle</th>
                    <th className="pb-2 font-medium">Gaming</th>
                    <th className="pb-2 font-medium">Stress</th>
                    <th className="pb-2 font-medium text-right">Power</th>
                  </tr>
                </thead>
                <tbody>
                  {thermals.map(t => (
                    <tr key={t.component} className="border-b border-line/50 last:border-0">
                      <td className="py-2.5 text-ink-muted uppercase text-xs font-semibold">{t.component}</td>
                      <td className="py-2.5 tabular-nums"><TempRange min={t.idle_min_c} max={t.idle_max_c} /></td>
                      <td className="py-2.5 tabular-nums"><TempRange min={t.gaming_min_c} max={t.gaming_max_c} /></td>
                      <td className="py-2.5 tabular-nums font-medium"><TempRange min={t.stress_min_c} max={t.stress_max_c} /></td>
                      <td className="py-2.5 tabular-nums text-right text-ink-muted">
                        {t.stress_power_w != null ? `${t.stress_power_w}w` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Benchmarks */}
          {Object.keys(benchmarks).length > 0 && (
            <section className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-base font-semibold text-ink mb-4">Benchmarks</h2>
              <div className="space-y-6">
                {['cinebench_r23', 'cinebench_r24', 'heaven', 'furmark']
                  .filter(k => benchmarks[k])
                  .map(key => {
                    const rows = benchmarks[key]
                    const isCPU = key.startsWith('cinebench')

                    return (
                      <div key={key}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-3">
                          {BENCHMARK_LABELS[key]}
                        </p>

                        {isCPU ? (
                          <div className="flex gap-3 flex-wrap">
                            {rows.filter(r => r.score).map(r => (
                              <div key={r.test_type} className="rounded-xl bg-surface-alt border border-line px-4 py-3 min-w-[100px] text-center">
                                <p className="text-xs text-ink-muted mb-1">
                                  {r.test_type === 'cpu_single' ? 'Single core' : r.test_type === 'cpu_multi' ? 'Multi core' : r.test_type}
                                </p>
                                <p className="text-xl font-bold text-ink tabular-nums">{r.score?.toLocaleString()}</p>
                                {r.max_power_w && <p className="text-xs text-ink-muted mt-1">{r.max_power_w}w</p>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-xs text-ink-muted border-b border-line">
                                <th className="pb-2 font-medium w-16">Res</th>
                                <th className="pb-2 font-medium">Score</th>
                                <th className="pb-2 font-medium">FPS</th>
                                <th className="pb-2 font-medium text-right">Power</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...rows]
                                .sort((a, b) => RESOLUTION_ORDER.indexOf(a.resolution ?? '') - RESOLUTION_ORDER.indexOf(b.resolution ?? ''))
                                .map(r => (
                                  <tr key={r.resolution} className="border-b border-line/50 last:border-0">
                                    <td className="py-2 text-ink-muted font-medium">{r.resolution}</td>
                                    <td className="py-2 tabular-nums">{r.score?.toLocaleString() ?? '—'}</td>
                                    <td className="py-2 tabular-nums font-medium">{r.fps != null ? r.fps.toFixed(1) : '—'}</td>
                                    <td className="py-2 tabular-nums text-right text-ink-muted">{r.max_power_w != null ? `${r.max_power_w}w` : '—'}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )
                  })}
              </div>
            </section>
          )}

          {/* Build notes */}
          {build.build_notes && (
            <section className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-base font-semibold text-ink mb-4">Builder notes</h2>
              <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{build.build_notes}</p>
            </section>
          )}
        </div>

        {/* Right: analysis + prices */}
        <div className="space-y-4">
          {/* Performance analysis */}
          {(analysis.cb23_multi || analysis.heaven_1080p_fps) && (
            <section className="rounded-2xl border border-line bg-surface p-5 space-y-4">
              <h2 className="text-base font-semibold text-ink">Performance</h2>

              {analysis.cb23_multi && (
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wide font-medium mb-1">CPU — CB23 Multi</p>
                  <p className="text-2xl font-bold text-ink tabular-nums">{analysis.cb23_multi.toLocaleString()}</p>
                  {analysis.cb23_percentile != null && <PercentileBar value={analysis.cb23_percentile} />}
                  <div className="flex gap-4 text-xs text-ink-muted mt-2">
                    {analysis.cpu_score_per_watt != null && (
                      <span><span className="font-medium text-ink">{analysis.cpu_score_per_watt}</span> pts/w</span>
                    )}
                    {analysis.cpu_temp_headroom_c != null && (
                      <span>
                        <span className={`font-medium ${analysis.cpu_temp_headroom_c < 5 ? 'text-sff-red' : 'text-ink'}`}>
                          {analysis.cpu_temp_headroom_c}°C
                        </span> headroom
                      </span>
                    )}
                  </div>
                </div>
              )}

              {analysis.heaven_1080p_fps && (
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wide font-medium mb-1">GPU — Heaven 1080p</p>
                  <p className="text-2xl font-bold text-ink tabular-nums">{analysis.heaven_1080p_fps.toFixed(1)} <span className="text-base font-normal text-ink-muted">fps</span></p>
                  {analysis.heaven_percentile != null && <PercentileBar value={analysis.heaven_percentile} />}
                  <div className="flex gap-4 text-xs text-ink-muted mt-2">
                    {analysis.gpu_fps_per_watt != null && (
                      <span><span className="font-medium text-ink">{analysis.gpu_fps_per_watt}</span> fps/w</span>
                    )}
                    {analysis.gpu_temp_headroom_c != null && (
                      <span>
                        <span className={`font-medium ${analysis.gpu_temp_headroom_c < 5 ? 'text-sff-red' : 'text-ink'}`}>
                          {analysis.gpu_temp_headroom_c}°C
                        </span> headroom
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Prices */}
          {(prices.cpu.price != null || prices.gpu.price != null) && (
            <section className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="text-base font-semibold text-ink mb-4">Current prices</h2>
              <div className="space-y-3">
                {prices.cpu.price != null && (
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-xs text-ink-muted uppercase font-medium">CPU</p>
                      <p className="text-ink">{prices.cpu.normalized_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ink tabular-nums">${prices.cpu.price.toFixed(2)}</p>
                      {prices.cpu.retailer && <p className="text-xs text-ink-muted">{prices.cpu.retailer}</p>}
                    </div>
                  </div>
                )}
                {prices.gpu.price != null && (
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-xs text-ink-muted uppercase font-medium">GPU</p>
                      <p className="text-ink">{prices.gpu.normalized_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ink tabular-nums">${prices.gpu.price.toFixed(2)}</p>
                      {prices.gpu.retailer && <p className="text-xs text-ink-muted">{prices.gpu.retailer}</p>}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
