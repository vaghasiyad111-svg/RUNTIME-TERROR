import type {
  AssessmentInput,
  AssessmentResponse,
  ExplanationResponse,
  DemoUser,
  RiskBand,
  FeatureContribution,
} from '@/lib/types'

// ─── Mock Scoring Engine ────────────────────────────────────
/**
 * Deterministic mock scoring formula based on the behavioral signals.
 * Mirrors the logic in generate_data.py (financial_score formula).
 *
 * NOTE: This is a DEMO approximation only.
 * Replace with FastAPI ML service call in Phase 2.
 *
 * Features used (no target leakage, no derived columns):
 *   income_stability, bill_payment_ratio, recharge_regularity,
 *   savings_ratio, cashflow_consistency, payment_delay_days,
 *   spending_to_income (computed here, NOT passed as input)
 */
export function computeMockScore(input: AssessmentInput): {
  score: number
  risk_band: RiskBand
  confidence: number
} {
  const spending_to_income = input.monthly_spending / Math.max(input.monthly_income, 1)

  // Weighted scoring — mirrors generate_data.py logic, extended with new fields
  const raw =
    input.income_stability * 5 +
    input.bill_payment_ratio * 30 +
    input.recharge_regularity * 3 +
    input.savings_ratio * 30 +
    input.cashflow_consistency * 3 +
    input.utility_payment_consistency * 2 +
    input.rent_payment_consistency * 2 +
    input.digital_payment_usage * 1.5 +
    input.gig_income_consistency * 1 +
    input.microfinance_repayment_consistency * 1.5 -
    input.payment_delay_days * 1.5 -
    spending_to_income * 20

  // Normalise to 0–100
  const minPossible = -45
  const maxPossible = 145
  const score = Math.round(
    Math.min(100, Math.max(0, ((raw - minPossible) / (maxPossible - minPossible)) * 100))
  )

  const risk_band: RiskBand =
    score >= 70 ? 'LOW' : score >= 50 ? 'MEDIUM' : score >= 30 ? 'HIGH' : 'VERY_HIGH'

  // Mock confidence — higher for extreme scores, moderate for borderline
  const distFromMid = Math.abs(score - 50) / 50
  const confidence = Math.round((0.72 + distFromMid * 0.2) * 100) / 100

  return { score, risk_band, confidence }
}

