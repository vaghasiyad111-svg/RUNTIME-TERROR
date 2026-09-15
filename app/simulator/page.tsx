'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Zap, AlertTriangle, TrendingUp, BarChart2, ArrowUp, RefreshCw, Loader2,
} from 'lucide-react'
import { cn, getScoreColor, getRiskBgColor, getRiskColor, getRiskLabel } from '@/lib/utils'
import { computeSimulation } from '@/lib/mock/engine'
import type { AssessmentInput, RiskBand, SimulationScenario } from '@/lib/types'

function MiniScoreBar({ score, label }: { score: number; label: string }) {
  const color = getScoreColor(score)
  return (
    <div className="text-center">
      <div className="text-3xl font-bold tabular-nums mb-1" style={{ color }}>{score}</div>
      <div className="text-xs text-white/40 mb-2">{label}</div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden w-full">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function ScoreDelta({ delta }: { delta: number }) {
  if (delta === 0) return <span className="text-white/40 font-bold text-xl">±0</span>
  const isPos = delta > 0
  return (
    <div className={cn(
      'flex items-center gap-1 text-xl font-bold',
      isPos ? 'text-emerald-400' : 'text-red-400'
    )}>
      <ArrowUp size={20} className={cn(!isPos && 'rotate-180')} />
      {isPos ? '+' : ''}{delta}
    </div>
  )
}

function getRiskBandForScore(score: number): RiskBand {
  if (score >= 70) return 'LOW'
  if (score >= 50) return 'MEDIUM'
  if (score >= 30) return 'HIGH'
  return 'VERY_HIGH'
}

function SimulatorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  const [baseScore, setBaseScore] = useState(62)
  const [baseInput, setBaseInput] = useState<AssessmentInput | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [scenario, setScenario] = useState<SimulationScenario>({
    spending_reduction_pct: 0,
    bill_payment_improvement: 75,
    savings_increase_pct: 0,
    payment_delay_reduction: 0,
  })

  useEffect(() => {
    const stored = sessionStorage.getItem('scorify_result')
    const storedInput = sessionStorage.getItem('scorify_input')

    if (stored && storedInput) {
      const result = JSON.parse(stored)
      const input = JSON.parse(storedInput)
      setBaseScore(result.score)
      setBaseInput(input)
    }
    setIsLoading(false)
  }, [router, id])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    )
  }

  const dummyInput: AssessmentInput = baseInput || {
    monthly_income: 35000, income_stability: 5, monthly_spending: 28000,
    savings_ratio: 0.12, bill_payment_ratio: (scenario.bill_payment_improvement / 100),
    payment_delay_days: 10, utility_payment_consistency: 6, rent_payment_consistency: 6,
    transaction_frequency: 40, recharge_regularity: 6, digital_payment_usage: 6,
    cashflow_consistency: 5, gig_income_consistency: 5, microfinance_repayment_consistency: 5,
  }

  const { simulated_score, score_change, improvement_breakdown } = computeSimulation(
    baseScore, dummyInput, scenario
  )

  const simBand = getRiskBandForScore(simulated_score)
  const baseBand = getRiskBandForScore(baseScore)

  function updateScenario<K extends keyof SimulationScenario>(key: K, value: SimulationScenario[K]) {
    setScenario((prev) => ({ ...prev, [key]: value }))
  }

  function resetScenario() {
    setScenario({
      spending_reduction_pct: 0,
      bill_payment_improvement: baseInput
        ? Math.round(baseInput.bill_payment_ratio * 100)
        : 75,
      savings_increase_pct: 0,
      payment_delay_reduction: 0,
    })
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">What-If Credit Simulator</p>
          <h1 className="text-3xl font-bold text-white mb-2">How could your score improve?</h1>
          <p className="text-white/45 text-sm max-w-xl">
            Adjust the sliders below to simulate how changes in your financial behaviour
            could affect your credit intelligence score.
          </p>
        </div>

        {/* Major differentiator badge */}
        <div className="mb-6 flex items-center gap-2.5 p-3 rounded-lg bg-blue-500/8 border border-blue-500/20">
          <Zap size={14} className="text-blue-400 shrink-0" />
          <p className="text-xs text-blue-300/80">
            <strong>Key differentiator:</strong> SCORIFY doesn&apos;t just tell you your score — it shows you
            how to improve it. In Phase 2, this simulator will use ML-based counterfactual analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── Controls (left) ──────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.07]">
                <h2 className="font-semibold text-white text-sm">Adjust Your Behaviour</h2>
                <button onClick={resetScenario} className="btn-ghost text-xs py-1.5 px-3">
                  <RefreshCw size={12} />
                  Reset
                </button>
              </div>

              <div className="space-y-8">
                {/* Spending reduction */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="input-label mb-0 text-xs">Reduce Monthly Spending</label>
                    <span className="text-sm font-bold text-blue-300 tabular-nums">
                      {scenario.spending_reduction_pct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0} max={30} step={1}
                    value={scenario.spending_reduction_pct}
                    onChange={(e) => updateScenario('spending_reduction_pct', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/25 mt-1">
                    <span>0% (no change)</span>
                    <span>30% reduction</span>
                  </div>
                  <p className="input-helper mt-1">
                    Reducing spending improves your spending-to-income ratio
                  </p>
                </div>

                {/* Bill payment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="input-label mb-0 text-xs">Bill Payment Consistency</label>
                    <span className="text-sm font-bold text-blue-300 tabular-nums">
                      {scenario.bill_payment_improvement}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50} max={100} step={1}
                    value={scenario.bill_payment_improvement}
                    onChange={(e) => updateScenario('bill_payment_improvement', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/25 mt-1">
                    <span>50%</span>
                    <span>100% (perfect)</span>
                  </div>
                  <p className="input-helper mt-1">
                    Consistent bill payments have a strong positive impact on your score
                  </p>
                </div>

                {/* Savings */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="input-label mb-0 text-xs">Increase Savings</label>
                    <span className="text-sm font-bold text-blue-300 tabular-nums">
                      {scenario.savings_increase_pct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0} max={30} step={1}
                    value={scenario.savings_increase_pct}
                    onChange={(e) => updateScenario('savings_increase_pct', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/25 mt-1">
                    <span>0% (no change)</span>
                    <span>30% increase</span>
                  </div>
                  <p className="input-helper mt-1">
                    Higher savings ratio signals financial discipline
                  </p>
                </div>

                {/* Payment delays */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="input-label mb-0 text-xs">Reduce Payment Delays</label>
                    <span className="text-sm font-bold text-blue-300 tabular-nums">
                      −{scenario.payment_delay_reduction} days
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0} max={15} step={1}
                    value={scenario.payment_delay_reduction}
                    onChange={(e) => updateScenario('payment_delay_reduction', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/25 mt-1">
                    <span>0 days (no change)</span>
                    <span>−15 days</span>
                  </div>
                  <p className="input-helper mt-1">
                    Fewer payment delays significantly improve your creditworthiness signal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Results (right) ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Score comparison */}
            <div className="card p-6">
              <h2 className="font-semibold text-white text-sm mb-6 pb-3 border-b border-white/[0.07]">
                Score Impact
              </h2>

              <div className="grid grid-cols-3 gap-4 items-center mb-6">
                <MiniScoreBar score={baseScore} label="Current" />
                <div className="text-center">
                  <ScoreDelta delta={score_change} />
                  <div className="text-xs text-white/30 mt-1">change</div>
                </div>
                <MiniScoreBar score={simulated_score} label="Projected" />
              </div>

              {/* Risk band change */}
              {simBand !== baseBand && (
                <div className="p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-center">
                  <p className="text-xs text-emerald-300 font-medium">
                    Risk band could improve from{' '}
                    <span className={cn('font-bold', getRiskColor(baseBand))}>{getRiskLabel(baseBand)}</span>
                    {' '}→{' '}
                    <span className={cn('font-bold', getRiskColor(simBand))}>{getRiskLabel(simBand)}</span>
                  </p>
                </div>
              )}

              {score_change === 0 && (
                <p className="text-xs text-white/30 text-center">
                  Adjust the sliders to see score impact
                </p>
              )}
            </div>

            {/* Breakdown */}
            {improvement_breakdown.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={15} className="text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Improvement Breakdown</h3>
                </div>
                <div className="space-y-3">
                  {improvement_breakdown.map((item) => (
                    <div key={item.factor} className="border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white/70">{item.factor}</span>
                        <span className="text-xs font-bold text-emerald-400 tabular-nums">+{item.delta}</span>
                      </div>
                      <p className="text-xs text-white/35 leading-relaxed">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20">
              <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/70 leading-relaxed">
                Simulation estimate for demonstration purposes. Not a guaranteed future credit score.
                Phase 2 will use ML-based counterfactual analysis.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 card p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-white text-sm mb-1">Explore all pages</h3>
            <p className="text-xs text-white/40">
              See your full credit intelligence report and explainability breakdown.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/explainability?id=${id}`} className="btn-secondary text-sm py-2.5">
              <BarChart2 size={14} />
              Explainability
            </Link>
            <Link href={`/dashboard?id=${id}`} className="btn-ghost text-sm py-2.5">
              Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    }>
      <SimulatorContent />
    </Suspense>
  )
}
