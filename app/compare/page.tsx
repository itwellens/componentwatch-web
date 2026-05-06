import type { Metadata } from 'next'
import Link from 'next/link'
import { searchPCProducts, getPCProduct } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Price Tracker',
  description: 'Track PC component prices across Newegg, Amazon, Best Buy, and eBay in real-time.',
}

const CATEGORIES = [
  { slug: 'gpu',    label: 'GPU'    },
  { slug: 'cpu',    label: 'CPU'    },
  { slug: 'case',   label: 'Case'   },
  { slug: 'ram',    label: 'RAM'    },
  { slug: 'ssd',    label: 'SSD'    },
  { slug: 'psu',    label: 'PSU'    },
  { slug: 'cooler', label: 'Cooler' },
]

const CATEGORY_LABELS: Record<string, string> = {
  gpu: 'GPU', cpu: 'CPU', ram: 'RAM', ssd: 'SSD', psu: 'PSU',
  mobo: 'Motherboard', case: 'Case', cooler: 'Cooler',
  monitor: 'Monitor', keyboard: 'Keyboard', mouse: 'Mouse', other: 'Other',
}

// Sort options per category
const SORT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  gpu: [
    { value: 'relevance',  label: 'Best match'          },
    { value: 'price_asc',  label: 'Price: low to high'  },
    { value: 'price_desc', label: 'Price: high to low'  },
    { value: 'vram_desc',  label: 'VRAM: most first'    },
    { value: 'name_asc',   label: 'Name: A–Z'           },
  ],
  cpu: [
    { value: 'relevance',  label: 'Best match'          },
    { value: 'price_asc',  label: 'Price: low to high'  },
    { value: 'price_desc', label: 'Price: high to low'  },
    { value: 'cores_desc', label: 'Cores: most first'   },
    { value: 'tdp_asc',    label: 'TDP: lowest first'   },
    { value: 'name_asc',   label: 'Name: A–Z'           },
  ],
}
const DEFAULT_SORT_OPTIONS = [
  { value: 'relevance',  label: 'Best match'         },
  { value: 'price_asc',  label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name_asc',   label: 'Name: A–Z'          },
]

interface Props {
  searchParams: Promise<{ q?: string; category?: string; id?: string; sort?: string }>
}

// ── Shared search bar ──────────────────────────────────────────────────────
function SearchBar({ q, category, sort }: { q: string; category?: string; sort: string }) {
  return (
    <form method="GET" action="/compare">
      <div className="flex gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search GPU, CPU, case, RAM…"
          autoComplete="off"
          className="flex-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-colors"
        />
        {category && <input type="hidden" name="category" value={category} />}
        {sort !== 'relevance' && <input type="hidden" name="sort" value={sort} />}
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}

// ── Sort bar ───────────────────────────────────────────────────────────────
function SortBar({ q, category, sort }: { q: string; category?: string; sort: string }) {
  const options = (category ? SORT_OPTIONS[category] : null) ?? DEFAULT_SORT_OPTIONS
  const base    = `/compare?${q ? `q=${encodeURIComponent(q)}&` : ''}${category ? `category=${category}&` : ''}`
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Sort</span>
      {options.map(opt => (
        <Link
          key={opt.value}
          href={`${base}sort=${opt.value}`}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            sort === opt.value
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'border-line text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  )
}

// ── Category pills ─────────────────────────────────────────────────────────
function CategoryPills({ q, active }: { q: string; active?: string }) {
  const base = q ? `/compare?q=${encodeURIComponent(q)}` : '/compare'
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={base}
        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
          !active
            ? 'bg-accent/10 border-accent/30 text-accent'
            : 'border-line text-ink-muted hover:text-ink hover:bg-surface'
        }`}
      >
        All
      </Link>
      {CATEGORIES.map(cat => (
        <Link
          key={cat.slug}
          href={`${base}${q ? '&' : '?'}category=${cat.slug}`}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            active === cat.slug
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'border-line text-ink-muted hover:text-ink hover:bg-surface'
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  )
}

// ── Product detail view ────────────────────────────────────────────────────
async function ProductDetail({ id, q }: { id: number; q: string }) {
  let detail: Awaited<ReturnType<typeof getPCProduct>> | null = null
  try { detail = await getPCProduct(id) } catch { /* not found */ }

  if (!detail) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="text-sm text-ink-muted">Product not found.</p>
        <Link href={`/compare${q ? `?q=${encodeURIComponent(q)}` : ''}`} className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
          ← Back to search
        </Link>
      </div>
    )
  }

  const { product, listings } = detail
  const priced = listings.filter(l => l.price != null)
  const lowest = priced[0] ?? null  // already sorted ASC by backend

  return (
    <div>
      {/* Back */}
      <Link
        href={`/compare${q ? `?q=${encodeURIComponent(q)}` : ''}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-6"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M10 4l-4 4 4 4" />
        </svg>
        Back to results
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
        <h1 className="text-2xl font-bold text-ink mt-0.5 mb-1">{product.canonical_name}</h1>
        {product.brand && <p className="text-sm text-ink-muted">{product.brand}</p>}
        {lowest && (
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink tabular-nums">${lowest.price!.toFixed(2)}</span>
            <span className="text-sm text-ink-muted">best price · {lowest.retailer_name}</span>
          </div>
        )}
      </div>

      {/* Retailer price table */}
      <section className="rounded-2xl border border-line bg-surface overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-sm font-semibold text-ink">Current prices</h2>
          <span className="text-xs text-ink-faint">
            {priced.length} retailer{priced.length !== 1 ? 's' : ''} tracked
          </span>
        </div>

        {listings.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-ink-muted">No pricing data available yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-line/50">
            {listings.map((l, i) => (
              <div
                key={l.listing_id}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-alt transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm text-ink-muted w-28 shrink-0">{l.retailer_name}</span>
                  <div className="flex items-center gap-2">
                    {l.in_stock != null && (
                      <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                        l.in_stock
                          ? 'text-sff-green bg-sff-green/10'
                          : 'text-sff-red bg-sff-red/10'
                      }`}>
                        {l.in_stock ? 'In stock' : 'Out of stock'}
                      </span>
                    )}
                    {i === 0 && priced.length > 1 && (
                      <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 text-accent bg-accent/10">
                        Best price
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-semibold text-ink tabular-nums">
                    {l.price != null ? `$${l.price.toFixed(2)}` : <span className="text-ink-faint">—</span>}
                  </span>
                  <a
                    href={l.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    Buy →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Specifications</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] text-ink-faint uppercase tracking-wide font-medium mb-0.5">
                  {k.replace(/_/g, ' ')}
                </dt>
                <dd className="text-ink">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}

// ── Search results ─────────────────────────────────────────────────────────
async function SearchResults({ q, category, sort }: { q: string; category?: string; sort: string }) {
  let data: Awaited<ReturnType<typeof searchPCProducts>> = { query: q, results: [], count: 0 }
  try {
    data = await searchPCProducts(q, category, 24, sort)
  } catch { /* API down — show empty */ }

  if (data.results.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-16 text-center">
        <p className="text-sm text-ink-muted mb-1">
          {q ? `No results for "${q}"` : 'No products in this category yet'}
        </p>
        <p className="text-xs text-ink-faint mt-1">
          Price data is still building — more products added regularly.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs text-ink-faint mb-4">
        {data.count} product{data.count !== 1 ? 's' : ''} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.results.map(product => (
          <Link
            key={product.id}
            href={`/compare?id=${product.id}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className="group block rounded-2xl border border-line bg-surface hover:border-accent/40 hover:shadow-[0_0_24px_rgba(77,142,240,0.07)] transition-all duration-200 p-5"
          >
            <div className="mb-4">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-ink-faint">
                {CATEGORY_LABELS[product.category] ?? product.category}
              </span>
              <p className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug mt-0.5">
                {product.canonical_name}
              </p>
              {product.brand && (
                <p className="text-xs text-ink-muted mt-0.5">{product.brand}</p>
              )}
            </div>

            <div className="flex items-end justify-between">
              <div>
                {product.best_price != null ? (
                  <>
                    <p className="text-lg font-bold text-ink tabular-nums">
                      ${product.best_price.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-ink-faint">from {product.best_retailer}</p>
                  </>
                ) : (
                  <p className="text-sm text-ink-faint">No price data</p>
                )}
              </div>
              {product.retailer_count > 0 && (
                <span className="text-[10px] text-ink-muted">
                  {product.retailer_count} store{product.retailer_count !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function ComparePage({ searchParams }: Props) {
  const params   = await searchParams
  const q        = params.q        ?? ''
  const category = params.category
  const sort     = params.sort     ?? 'relevance'
  const id       = params.id ? parseInt(params.id) : null

  return (
    <div className="mx-auto max-w-content px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink mb-1">Price tracker</h1>
        <p className="text-sm text-ink-muted">
          Live component prices across Newegg, Amazon, Best Buy, and eBay
        </p>
      </div>

      <div className="mb-6">
        <SearchBar q={q} category={category} sort={sort} />
      </div>

      {!id && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <CategoryPills q={q} active={category} />
          {(q || category) && (
            <div className="sm:ml-auto shrink-0">
              <SortBar q={q} category={category} sort={sort} />
            </div>
          )}
        </div>
      )}

      {id ? (
        <ProductDetail id={id} q={q} />
      ) : (q || category) ? (
        <SearchResults q={q} category={category} sort={sort} />
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-line p-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-5">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-ink mb-2">Search for a component</h2>
          <p className="text-sm text-ink-muted max-w-xs mx-auto">
            Type a GPU model, CPU name, or case — we&apos;ll show current prices
            across all tracked retailers side by side.
          </p>
        </div>
      )}
    </div>
  )
}