// ─── Mock SHAP Explanations ─────────────────────────────────
export function computeMockExplanations(input: AssessmentInput, score: number): FeatureContribution[] {
  const spending_to_income = input.monthly_spending / Math.max(input.monthly_income, 1)

  const contributions: FeatureContribution[] = [
    {
      feature_name: 'income_stability',
      feature_label: 'Income Stability',
      feature_value: input.income_stability,
      contribution: +(((input.income_stability - 5) / 5) * 0.18).toFixed(3),
      direction: input.income_stability >= 5 ? 'positive' : 'negative',
      explanation:
        input.income_stability >= 7
          ? 'Your income is highly stable, which strongly supports creditworthiness.'
          : input.income_stability >= 4
          ? 'Your income stability is moderate.'
          : 'Low income stability is reducing your score.',
    },
    {
      feature_name: 'bill_payment_ratio',
      feature_label: 'Bill Payment Ratio',
      feature_value: `${Math.round(input.bill_payment_ratio * 100)}%`,
      contribution: +(((input.bill_payment_ratio - 0.7) / 0.3) * 0.14).toFixed(3),
      direction: input.bill_payment_ratio >= 0.7 ? 'positive' : 'negative',
      explanation:
        input.bill_payment_ratio >= 0.85
          ? 'You consistently pay your bills on time — a strong positive signal.'
          : input.bill_payment_ratio >= 0.6
          ? 'Your bill payment is mostly consistent.'
          : 'Irregular bill payments are negatively impacting your score.',
    },
    {
      feature_name: 'savings_ratio',
      feature_label: 'Savings Ratio',
      feature_value: `${Math.round(input.savings_ratio * 100)}%`,
      contribution: +(((input.savings_ratio - 0.2) / 0.4) * 0.11).toFixed(3),
      direction: input.savings_ratio >= 0.15 ? 'positive' : 'negative',
      explanation:
        input.savings_ratio >= 0.3
          ? 'Strong savings behaviour reflects good financial discipline.'
          : input.savings_ratio >= 0.1
          ? 'Moderate savings habit noted.'
          : 'Low savings ratio suggests limited financial buffer.',
    },
    {
      feature_name: 'cashflow_consistency',
      feature_label: 'Cashflow Consistency',
      feature_value: input.cashflow_consistency,
      contribution: +(((input.cashflow_consistency - 5) / 5) * 0.08).toFixed(3),
      direction: input.cashflow_consistency >= 5 ? 'positive' : 'negative',
      explanation:
        input.cashflow_consistency >= 7
          ? 'Consistent cashflow indicates reliable financial management.'
          : 'Inconsistent cashflow can signal financial volatility.',
    },
    {
      feature_name: 'spending_to_income',
      feature_label: 'Spending-to-Income Ratio',
      feature_value: `${Math.round(spending_to_income * 100)}%`,
      contribution: +(-(spending_to_income - 0.5) * 0.1).toFixed(3),
      direction: spending_to_income <= 0.6 ? 'positive' : 'negative',
      explanation:
        spending_to_income <= 0.5
          ? 'Your spending is well within your income — positive signal.'
          : spending_to_income <= 0.8
          ? 'Your spending is moderate relative to income.'
          : 'High spending relative to income is reducing your score.',
    },
    {
      feature_name: 'payment_delay_days',
      feature_label: 'Payment Delay (avg days)',
      feature_value: `${input.payment_delay_days} days`,
      contribution: +(-(input.payment_delay_days / 30) * 0.09).toFixed(3),
      direction: input.payment_delay_days <= 5 ? 'positive' : 'negative',
      explanation:
        input.payment_delay_days <= 3
          ? 'Minimal payment delays — excellent payment discipline.'
          : input.payment_delay_days <= 10
          ? 'Some payment delays are affecting your score.'
          : 'Frequent payment delays are significantly reducing your score.',
    },
    {
      feature_name: 'recharge_regularity',
      feature_label: 'Recharge Regularity',
      feature_value: input.recharge_regularity,
      contribution: +(((input.recharge_regularity - 5) / 5) * 0.05).toFixed(3),
      direction: input.recharge_regularity >= 5 ? 'positive' : 'negative',
      explanation:
        input.recharge_regularity >= 7
          ? 'Regular mobile recharges indicate consistent digital engagement.'
          : 'Irregular recharge patterns noted.',
    },
    {
      feature_name: 'utility_payment_consistency',
      feature_label: 'Utility Payment Consistency',
      feature_value: input.utility_payment_consistency,
      contribution: +(((input.utility_payment_consistency - 5) / 5) * 0.06).toFixed(3),
      direction: input.utility_payment_consistency >= 5 ? 'positive' : 'negative',
      explanation:
        input.utility_payment_consistency >= 7
          ? 'Consistent utility payments reflect reliable financial behaviour.'
          : 'Inconsistent utility payments are a mild risk signal.',
    },
  ]

  // Sort by absolute contribution (largest impact first)
  return contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
}

