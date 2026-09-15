'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart2, TrendingUp, AlertTriangle, Loader2, ArrowRight } from 'lucide-react'
import { cn, getRiskColor, getRiskBgColor, getRiskLabel, getScoreColor } from '@/lib/utils'
import { DEMO_USERS } from '@/lib/mock/engine'
import { computeMockExplanations } from '@/lib/mock/engine'
import type { RiskBand } from '@/lib/types'

function SmallScoreRing({ score }: { score: number }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const filled = ((100 - score) / 100) * circ
  const color = getScoreColor(score)

  return (
    <div className="relative w-[90px] h-[90px] mx-auto">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={filled}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white tabular-nums">{score}</span>
      </div>
    </div>
  )
}

export default function DemoPage() {
  const router = useRouter()

  function loadDemo(userId: string) {
    const demo = DEMO_USERS.find((u) => u.id === userId)
    if (!demo) return

    const explanations = computeMockExplanations(demo.input, demo.result.score)
    const resultWithExtras = {
      ...demo.result,
      _explanations: explanations,
      _input: demo.input,
    }

    sessionStorage.setItem('scorify_result', JSON.stringify(resultWithExtras))
    sessionStorage.setItem('scorify_input', JSON.stringify(demo.input))
    router.push(`/dashboard?id=${demo.id}`)
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="mb-10">
          <p className="section-label mb-2">Demo Profiles</p>
          <h1 className="text-3xl font-bold text-white mb-2">Explore Example Assessments</h1>
          <p className="text-white/45 text-sm">
            See how SCORIFY evaluates different financial profiles. Click any profile to view the full dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {DEMO_USERS.map((user) => {
            const riskColor = getRiskColor(user.result.risk_band)
            const riskBg = getRiskBgColor(user.result.risk_band)

            return (
              <div key={user.id} className="card p-6 flex flex-col items-center text-center">
                <SmallScoreRing score={user.result.score} />

                <div className={cn('badge border mt-4 mb-3', riskBg)}>
                  <span className={cn('w-2 h-2 rounded-full', riskColor.replace('text-', 'bg-'))} />
                  <span className={cn('font-semibold text-xs', riskColor)}>
                    {getRiskLabel(user.result.risk_band).toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-white text-lg mb-0.5">{user.name}</h3>
                <p className="text-xs text-white/35 mb-4">{user.label}</p>

                <div className="w-full space-y-2 text-left mb-5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">Top Positives</p>
                  {user.result.key_positive_factors.slice(0, 2).map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <TrendingUp size={11} className="text-emerald-400 shrink-0" />
                      <span className="text-xs text-white/60">{f}</span>
                    </div>
                  ))}

                  {user.result.key_negative_factors.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 mt-3">Key Concerns</p>
                      {user.result.key_negative_factors.slice(0, 2).map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <AlertTriangle size={11} className="text-amber-400 shrink-0" />
                          <span className="text-xs text-white/60">{f}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <button
                  onClick={() => loadDemo(user.id)}
                  className="btn-primary w-full justify-center text-xs py-2.5"
                >
                  View Full Dashboard
                  <ArrowRight size={13} />
                </button>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-xs text-white/30 mb-4">
            These are pre-built demo profiles. Take your own assessment for personalised results.
          </p>
          <Link href="/assessment" className="btn-secondary text-sm">
            Take Your Own Assessment
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
