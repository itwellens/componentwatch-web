import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BuildCard from '@/components/BuildCard'
import { getSFFCases, getBuildsForCase, type SFFCase, type BuildSummary } from '@/lib/api'

export const revalidate = 3600

// slug format: "jonsbo-t11-12"  (slugified-name + "-" + id)
function parseSlug(slug: string): number | null {
  const parts = slug.split('-')
  const id = parseInt(parts[parts.length - 1])
  return isNaN(id) ? null : id
}

export async function generateStaticParams() {
  const cases = await getSFFCases()
  return cases.map(c => ({
    slug: `${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${c.id}`,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const caseId = parseSlug(slug)
  if (!caseId) return { title: 'Case not found' }

  const cases = await getSFFCases()
  const sffCase = cases.find(c => c.id === caseId)
  if (!sffCase) return { title: 'Case not found' }

  return {
    title: `${sffCase.name} SFF Builds`,
    description: `All ${sffCase.build_count} small-form-factor builds in the ${sffCase.name}${sffCase.volume_liters ? ` (${sffCase.volume_liters}L)` : ''} with verified benchmarks and thermal comparisons.`,
  }
}

// Compute simple stats across all builds for a case
function computeCaseStats(builds: BuildSummary[]) {
  const withCB23 = builds.filter(b => b.cb23_multi != null)
  const withHeaven = builds.filter(b => b.heaven_1080p_fps != null)
  const withCPUTemp = builds.filter(b => b.cpu_stress_max_c != null)

  return {
    avgCB23:    withCB23.length    ? Math.round(withCB23.reduce((s, b) => s + b.cb23_multi!, 0) / withCB23.length) : null,
    maxCB23:    withCB23.length    ? Math.max(...withCB23.map(b => b.cb23_multi!)) : null,
    avgHeaven:  withHeaven.length  ? +(withHeaven.reduce((s, b) => s + b.heaven_1080p_fps!, 0) / withHeaven.length).toFixed(1) : null,
    maxHeaven:  withHeaven.length  ? Math.max(...withHeaven.map(b => b.heaven_1080p_fps!)) : null,
    avgCPUTemp: withCPUTemp.length ? Math.round(withCPUTemp.reduce((s, b) => s + b.cpu_stress_max_c!, 0) / withCPUTemp.length) : null,
    benchmarked: builds.filter(b => b.has_benchmarks).length,
  }
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caseId = parseSlug(slug)
  if (!caseId) notFound()

  const [cases, builds] = await Promise.all([
    getSFFCases(),
    getBuildsForCase(caseId!),
  ])

  const sffCase = cases.find(c => c.id === caseId)
  if (!sffCase) notFound()

  const stats = computeCaseStats(builds)
  const benchmarkedBuilds = builds.filter(b => b.has_benchmarks)
  const otherBuilds = builds.filter(b => !b.has_benchmarks)

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-muted mb-6 flex items-center gap-2">
        <Link href="/cases" className="hover:text-ink">Cases</Link>
        <span>/</span>
        <span className="text-ink">{sffCase.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">{sffCase.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {sffCase.volume_liters && (
                <span className="rounded-full bg-surface border border-line text-sm text-ink-muted px-3 py-0.5">
                  {sffCase.volume_liters}L
                </span>
              )}
              <span className="text-sm text-ink-muted">{builds.length} build{builds.length !== 1 ? 's' : ''} in library</span>
              {stats.benchmarked > 0 && (
                <span className="text-sm text-sff-green font-medium">{stats.benchmarked} benchmarked</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Case stats across all builds */}
      {(stats.avgCB23 || stats.avgHeaven) && (
        <section className="rounded-2xl border border-line bg-surface p-6 mb-10">
          <h2 className="text-base font-semibold text-ink mb-4">
            Benchmark averages across {stats.benchmarked} build{stats.benchmarked !== 1 ? 's' : ''}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.avgCB23 && (
              <div className="rounded-xl bg-surface-alt p-4 text-center">
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">CB23 avg</p>
                <p className="text-2xl font-bold text-ink tabular-nums">{stats.avgCB23.toLocaleString()}</p>
              </div>
            )}
            {stats.maxCB23 && (
              <div className="rounded-xl bg-surface-alt p-4 text-center">
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">CB23 best</p>
                <p className="text-2xl font-bold text-ink tabular-nums">{stats.maxCB23.toLocaleString()}</p>
              </div>
            )}
            {stats.avgHeaven && (
              <div className="rounded-xl bg-surface-alt p-4 text-center">
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">Heaven 1080p avg</p>
                <p className="text-2xl font-bold text-ink tabular-nums">{stats.avgHeaven} <span className="text-sm font-normal text-ink-muted">fps</span></p>
              </div>
            )}
            {stats.avgCPUTemp && (
              <div className="rounded-xl bg-surface-alt p-4 text-center">
                <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">Avg CPU stress</p>
                <p className="text-2xl font-bold text-ink tabular-nums">{stats.avgCPUTemp}°C</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Benchmarked builds */}
      {benchmarkedBuilds.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-semibold text-ink mb-4">Benchmarked builds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarkedBuilds.map(b => <BuildCard key={b.id} build={b} />)}
          </div>
        </section>
      )}

      {/* Non-benchmarked builds */}
      {otherBuilds.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            Other builds
            <span className="text-sm font-normal text-ink-muted">(no benchmark data)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherBuilds.map(b => <BuildCard key={b.id} build={b} />)}
          </div>
        </section>
      )}
    </div>
  )
}
