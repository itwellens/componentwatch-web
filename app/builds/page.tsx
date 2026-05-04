import type { Metadata } from 'next'
import Link from 'next/link'
import BuildCard from '@/components/BuildCard'
import { getSFFBuilds, getSFFCases } from '@/lib/api'

export const metadata: Metadata = {
  title: 'SFF Build Library',
  description:
    'Browse real small-form-factor PC builds with verified Cinebench, Heaven, and Furmark benchmarks, thermal data, and live component prices.',
}

export const revalidate = 300

interface Props {
  searchParams: Promise<{ search?: string; case_id?: string; benchmarks?: string }>
}

export default async function BuildsPage({ searchParams }: Props) {
  const params    = await searchParams
  const search    = params.search ?? ''
  const caseId    = params.case_id ? parseInt(params.case_id) : undefined
  const benchOnly = params.benchmarks === 'true'

  const [{ builds, total }, cases] = await Promise.all([
    getSFFBuilds({ search, case_id: caseId, has_benchmarks: benchOnly || undefined, limit: 30 }),
    getSFFCases(),
  ])

  const selectedCase = caseId ? cases.find(c => c.id === caseId) : null

  return (
    <div className="mx-auto max-w-content px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink mb-1">SFF Build Library</h1>
        <p className="text-sm text-ink-muted">
          {total.toLocaleString()} builds with real-world benchmarks and thermal data
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">

        {/* Left sidebar — sticky */}
        <aside className="space-y-6 lg:sticky lg:top-[73px] lg:self-start lg:max-h-[calc(100vh-90px)] lg:overflow-y-auto">

          {/* Search */}
          <form method="GET">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search CPU, GPU, case…"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-colors"
            />
            {caseId    && <input type="hidden" name="case_id" value={caseId} />}
            {benchOnly && <input type="hidden" name="benchmarks" value="true" />}
          </form>

          {/* Benchmarks filter */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-0.5">Filter</p>
            <Link
              href={benchOnly
                ? `/builds?${search ? `search=${search}&` : ''}${caseId ? `case_id=${caseId}` : ''}`
                : `/builds?${search ? `search=${search}&` : ''}${caseId ? `case_id=${caseId}&` : ''}benchmarks=true`}
              className={[
                'rounded-lg px-3 py-2 text-sm transition-colors',
                benchOnly
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-ink-muted border border-line/60 bg-surface hover:bg-surface-alt hover:text-ink',
              ].join(' ')}
            >
              Benchmarks only
            </Link>
          </div>

          {/* Cases list */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint mb-2">Case</p>
            <div className="space-y-0.5 max-h-[52vh] overflow-y-auto pr-1">
              <Link
                href={`/builds?${search ? `search=${search}&` : ''}${benchOnly ? 'benchmarks=true' : ''}`}
                className={[
                  'block w-full rounded-lg px-3 py-1.5 text-sm transition-colors',
                  !caseId
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-alt',
                ].join(' ')}
              >
                All cases
              </Link>
              {cases.map(c => (
                <Link
                  key={c.id}
                  href={`/builds?case_id=${c.id}${search ? `&search=${search}` : ''}${benchOnly ? '&benchmarks=true' : ''}`}
                  className={[
                    'block w-full rounded-lg px-3 py-1.5 text-sm transition-colors',
                    caseId === c.id
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-alt',
                  ].join(' ')}
                >
                  <span className="block truncate">{c.name}</span>
                  {c.volume_liters && (
                    <span className="text-[11px] opacity-50">{c.volume_liters}L</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Build grid */}
        <div>
          {selectedCase && (
            <div className="mb-5 flex items-center gap-3">
              <span className="text-sm text-ink-muted">Filtering by:</span>
              <span className="rounded-full bg-accent/10 text-accent text-sm font-medium px-3 py-0.5">
                {selectedCase.name}
              </span>
              <Link href="/builds" className="text-sm text-ink-faint hover:text-ink">
                × Clear
              </Link>
            </div>
          )}

          {builds.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-16 text-center">
              <p className="text-ink-muted text-sm">No builds match your filters.</p>
              <Link href="/builds" className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {builds.map(b => <BuildCard key={b.id} build={b} />)}
            </div>
          )}

          {total > 30 && (
            <p className="text-center text-xs text-ink-faint mt-8">
              Showing 30 of {total.toLocaleString()} builds — search or filter to narrow.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
