import type { Metadata } from 'next'
import CaseCard from '@/components/CaseCard'
import { getSFFCases } from '@/lib/api'

export const metadata: Metadata = {
  title: 'SFF Case Explorer',
  description:
    'Browse every small-form-factor PC case in the library — with real build counts, verified benchmarks, and thermal comparisons across builds.',
}

export const revalidate = 3600

export default async function CasesPage() {
  const cases = await getSFFCases()

  // Sort: most builds first, then alphabetical
  const sorted = [...cases].sort((a, b) =>
    b.build_count - a.build_count || a.name.localeCompare(b.name)
  )

  // Volume buckets for visual grouping
  const withVolume  = sorted.filter(c => c.volume_liters != null)
  const noVolume    = sorted.filter(c => c.volume_liters == null)

  const buckets: { label: string; cases: typeof sorted }[] = [
    { label: 'Under 5L — Ultra compact',  cases: withVolume.filter(c => c.volume_liters! < 5) },
    { label: '5 – 10L — Compact',          cases: withVolume.filter(c => c.volume_liters! >= 5 && c.volume_liters! < 10) },
    { label: '10 – 20L — Small',           cases: withVolume.filter(c => c.volume_liters! >= 10 && c.volume_liters! < 20) },
    { label: '20L+ — Mid-range SFF',       cases: withVolume.filter(c => c.volume_liters! >= 20) },
    { label: 'Volume not listed',          cases: noVolume },
  ].filter(b => b.cases.length > 0)

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink mb-2">Case Explorer</h1>
        <p className="text-ink-muted">
          {cases.length} cases with real build data — click any case to see all builds and benchmark comparisons.
        </p>
      </div>

      <div className="space-y-12">
        {buckets.map(bucket => (
          <section key={bucket.label}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted mb-4">
              {bucket.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {bucket.cases.map(c => <CaseCard key={c.id} sffCase={c} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
