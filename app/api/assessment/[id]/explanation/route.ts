import { NextRequest, NextResponse } from 'next/server'
import { DEMO_USERS, computeMockExplanations } from '@/lib/mock/engine'
import type { ExplanationResponse } from '@/lib/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const demo = DEMO_USERS.find((u) => u.id === id)
  if (demo) {
    const contributions = computeMockExplanations(demo.input, demo.result.score)
    const response: ExplanationResponse = {
      assessment_id: id,
      summary: demo.explanation.summary,
      feature_contributions: contributions,
      is_mock: true,
      mock_label: 'Demo Explainability — Mock SHAP Data',
    }
    return NextResponse.json(response)
  }

  return NextResponse.json(
    { error: 'Explanation not found for this assessment.' },
    { status: 404 }
  )
}
