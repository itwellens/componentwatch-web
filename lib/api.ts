/**
 * Server-side API client for the ComponentWatch FastAPI backend.
 * Used in Next.js Server Components and generateStaticParams.
 * All SFF endpoints are public — no auth header needed.
 */

const API_BASE =
  process.env.API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.componentwatch.com'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
    })
  } catch (e) {
    throw new Error(`API fetch failed (network error): ${path} — ${e}`)
  }
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SFFCase {
  id: number
  name: string
  volume_liters: number | null
  build_count: number
  benchmark_count: number
}

export interface BuildSummary {
  id: number
  cpu: string | null
  gpu: string | null
  ambient_temp_c: number | null
  case_id: number
  case_name: string
  volume_liters: number | null
  cb23_multi: number | null
  heaven_1080p_fps: number | null
  cpu_stress_max_c: number | null
  gpu_stress_max_c: number | null
  has_benchmarks: boolean
}

export interface ThermalRow {
  component: string
  idle_min_c: number | null
  idle_max_c: number | null
  gaming_min_c: number | null
  gaming_max_c: number | null
  stress_min_c: number | null
  stress_max_c: number | null
  stress_power_w: number | null
}

export interface BenchmarkRow {
  test_type: string
  resolution: string | null
  score: number | null
  fps: number | null
  max_power_w: number | null
}

export interface Analysis {
  cpu_score_per_watt: number | null
  gpu_fps_per_watt: number | null
  cpu_temp_headroom_c: number | null
  gpu_temp_headroom_c: number | null
  cb23_multi: number | null
  heaven_1080p_fps: number | null
  cpu_power_w: number | null
  gpu_power_w: number | null
  cb23_percentile: number | null
  heaven_percentile: number | null
}

export interface Prices {
  cpu: { normalized_name: string | null; price: number | null; retailer: string | null }
  gpu: { normalized_name: string | null; price: number | null; retailer: string | null }
  total_tracked: number | null
  components_priced: number
}

export interface BuildDetail {
  build: {
    id: number
    cpu: string | null
    cpu_cooler: string | null
    gpu: string | null
    psu: string | null
    motherboard: string | null
    memory: string | null
    storage_primary: string | null
    storage_secondary: string | null
    extra_components: string[] | null
    ambient_temp_c: number | null
    build_notes: string | null
    case_id: number
    case_name: string
    volume_liters: number | null
    purchase_source: string | null
  }
  thermals: ThermalRow[]
  benchmarks: Record<string, BenchmarkRow[]>
  analysis: Analysis
  prices: Prices
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export async function getSFFCases(): Promise<SFFCase[]> {
  const data = await apiFetch<{ cases: SFFCase[] }>(
    '/api/sff/cases',
    { next: { revalidate: 3600 } }, // revalidate every hour
  )
  return data.cases
}

export async function getSFFBuilds(params?: {
  search?: string
  case_id?: number
  has_benchmarks?: boolean
  limit?: number
  offset?: number
}): Promise<{ builds: BuildSummary[]; total: number }> {
  const qs = new URLSearchParams()
  if (params?.search)         qs.set('search', params.search)
  if (params?.case_id != null) qs.set('case_id', String(params.case_id))
  if (params?.has_benchmarks != null) qs.set('has_benchmarks', String(params.has_benchmarks))
  qs.set('limit',  String(params?.limit  ?? 30))
  qs.set('offset', String(params?.offset ?? 0))

  return apiFetch<{ builds: BuildSummary[]; total: number }>(
    `/api/sff/builds?${qs}`,
    { next: { revalidate: 300 } }, // revalidate every 5 min
  )
}

export async function getSFFBuild(id: number): Promise<BuildDetail> {
  return apiFetch<BuildDetail>(
    `/api/sff/builds/${id}`,
    { next: { revalidate: 300 } },
  )
}

export async function getBuildsForCase(caseId: number): Promise<BuildSummary[]> {
  const data = await getSFFBuilds({ case_id: caseId, limit: 50 })
  return data.builds
}

// Stats for homepage hero
export async function getSiteStats(): Promise<{
  builds: number
  cases: number
  benchmarks: number
}> {
  try {
    const [buildsData, cases] = await Promise.all([
      getSFFBuilds({ limit: 1 }),
      getSFFCases(),
    ])
    const benchmarkCount = cases.reduce((s, c) => s + c.benchmark_count, 0)
    return {
      builds:     buildsData.total,
      cases:      cases.length,
      benchmarks: benchmarkCount,
    }
  } catch {
    return { builds: 235, cases: 228, benchmarks: 2426 }
  }
}