// ─── Positive/Negative Factor Labels ───────────────────────
export function getFactorLabels(input: AssessmentInput): {
  positive: string[]
  negative: string[]
} {
  const spending_to_income = input.monthly_spending / Math.max(input.monthly_income, 1)
  const positive: string[] = []
  const negative: string[] = []

  if (input.income_stability >= 7) positive.push('Stable income source')
  else if (input.income_stability <= 3) negative.push('Low income stability')

  if (input.bill_payment_ratio >= 0.85) positive.push('Consistent bill payments')
  else if (input.bill_payment_ratio <= 0.6) negative.push('Irregular bill payments')

  if (input.savings_ratio >= 0.25) positive.push('Healthy savings behaviour')
  else if (input.savings_ratio <= 0.05) negative.push('Minimal savings buffer')

  if (spending_to_income <= 0.5) positive.push('Controlled spending habits')
  else if (spending_to_income >= 0.85) negative.push('High spending-to-income ratio')

  if (input.payment_delay_days <= 3) positive.push('Timely payment record')
  else if (input.payment_delay_days >= 15) negative.push('Frequent payment delays')

  if (input.cashflow_consistency >= 7) positive.push('Consistent cashflow management')
  else if (input.cashflow_consistency <= 3) negative.push('Inconsistent cashflow')

  if (input.utility_payment_consistency >= 7) positive.push('Regular utility payments')
  if (input.recharge_regularity >= 7) positive.push('Strong digital engagement')

  if (input.gig_income_consistency >= 7) positive.push('Reliable gig income stream')
  if (input.microfinance_repayment_consistency >= 7) positive.push('Strong microfinance repayment')

  return { positive: positive.slice(0, 4), negative: negative.slice(0, 3) }
}

// ─── Mock Simulation Engine ─────────────────────────────────
/**
 * Simplified what-if calculation.
 * In Phase 2, this is replaced by a counterfactual ML call to FastAPI.
 */
export function computeSimulation(
  baseScore: number,
  baseInput: AssessmentInput,
  scenario: {
    spending_reduction_pct: number
    bill_payment_improvement: number
    savings_increase_pct: number
    payment_delay_reduction: number
  }
): {
  simulated_score: number
  score_change: number
  improvement_breakdown: Array<{ factor: string; delta: number; explanation: string }>
} {
  const breakdown: Array<{ factor: string; delta: number; explanation: string }> = []
  let total_delta = 0

  // Spending reduction impact
  if (scenario.spending_reduction_pct > 0) {
    const delta = Math.round(scenario.spending_reduction_pct * 0.25)
    total_delta += delta
    breakdown.push({
      factor: 'Spending Reduction',
      delta,
      explanation: `Reducing spending by ${scenario.spending_reduction_pct}% improves your spending-to-income ratio`,
    })
  }

  // Bill payment improvement
  const billImprovement = scenario.bill_payment_improvement / 100
  if (billImprovement > baseInput.bill_payment_ratio) {
    const delta = Math.round((billImprovement - baseInput.bill_payment_ratio) * 20)
    total_delta += delta
    breakdown.push({
      factor: 'Bill Payment Improvement',
      delta,
      explanation: `Improving bill payment consistency to ${scenario.bill_payment_improvement}% has a strong positive effect`,
    })
  }

  // Savings increase
  if (scenario.savings_increase_pct > 0) {
    const delta = Math.round(scenario.savings_increase_pct * 0.2)
    total_delta += delta
    breakdown.push({
      factor: 'Savings Increase',
      delta,
      explanation: `Increasing savings by ${scenario.savings_increase_pct}% demonstrates stronger financial discipline`,
    })
  }

  // Payment delay reduction
  if (scenario.payment_delay_reduction > 0) {
    const delta = Math.round(scenario.payment_delay_reduction * 0.4)
    total_delta += delta
    breakdown.push({
      factor: 'Payment Delay Reduction',
      delta,
      explanation: `Reducing payment delays by ${scenario.payment_delay_reduction} days improves your payment reliability signal`,
    })
  }

  const simulated_score = Math.min(100, baseScore + total_delta)
  return {
    simulated_score,
    score_change: simulated_score - baseScore,
    improvement_breakdown: breakdown,
  }
}

