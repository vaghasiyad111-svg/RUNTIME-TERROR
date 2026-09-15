import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { assessmentSchema } from '@/lib/validation/schemas'
import {
  computeMockScore,
  computeMockExplanations,
  getFactorLabels,
} from '@/lib/mock/engine'
import type { AssessmentResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parsed = assessmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const input = parsed.data

    // ── Mock Prediction ───────────────────────────────────────
    // In Phase 2: replace this block with a call to FastAPI:
    //   const mlResponse = await fetch(`${process.env.ML_SERVICE_URL}/predict`, {
    //     method: 'POST',
    //     body: JSON.stringify(input),
    //   })
    // ─────────────────────────────────────────────────────────
    const { score, risk_band, confidence } = computeMockScore(input)
    const { positive, negative } = getFactorLabels(input)

    // Generate a stable assessment ID (no DB in mock mode)
    const assessment_id = `asmt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    // Store in Supabase if configured (graceful degradation)
    // const db = createServerClient()
    // if (db) { await db.from('credit_assessments').insert({ ... }) }

    const response: AssessmentResponse = {
      assessment_id,
      score,
      risk_band,
      confidence,
      model_version: 'demo-v0',
      key_positive_factors: positive,
      key_negative_factors: negative,
    }

    // Store assessment in session via header (client stores in URL params)
    return NextResponse.json(
      {
        ...response,
        // Embed computed explanations for immediate use on dashboard
        _explanations: computeMockExplanations(input, score),
        _input: input,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[POST /api/assessment] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Use POST to submit an assessment' },
    { status: 405 }
  )
}
