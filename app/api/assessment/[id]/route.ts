import { NextRequest, NextResponse } from 'next/server'
import { DEMO_USERS } from '@/lib/mock/engine'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // Check demo users first
  const demo = DEMO_USERS.find((u) => u.id === id)
  if (demo) {
    return NextResponse.json({
      ...demo.result,
      input: demo.input,
    })
  }

  // In production, fetch from Supabase:
  // const db = createServerClient()
  // const { data } = await db.from('credit_assessments').select().eq('id', id).single()

  return NextResponse.json(
    { error: 'Assessment not found. Use a demo ID or submit a new assessment.' },
    { status: 404 }
  )
}
