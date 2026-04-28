import Link from 'next/link'
import BuildCard from '@/components/BuildCard'
import { getSFFBuilds, getSiteStats } from '@/lib/api'

export const revalidate = 300 // ISR: regenerate every 5 minutes

export default async function HomePage() {
  const [stats, { builds: featured }] = await Promise.all([
    getSiteStats(),
    getSFFBuilds({ has_benchmarks: true, limit: 6 }),
  ])

  return (
    <>
      {/* Hero */}
      <section className="bg-surface border-b border-line">
        <div className="mx-auto max-w-content px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Community-verified benchmarks
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink mb-6 leading-tight">
            The SFF PC build library<br className="hidden md:block" />
            <span className="text-accent"> with real data.</span>
          </h1>

          <p className="text-xl text-ink-muted max-w-2xl mx-auto mb-10">
            Browse {stats.builds}+ small-form-factor builds with verified Cinebench scores,
            Heaven benchmarks, thermal readings, and live component prices — not marketing specs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builds"
              className="rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              Browse builds
            </Link>
            <Link
              href="/submit"
              className="rounded-xl border border-line bg-surface px-8 py-3.5 text-base font-semibold text-ink hover:bg-surface-alt transition-colors"
            >
              Submit your build
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-surface border-b border-line">
        <div className="mx-auto max-w-content px-6 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-ink tabular-nums">{stats.builds.toLocaleString()}</p>
              <p className="text-sm text-ink-muted mt-1">Verified builds</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-ink tabular-nums">{stats.cases.toLocaleString()}</p>
              <p className="text-sm text-ink-muted mt-1">Unique cases</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-ink tabular-nums">{stats.benchmarks.toLocaleString()}</p>
              <p className="text-sm text-ink-muted mt-1">Benchmark results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured builds */}
      <section className="mx-auto max-w-content px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2>Featured builds</h2>
          <Link href="/builds?has_benchmarks=true" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map(b => <BuildCard key={b.id} build={b} />)}
        </div>
      </section>

      {/* AI PC callout */}
      <section className="bg-surface border-y border-line">
        <div className="mx-auto max-w-content px-6 py-16">
          <div className="rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 p-10 md:flex items-center justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">New</p>
              <h2 className="mb-3">Running local AI?</h2>
              <p className="text-ink-muted max-w-lg">
                Small form factor PCs are ideal for local LLM inference — whisper-quiet, always-on,
                and surprisingly capable. Browse builds optimized for Ollama, LM Studio, and
                Stable Diffusion filtered by VRAM and real-world inference benchmarks.
              </p>
            </div>
            <Link
              href="/ai-builds"
              className="shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors whitespace-nowrap"
            >
              Explore AI builds →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-content px-6 py-16">
        <h2 className="text-center mb-12">How ComponentWatch works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Real builds, real benchmarks',
              body: 'Every build in the library has been physically assembled and tested. Benchmark scores come from actual hardware, not manufacturer specs.',
            },
            {
              step: '02',
              title: 'Live component prices',
              body: 'Component prices update every 30 minutes from Newegg, Best Buy, eBay, and Amazon. Get alerted when a part in your watchlist drops.',
            },
            {
              step: '03',
              title: 'Submit your own build',
              body: 'Built a compact PC? Share it with the community. Add your benchmarks and it becomes a permanent reference for future builders.',
            },
          ].map(item => (
            <div key={item.step} className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-4xl font-bold text-line mb-4">{item.step}</p>
              <h3 className="mb-2">{item.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