// ─── Demo Users ─────────────────────────────────────────────
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-a',
    name: 'Priya Sharma',
    label: 'User A — Low Risk',
    input: {
      monthly_income: 65000,
      income_stability: 8,
      monthly_spending: 28000,
      savings_ratio: 0.42,
      bill_payment_ratio: 0.95,
      payment_delay_days: 2,
      utility_payment_consistency: 9,
      rent_payment_consistency: 9,
      transaction_frequency: 85,
      recharge_regularity: 8,
      digital_payment_usage: 9,
      cashflow_consistency: 8,
      gig_income_consistency: 6,
      microfinance_repayment_consistency: 8,
    },
    result: {
      assessment_id: 'demo-a',
      score: 78,
      risk_band: 'LOW',
      confidence: 0.89,
      model_version: 'demo-v0',
      key_positive_factors: [
        'Stable income source',
        'Consistent bill payments',
        'Healthy savings behaviour',
        'Regular utility payments',
      ],
      key_negative_factors: ['Some occasional spending spikes'],
    },
    explanation: {
      assessment_id: 'demo-a',
      summary:
        'Your score is mainly supported by stable income, consistent bill payments, and a healthy savings ratio. Your spending is well managed relative to income.',
      feature_contributions: [],
      is_mock: true,
      mock_label: 'Demo Explainability — Mock SHAP Data',
    },
  },
  {
    id: 'demo-b',
    name: 'Arjun Mehta',
    label: 'User B — Medium Risk',
    input: {
      monthly_income: 32000,
      income_stability: 5,
      monthly_spending: 26000,
      savings_ratio: 0.12,
      bill_payment_ratio: 0.72,
      payment_delay_days: 8,
      utility_payment_consistency: 6,
      rent_payment_consistency: 7,
      transaction_frequency: 45,
      recharge_regularity: 6,
      digital_payment_usage: 6,
      cashflow_consistency: 5,
      gig_income_consistency: 5,
      microfinance_repayment_consistency: 6,
    },
    result: {
      assessment_id: 'demo-b',
      score: 61,
      risk_band: 'MEDIUM',
      confidence: 0.81,
      model_version: 'demo-v0',
      key_positive_factors: ['Moderate bill payment consistency', 'Regular rent payments'],
      key_negative_factors: [
        'High spending-to-income ratio',
        'Occasional payment delays',
        'Low savings buffer',
      ],
    },
    explanation: {
      assessment_id: 'demo-b',
      summary:
        'Your score is held back by a high spending-to-income ratio and occasional payment delays. Improving bill payment consistency and reducing spending would significantly improve your score.',
      feature_contributions: [],
      is_mock: true,
      mock_label: 'Demo Explainability — Mock SHAP Data',
    },
  },
  {
    id: 'demo-c',
    name: 'Kavita Reddy',
    label: 'User C — High Risk',
    input: {
      monthly_income: 18000,
      income_stability: 3,
      monthly_spending: 22000,
      savings_ratio: 0.0,
      bill_payment_ratio: 0.48,
      payment_delay_days: 22,
      utility_payment_consistency: 3,
      rent_payment_consistency: 4,
      transaction_frequency: 18,
      recharge_regularity: 3,
      digital_payment_usage: 3,
      cashflow_consistency: 2,
      gig_income_consistency: 2,
      microfinance_repayment_consistency: 3,
    },
    result: {
      assessment_id: 'demo-c',
      score: 34,
      risk_band: 'HIGH',
      confidence: 0.85,
      model_version: 'demo-v0',
      key_positive_factors: ['Some payment history available'],
      key_negative_factors: [
        'Spending exceeds income',
        'Frequent payment delays',
        'Very low savings',
        'Inconsistent cashflow',
      ],
    },
    explanation: {
      assessment_id: 'demo-c',
      summary:
        'Your score is significantly impacted by spending that exceeds income, frequent payment delays, and minimal savings. Focusing on reducing payment delays and controlling spending would have the highest impact.',
      feature_contributions: [],
      is_mock: true,
      mock_label: 'Demo Explainability — Mock SHAP Data',
    },
  },
]
