import { NextResponse } from 'next/server'

const API_BASE =
  process.env.API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.componentwatch.com'

export async function GET() {
  const results: Record<string, unknown> = {
    api_base: API_BASE,
    timestamp: new Date().toISOString(),
  }

  // Test 1: health endpoint
  try {
    const r = await fetch(`${API_BASE}/health`, { method: 'GET' })
    results.health_status = r.status
    results.health_ok = r.ok
    if (r.ok) results.health_body = await r.json()
  } catch (e) {
    results.health_error = String(e)
  }

  // Test 2: sff builds
  try {
    const r = await fetch(`${API_BASE}/api/sff/builds?limit=1`)
    results.builds_status = r.status
    results.builds_ok = r.ok
  } catch (e) {
    results.builds_error = String(e)
  }

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
