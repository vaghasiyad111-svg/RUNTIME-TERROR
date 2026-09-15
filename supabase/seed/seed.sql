-- ============================================================
-- SCORIFY — Seed Data
-- Demo users and assessments for testing
-- ============================================================

-- ─── Demo Users ────────────────────────────────────────────
INSERT INTO users (id, email, name) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'priya.sharma@demo.scorify', 'Priya Sharma'),
  ('a0000000-0000-0000-0000-000000000002', 'arjun.mehta@demo.scorify',  'Arjun Mehta'),
  ('a0000000-0000-0000-0000-000000000003', 'kavita.reddy@demo.scorify', 'Kavita Reddy')
ON CONFLICT (email) DO NOTHING;

-- ─── Demo Assessments ──────────────────────────────────────

-- User A — LOW RISK (Score: 78)
INSERT INTO credit_assessments (
  id, user_id,
  monthly_income, income_stability, monthly_spending, savings_ratio,
  bill_payment_ratio, payment_delay_days, utility_payment_consistency, rent_payment_consistency,
  transaction_frequency, recharge_regularity, digital_payment_usage, cashflow_consistency,
  gig_income_consistency, microfinance_repayment_consistency,
  score, risk_band, confidence, model_version
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  65000, 8, 28000, 0.42,
  0.95, 2, 9, 9,
  85, 8, 9, 8,
  6, 8,
  78, 'LOW', 0.89, 'demo-v0'
) ON CONFLICT (id) DO NOTHING;

-- User B — MEDIUM RISK (Score: 61)
INSERT INTO credit_assessments (
  id, user_id,
  monthly_income, income_stability, monthly_spending, savings_ratio,
  bill_payment_ratio, payment_delay_days, utility_payment_consistency, rent_payment_consistency,
  transaction_frequency, recharge_regularity, digital_payment_usage, cashflow_consistency,
  gig_income_consistency, microfinance_repayment_consistency,
  score, risk_band, confidence, model_version
) VALUES (
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  32000, 5, 26000, 0.12,
  0.72, 8, 6, 7,
  45, 6, 6, 5,
  5, 6,
  61, 'MEDIUM', 0.81, 'demo-v0'
) ON CONFLICT (id) DO NOTHING;

-- User C — HIGH RISK (Score: 34)
INSERT INTO credit_assessments (
  id, user_id,
  monthly_income, income_stability, monthly_spending, savings_ratio,
  bill_payment_ratio, payment_delay_days, utility_payment_consistency, rent_payment_consistency,
  transaction_frequency, recharge_regularity, digital_payment_usage, cashflow_consistency,
  gig_income_consistency, microfinance_repayment_consistency,
  score, risk_band, confidence, model_version
) VALUES (
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  18000, 3, 22000, 0.00,
  0.48, 22, 3, 4,
  18, 3, 3, 2,
  2, 3,
  34, 'HIGH', 0.85, 'demo-v0'
) ON CONFLICT (id) DO NOTHING;

-- ─── Seed Explanations (User A) ────────────────────────────
INSERT INTO score_explanations (assessment_id, feature_name, feature_value, contribution, direction, explanation)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'income_stability',   '8',   0.14400, 'positive', 'Your income is highly stable'),
  ('b0000000-0000-0000-0000-000000000001', 'bill_payment_ratio', '95%', 0.11667, 'positive', 'You consistently pay bills on time'),
  ('b0000000-0000-0000-0000-000000000001', 'savings_ratio',      '42%', 0.08800, 'positive', 'Strong savings behaviour'),
  ('b0000000-0000-0000-0000-000000000001', 'cashflow_consistency','8',   0.06000, 'positive', 'Consistent cashflow'),
  ('b0000000-0000-0000-0000-000000000001', 'spending_to_income', '43%', 0.02000, 'positive', 'Spending is controlled'),
  ('b0000000-0000-0000-0000-000000000001', 'payment_delay_days', '2 days', -0.01000, 'negative', 'Minor payment delays')
ON CONFLICT DO NOTHING;
