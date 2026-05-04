import type { Metadata } from 'next'
import BuildCard from '@/components/BuildCard'
import { getSFFBuilds } from '@/lib/api'

export const metadata: Metadata = {
  title: 'AI PC Builds — Local LLM & Inference',
  description:
    'Small-form-factor PC builds optimized for local AI: Ollama, LM Studio, Stable Diffusion, and ComfyUI. Real benchmarks, VRAM data, and power efficiency.',
}

export const revalidate = 3600

const AI_KEYWORDS = ['rtx 4090', 'rtx 4080', 'rtx 4070', 'rtx 3090', 'rtx 3080', 'rx 7900', 'rx 6900']

export default async function AIBuildsPage() {
  // Fetch builds with high-end GPUs suited to local AI inference.
  // Fail gracefully if the API is unreachable during CI build.
  let results: Awaited<ReturnType<typeof getSFFBuilds>>[] = []
  try {
    results = await Promise.all(
      AI_KEYWORDS.map(kw => getSFFBuilds({ search: kw, has_benchmarks: true, limit: 6 }))
    )
  } catch {
    results = []
  }

  // Deduplicate by build id, keep order of first appearance
  const seen = new Set<number>()
  const builds = results.flatMap(r => r.builds).filter(b => {
    if (seen.has(b.id)) return false
    seen.add(b.id)
    return true
  })

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 p-10 mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Local AI</p>
        <h1 className="text-3xl font-bold text-ink mb-3">SFF builds for local AI</h1>
        <p className="text-ink-muted max-w-2xl leading-relaxed">
          Running Ollama, LM Studio, ComfyUI, or Stable Diffusion locally? VRAM is everything.
          These compact builds pack high-end GPUs into cases under 20L — whisper-quiet, always-on,
          and powerful enough for serious inference workloads.
        </p>
      </div>

      {/* What to look for guide */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: 'VRAM first',
            body: 'For 7B models: 8GB minimum. For 13B+: 16GB. For 70B quantized: 24GB+. The RTX 3090/4090 with 24GB VRAM is the gold standard for local LLM work.',
          },
          {
            title: 'Thermal efficiency matters',
            body: 'Small cases concentrate heat. Look for builds where GPU stress temps stay under 80°C — sustained inference loads run hotter than games. Check the thermal headroom column.',
          },
          {
            title: 'Power draw',
            body: 'A 4090 pulls 450w under load. In a small case on a 300w PSU that\'s a problem. Check the power draw figures against each build\'s PSU rating before replicating.',
          },
        ].map(item => (
          <div key={item.title} className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>

      {/* Build grid */}
      <section>
        <h2 className="text-lg font-semibold text-ink mb-6">
          Builds with high-VRAM GPUs
          <span className="ml-2 text-sm font-normal text-ink-muted">({builds.length} found)</span>
        </h2>

        {builds.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-16 text-center">
            <p className="text-ink-muted">No benchmarked builds found — check back as more are added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {builds.map(b => <BuildCard key={b.id} build={b} />)}
          </div>
        )}
      </section>

      {/* Coming soon */}
      <section className="mt-16 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
        <h3 className="font-semibold text-ink mb-2">Inference benchmarks coming soon</h3>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          We&apos;re adding tokens/sec measurements for common models (Llama 3, Mistral, Gemma)
          across builds. Have data to contribute? Submit your build with inference results.
        </p>
      </section>
    </div>
  )
}
