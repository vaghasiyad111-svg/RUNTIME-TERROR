import { NextResponse } from 'next/server'
import type { ModelStatusResponse } from '@/lib/types'

export async function GET() {
  const response: ModelStatusResponse = {
    status: 'mock',
    current_version: 'demo-v0',
    model_name: 'SCORIFY Demo Model',
    model_type: 'Rule-based Mock (Phase 1)',
    is_mock: true,
    message:
      'Running in demo mode. Phase 2 will integrate a trained Random Forest classifier with SHAP explainability via FastAPI.',
  }

  return NextResponse.json(response)
}
