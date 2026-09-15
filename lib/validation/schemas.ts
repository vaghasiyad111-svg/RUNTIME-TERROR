import { z } from 'zod'

// ─── Assessment Form Validation Schema ─────────────────────
export const assessmentSchema = z.object({
  // Section 1 — Financial Profile
  monthly_income: z
    .number({ required_error: 'Monthly income is required' })
    .min(1000, 'Income must be at least ₹1,000')
    .max(10000000, 'Please enter a valid income'),

  income_stability: z
    .number()
    .min(1, 'Select a stability level')
    .max(10, 'Maximum value is 10'),

  monthly_spending: z
    .number({ required_error: 'Monthly spending is required' })
    .min(0, 'Spending cannot be negative')
    .max(10000000, 'Please enter a valid amount'),

  savings_ratio: z
    .number()
    .min(0, 'Savings ratio cannot be negative')
    .max(1, 'Savings ratio cannot exceed 1.0'),

  // Section 2 — Payment Behaviour
  bill_payment_ratio: z
    .number()
    .min(0, 'Bill payment ratio cannot be negative')
    .max(1, 'Bill payment ratio cannot exceed 1.0'),

  payment_delay_days: z
    .number()
    .min(0, 'Delay days cannot be negative')
    .max(90, 'Enter realistic delay (0–90 days)'),

  utility_payment_consistency: z
    .number()
    .min(1, 'Select a consistency level')
    .max(10, 'Maximum value is 10'),

  rent_payment_consistency: z
    .number()
    .min(1, 'Select a consistency level')
    .max(10, 'Maximum value is 10'),

  // Section 3 — Digital Behaviour
  transaction_frequency: z
    .number()
    .min(0, 'Cannot be negative')
    .max(500, 'Enter realistic transaction count'),

  recharge_regularity: z
    .number()
    .min(1, 'Select a regularity level')
    .max(10, 'Maximum value is 10'),

  digital_payment_usage: z
    .number()
    .min(1, 'Select a usage level')
    .max(10, 'Maximum value is 10'),

  cashflow_consistency: z
    .number()
    .min(1, 'Select a consistency level')
    .max(10, 'Maximum value is 10'),

  // Section 4 — Alternative Signals
  gig_income_consistency: z
    .number()
    .min(1, 'Select a consistency level')
    .max(10, 'Maximum value is 10'),

  microfinance_repayment_consistency: z
    .number()
    .min(1, 'Select a consistency level')
    .max(10, 'Maximum value is 10'),
}).refine(
  (data) => data.monthly_spending <= data.monthly_income * 2,
  {
    message: 'Monthly spending seems unusually high relative to income',
    path: ['monthly_spending'],
  }
)

export type AssessmentFormData = z.infer<typeof assessmentSchema>

// ─── Simulation Schema ─────────────────────────────────────
export const simulationSchema = z.object({
  spending_reduction_pct: z.number().min(0).max(30),
  bill_payment_improvement: z.number().min(50).max(100),
  savings_increase_pct: z.number().min(0).max(30),
  payment_delay_reduction: z.number().min(0).max(15),
})

export type SimulationFormData = z.infer<typeof simulationSchema>
