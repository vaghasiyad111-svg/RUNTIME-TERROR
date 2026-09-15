import { NextRequest, NextResponse } from 'next/server'
import { simulationSchema } from '@/lib/validation/schemas'
import { DEMO_USERS, computeSimulation } from '@/lib/mock/engine'
import type { SimulationResponse } from '@/lib/types'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const parsed = simulationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid simulation parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const scenario = parsed.data

    // Get base score — from demo users or from body
    let baseScore = body.current_score as number
    let baseInput = body.input

    const demo = DEMO_USERS.find((u) => u.id === id)
    if (demo) {
      baseScore = demo.result.score
      baseInput = demo.input
    }

    if (typeof baseScore !== 'number') {
      return NextResponse.json({ error: 'current_score is required' }, { status: 400 })
    }

    // ── Mock Simulation ────────────────────────────────────────
    // In Phase 2: replace with counterfactual ML call to FastAPI:
    //   POST /ml/simulate  { base_input, scenario }
    // ─────────────────────────────────────────────────────────
    const { simulated_score, score_change, improvement_breakdown } = computeSimulation(
      baseScore,
      baseInput,
      scenario
    )

    const response: SimulationResponse = {
      assessment_id: id,
      current_score: baseScore,
      simulated_score,
      score_change,
      scenario,
      improvement_breakdown,
      disclaimer:
        'Simulation estimate for demonstration purposes. Not a guaranteed future credit score.',
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error('[POST /api/assessment/[id]/simulate] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
