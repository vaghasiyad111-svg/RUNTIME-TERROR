// ============================================================
// SCORIFY — Core TypeScript Types
// ============================================================

// ─── Risk Bands ────────────────────────────────────────────
export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'

// ─── Assessment Input ──────────────────────────────────────
/**
 * Raw behavioral signals collected from the assessment form.
 * These are the ONLY input features — no derived columns, no target leakage.
 * Safe features from credit_data.csv:
 *   monthly_income, income_stability, bill_payment_ratio,
 *   recharge_regularity, monthly_spending, savings_ratio,
 *   transaction_frequency, payment_delay_days, cashflow_consistency
 * Additional form fields (not in CSV) for richer assessment:
 *   utility_payment_consistency, rent_payment_consistency,
 *   digital_payment_usage, gig_income_consistency,
 *   microfinance_repayment_consistency
 */
export interface AssessmentInput {
  // Section 1 — Financial Profile
  monthly_income: number           // INR per month
  income_stability: number         // 1–10 scale
  monthly_spending: number         // INR per month
  savings_ratio: number            // 0.0–0.6 (proportion saved)

  // Section 2 — Payment Behaviour
  bill_payment_ratio: number       // 0.0–1.0 (fraction of bills paid on time)
  payment_delay_days: number       // avg days delayed (0–30)
  utility_payment_consistency: number  // 1–10 scale
  rent_payment_consistency: number     // 1–10 scale

  // Section 3 — Digital Behaviour
  transaction_frequency: number    // transactions per month
  recharge_regularity: number      // 1–10 scale
  digital_payment_usage: number    // 1–10 scale
  cashflow_consistency: number     // 1–10 scale

  // Section 4 — Alternative Signals
  gig_income_consistency: number          // 1–10 scale
  microfinance_repayment_consistency: number  // 1–10 scale
}

// ─── Assessment Record (stored) ────────────────────────────
export interface Assessment extends AssessmentInput {
  id: string
  user_id?: string
  score: number
  risk_band: RiskBand
  confidence: number
  model_version: string
  created_at: string
}

// ─── Feature Contribution (SHAP-style) ─────────────────────
export interface FeatureContribution {
  feature_name: string
  feature_label: string       // Human-readable label
  feature_value: number | string
  contribution: number        // SHAP value (positive = raises score, negative = lowers)
  direction: 'positive' | 'negative'
  explanation: string         // Plain language explanation
}

// ─── Score Explanation ─────────────────────────────────────
export interface ScoreExplanation {
  id: string
  assessment_id: string
  summary: string             // Human-readable overall explanation
  feature_contributions: FeatureContribution[]
  created_at: string
}

// ─── What-If Simulation ────────────────────────────────────
export interface SimulationScenario {
  spending_reduction_pct: number      // 0–30%
  bill_payment_improvement: number   // 50–100%
  savings_increase_pct: number       // 0–30%
  payment_delay_reduction: number    // 0–15 days
}

export interface SimulationResult {
  id?: string
  assessment_id: string
  current_score: number
  simulated_score: number
  score_change: number
  scenario: SimulationScenario
  improvement_breakdown: Array<{
    factor: string
    delta: number
    explanation: string
  }>
  created_at?: string
}

// ─── Model Version ─────────────────────────────────────────
export interface ModelVersion {
  id: string
  version: string
  model_name: string
  model_type: string
  trained_at: string | null
  accuracy: number | null
  f1_score: number | null
  auc_roc: number | null
  notes: string
}

// ─── API Responses ─────────────────────────────────────────
export interface AssessmentResponse {
  assessment_id: string
  score: number
  risk_band: RiskBand
  confidence: number
  model_version: string
  key_positive_factors: string[]
  key_negative_factors: string[]
}

export interface ExplanationResponse {
  assessment_id: string
  summary: string
  feature_contributions: FeatureContribution[]
  is_mock: boolean
  mock_label: string
}

export interface SimulationResponse {
  assessment_id: string
  current_score: number
  simulated_score: number
  score_change: number
  scenario: SimulationScenario
  improvement_breakdown: Array<{
    factor: string
    delta: number
    explanation: string
  }>
  disclaimer: string
}

export interface ModelStatusResponse {
  status: 'mock' | 'live' | 'degraded'
  current_version: string
  model_name: string
  model_type: string
  is_mock: boolean
  message: string
}

// ─── Future ML Contract ────────────────────────────────────
/**
 * Contract for the future Python FastAPI ML service response.
 * Architecture:
 *   Next.js → FastAPI → Random Forest → SHAP → MLPredictionResponse
 *
 * When Phase 2 ML is integrated, this response will replace
 * the mock prediction in /api/assessment.
 */
export interface MLPredictionResponse {
  score: number
  risk_band: RiskBand
  confidence: number
  model_version: string
  explanations: {
    summary: string
    feature_contributions: FeatureContribution[]
  }
  feature_contributions: FeatureContribution[]
  shap_values: Record<string, number>
  processing_time_ms: number
  is_mock: false
}

// ─── Form State ────────────────────────────────────────────
export interface AssessmentFormState {
  currentSection: 1 | 2 | 3 | 4
  isSubmitting: boolean
  errors: Partial<Record<keyof AssessmentInput, string>>
  data: Partial<AssessmentInput>
}

// ─── Demo Users (mock data) ─────────────────────────────────
export interface DemoUser {
  id: string
  name: string
  label: string
  input: AssessmentInput
  result: AssessmentResponse
  explanation: ExplanationResponse
}
