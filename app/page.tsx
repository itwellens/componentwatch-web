import Link from 'next/link'
import BuildCard from '@/components/BuildCard'
import { getSFFBuilds } from '@/lib/api'

export const revalidate = 300

const DEMO_PRICES = [
  { retailer: 'Amazon',   price: '$1,599', delta: '↓ $50',  badge: 'Best price',        badgeClass: 'text-sff-green bg-sff-green/10' },
  { retailer: 'Newegg',   price: '$1,649', delta: null,      badge: null,                badgeClass: '' },
  { retailer: 'Best Buy', price: '$1,699', delta: null,      badge: null,                badgeClass: '' },
  { retailer: 'eBay',     price: '$1,529', delta: '↓ $120', badge: 'New-in-box listing', badgeClass: 'text-sff-amber bg-sff-amber/10' },
]

export default async function HomePage() {
  const featured = await getSFFBuilds({ has_benchmarks: true, limit: 6 })
    .then(r => r.builds)
    .catch(() => [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,rgba(77,142,240,0.11)_0%,transparent_100%)]" />

        <div className="relative mx-auto max-w-content px-6 pt-24 pb-20">

          {/* Label pill */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Real-time price intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-5xl md:text-[66px] font-bold tracking-tight text-ink leading-[1.05] mb-6">
            Never overpay for<br />
            <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              PC components.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-center text-lg text-ink-muted max-w-[520px] mx-auto mb-12 leading-relaxed">
            ComponentWatch tracks prices across Newegg, Amazon, Best Buy, and eBay —
            updated every 30 minutes. Set a target and get alerted when it drops.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
            <Link
              href="/compare"
              className="rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors text-center"
            >
              Track a component
            </Link>
            <Link
              href="/builds"
              className="rounded-xl border border-line bg-surface px-8 py-3.5 text-sm font-semibold text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors text-center"
            >
              Browse SFF builds
            </Link>
          </div>

          {/* Price tracker demo card */}
          <div className="mx-auto max-w-[480px]">
            <div className="rounded-2xl border border-line/70 bg-surface/70 backdrop-blur-xl shadow-[0_0_80px_rgba(77,142,240,0.07)] overflow-hidden">

              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-line">
                <div>
                  <p className="text-sm font-semibold text-ink">NVIDIA GeForce RTX 4090</p>
                  <p className="text-xs text-ink-muted mt-0.5">Founders Edition · 24 GB GDDR6X</p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-sff-green/10 text-sff-green px-2.5 py-0.5">
                  Tracking
                </span>
              </div>

              {/* Price rows */}
              {DEMO_PRICES.map(row => (
                <div
                  key={row.retailer}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line/40 last:border-0 hover:bg-surface-alt transition-colors"
                >
                  <span className="text-sm text-ink-muted w-24 shrink-0">{row.retailer}</span>
                  <div className="flex items-center gap-3 ml-auto">
                    {row.delta && (
                      <span className="text-xs font-medium text-sff-green tabular-nums">{row.delta}</span>
                    )}
                    <span className="text-sm font-semibold text-ink tabular-nums">{row.price}</span>
                    {row.badge && (
                      <span className={`hidden sm:block text-[10px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap ${row.badgeClass}`}>
                        {row.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 bg-surface-alt">
                <span className="text-xs text-ink-faint">Updated 4 min ago · affiliate links</span>
                <Link href="/compare" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                  Set price alert →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Feature pillars ──────────────────────────────────── */}
      <section className="mx-auto max-w-content px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 5h14M3 10h14M3 15h8" />
                </svg>
              ),
              label: 'Multi-retailer tracking',
              body:  'Prices refresh every 30 minutes from Newegg, Amazon, Best Buy, and eBay. One dashboard, four storefronts — no tab-switching.',
            },
            {
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M10 2v4M10 14v4M4.93 4.93l2.83 2.83M12.24 12.24l2.83 2.83M2 10h4M14 10h4M4.93 15.07l2.83-2.83M12.24 7.76l2.83-2.83" />
                </svg>
              ),
              label: 'Instant price alerts',
              body:  'Set a target price for any component. The moment any tracked retailer drops below it, you get an email before inventory clears.',
            },
            {
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="3" width="16" height="14" rx="2" />
                  <path d="M7 7h6M7 10h4" />
                </svg>
              ),
              label: 'Community SFF builds',
              body:  'Real builds physically assembled and benchmarked — thermal readings, Cinebench scores, and component prices. Not spec sheets.',
            },
          ].map(f => (
            <div key={f.label} className="group rounded-2xl border border-line bg-surface p-6 hover:border-accent/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent/15 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-ink mb-2 text-sm">{f.label}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Retailer strip ───────────────────────────────────── */}
      <section className="border-y border-line/40">
        <div className="mx-auto max-w-content px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Tracked retailers</span>
            {['Newegg', 'Amazon', 'Best Buy', 'eBay'].map(r => (
              <span key={r} className="text-sm font-medium text-ink-muted/60 hover:text-ink-muted transition-colors">{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community builds ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="bg-surface border-y border-line">
          <div className="mx-auto max-w-content px-6 py-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-2">Community</p>
                <h2 className="text-2xl font-bold text-ink">Real SFF builds, real data</h2>
                <p className="text-sm text-ink-muted mt-2 max-w-md leading-relaxed">
                  Every build has been physically assembled and tested. Real thermal readings,
                  real benchmark scores — not manufacturer estimates.
                </p>
              </div>
              <Link href="/builds" className="shrink-0 text-sm font-medium text-accent hover:text-accent-hover transition-colors whitespace-nowrap">
                View all builds →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(b => <BuildCard key={b.id} build={b} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="mx-auto max-w-content px-6 py-24">
        <div className="relative rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/8 via-transparent to-transparent p-12 text-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_110%,rgba(77,142,240,0.08)_0%,transparent_100%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-ink mb-4">Know the moment a price drops.</h2>
            <p className="text-sm text-ink-muted max-w-md mx-auto mb-8 leading-relaxed">
              GPU prices shift daily. Set a target and we&apos;ll monitor Newegg, Amazon,
              Best Buy, and eBay simultaneously — so you act before stock clears.
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              Start tracking free
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
