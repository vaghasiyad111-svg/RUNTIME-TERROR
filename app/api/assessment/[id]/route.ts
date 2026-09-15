import { NextRequest, NextResponse } from 'next/server'
import { DEMO_USERS } from '@/lib/mock/engine'
import { db } from '@/lib/db/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // 1. Check demo users first
  const demo = DEMO_USERS.find((u) => u.id === id)
  if (demo) {
    return NextResponse.json({
      ...demo.result,
      input: demo.input,
    })
  }

  // 2. Fetch from Firebase Firestore
  try {
    if (db) {
      const docRef = doc(db, 'credit_assessments', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        return NextResponse.json({
          assessment_id: id,
          score: data.score,
          risk_band: data.risk_band,
          confidence: data.confidence,
          model_version: data.model_version || 'demo-v0',
          key_positive_factors: data.key_positive_factors || [],
          key_negative_factors: data.key_negative_factors || [],
          input: data.input,
          created_at: data.created_at,
        })
      }
    }
  } catch (err) {
    console.warn('[Firebase Firestore] Error fetching assessment:', err)
  }

  return NextResponse.json(
    { error: 'Assessment not found. Use a demo ID or submit a new assessment.' },
    { status: 404 }
  )
}
