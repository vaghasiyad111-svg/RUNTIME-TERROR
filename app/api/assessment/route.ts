import { NextRequest, NextResponse } from 'next/server'
import { assessmentSchema } from '@/lib/validation/schemas'
import {
  computeMockScore,
  computeMockExplanations,
  getFactorLabels,
} from '@/lib/mock/engine'
import type { AssessmentResponse } from '@/lib/types'
import { db } from '@/lib/db/firebase'
import { doc, setDoc } from 'firebase/firestore'

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

    // ── Prediction & Scoring ─────────────────────────────────
    const { score, risk_band, confidence } = computeMockScore(input)
    const { positive, negative } = getFactorLabels(input)

    // Generate a stable assessment ID
    const assessment_id = `asmt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    // Store in Firebase Firestore (non-blocking fire-and-forget so it never hangs the API response)
    try {
      if (db) {
        setDoc(doc(db, 'credit_assessments', assessment_id), {
          assessment_id,
          score,
          risk_band,
          confidence,
          model_version: 'demo-v0',
          key_positive_factors: positive,
          key_negative_factors: negative,
          input,
          created_at: new Date().toISOString(),
        }).catch((dbErr) => {
          console.warn('[Firebase Firestore] Background save error:', dbErr)
        })
      }
    } catch (dbErr) {
      console.warn('[Firebase Firestore] Could not initiate assessment save:', dbErr)
    }

    const response: AssessmentResponse = {
      assessment_id,
      score,
      risk_band,
      confidence,
      model_version: 'demo-v0',
      key_positive_factors: positive,
      key_negative_factors: negative,
    }

    return NextResponse.json(
      {
        ...response,
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
