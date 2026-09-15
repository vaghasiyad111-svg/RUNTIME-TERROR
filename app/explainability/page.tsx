'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Brain, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Loader2, Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { computeMockExplanations } from '@/lib/mock/engine'
import type { FeatureContribution } from '@/lib/types'

// ─── Contribution Bar ─────────────────────────────────────────
function ContributionBar({ fc, maxAbs }: { fc: FeatureContribution; maxAbs: number }) {
  const isPos = fc.direction === 'positive'
  const pct = maxAbs > 0 ? (Math.abs(fc.contribution) / maxAbs) * 100 : 0
  const widthStyle = `${Math.max(pct, 3)}%`

  return (
    <div className="py-3 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center justify-between mb-2 gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {isPos
            ? <TrendingUp size={13} className="text-emerald-400 shrink-0" />
            : <TrendingDown size={13} className="text-red-400 shrink-0" />
          }
          <span className="text-sm font-medium text-white/85 truncate">
            {fc.feature_label}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-white/40 font-mono">
            {String(fc.feature_value)}
          </span>
          <span className={cn(
            'text-sm font-bold tabular-nums w-16 text-right font-mono',
            isPos ? 'text-emerald-400' : 'text-red-400'
          )}>
            {isPos ? '+' : ''}{fc.contribution.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Bar track */}
      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', isPos ? 'bg-emerald-400' : 'bg-red-400')}
          style={{ width: widthStyle }}
        />
      </div>

      {/* Explanation */}
      <p className="text-xs text-white/35 mt-1.5 leading-relaxed">{fc.explanation}</p>
    </div>
  )
}

function ExplainabilityContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  const [contributions, setContributions] = useState<FeatureContribution[]>([])
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('scorify_result')
    const storedInput = sessionStorage.getItem('scorify_input')

    if (!stored || !storedInput) {
      router.replace('/assessment')
      return
    }

    const result = JSON.parse(stored)
    const input = JSON.parse(storedInput)

    const contribs = computeMockExplanations(input, result.score)
    setContributions(contribs)

    // Build dynamic summary
    const topPos = contribs.filter((c) => c.direction === 'positive').slice(0, 2)
    const topNeg = contribs.filter((c) => c.direction === 'negative').slice(0, 2)
    const posList = topPos.map((c) => c.feature_label).join(' and ')
    const negList = topNeg.map((c) => c.feature_label).join(' and ')
    setSummary(
      topPos.length > 0 && topNeg.length > 0
        ? `Your score is primarily supported by ${posList}. ${negList} ${topNeg.length > 1 ? 'are' : 'is'} currently the main factors reducing your score.`
        : topPos.length > 0
        ? `Your score is primarily supported by ${posList}.`
        : `Your score is primarily impacted by ${negList}. Focus on improving these to boost your creditworthiness.`
    )

    setIsLoading(false)
  }, [router, id])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    )
  }

  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.contribution)), 0.01)
  const positiveContribs = contributions.filter((c) => c.direction === 'positive')
  const negativeContribs = contributions.filter((c) => c.direction === 'negative')

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Feature Explainability</p>
          <h1 className="text-3xl font-bold text-white mb-2">Why This Score?</h1>
          <p className="text-white/45 text-sm">
            Understand exactly which financial behaviours contributed to your credit intelligence score.
          </p>
        </div>

        {/* Mock label banner */}
        <div className="mb-6 flex items-center gap-2.5 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300/80">
            <strong>Demo Explainability — Mock SHAP Data.</strong> In Phase 2, real SHAP values from the
            trained Random Forest model will replace these approximations.
          </p>
        </div>

        {/* Summary card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-blue-400" />
            <h2 className="font-semibold text-white text-sm">AI Explanation Summary</h2>
          </div>
          <p className="text-white/65 text-sm leading-relaxed">{summary}</p>
        </div>

        {/* How to read this */}
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-blue-500/8 border border-blue-500/20">
          <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-300/70 space-y-1">
            <p><strong>How to read this chart:</strong></p>
            <p>
              Each bar shows how much a feature <em>raised</em> (green +) or <em>lowered</em> (red −) your score.
              Longer bars = bigger impact. Values are SHAP-style contributions (demo approximation).
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-emerald-400" />
            <span className="text-xs text-white/50">Raises your score (positive)</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown size={13} className="text-red-400" />
            <span className="text-xs text-white/50">Lowers your score (negative)</span>
          </div>
        </div>

        {/* All contributions chart */}
        <div className="card p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-6 pb-3 border-b border-white/[0.07]">
            Feature Contribution Chart
            <span className="ml-2 text-xs font-normal text-white/30">(sorted by impact)</span>
          </h2>
          <div>
            {contributions.map((fc) => (
              <ContributionBar key={fc.feature_name} fc={fc} maxAbs={maxAbs} />
            ))}
          </div>
        </div>

        {/* Split view */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Positive */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.07]">
              <TrendingUp size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Positive Contributions</h2>
            </div>
            <div className="space-y-3">
              {positiveContribs.map((fc) => (
                <div key={fc.feature_name} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-white/60">{fc.feature_label}</span>
                  <span className="text-sm font-bold text-emerald-400 tabular-nums font-mono">
                    +{fc.contribution.toFixed(3)}
                  </span>
                </div>
              ))}
              {positiveContribs.length === 0 && (
                <p className="text-xs text-white/30 italic">No positive factors detected.</p>
              )}
            </div>
          </div>

          {/* Negative */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.07]">
              <TrendingDown size={16} className="text-red-400" />
              <h2 className="text-sm font-semibold text-white">Negative Contributions</h2>
            </div>
            <div className="space-y-3">
              {negativeContribs.map((fc) => (
                <div key={fc.feature_name} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-white/60">{fc.feature_label}</span>
                  <span className="text-sm font-bold text-red-400 tabular-nums font-mono">
                    {fc.contribution.toFixed(3)}
                  </span>
                </div>
              ))}
              {negativeContribs.length === 0 && (
                <p className="text-xs text-white/30 italic">No negative factors detected.</p>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-white text-sm mb-1">Ready to improve your score?</h3>
            <p className="text-xs text-white/40">
              Use the What-If Simulator to see the impact of specific changes.
            </p>
          </div>
          <Link href={`/simulator?id=${id}`} className="btn-primary text-sm">
            Open Simulator
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function ExplainabilityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    }>
      <ExplainabilityContent />
    </Suspense>
  )
}
