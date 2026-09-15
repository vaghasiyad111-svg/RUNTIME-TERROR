-- ============================================================
-- SCORIFY — Supabase PostgreSQL Migration
-- Version: 001_initial_schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE,
  name        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ─── credit_assessments ────────────────────────────────────
CREATE TABLE IF NOT EXISTS credit_assessments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Section 1: Financial Profile (raw input features — no target leakage)
  monthly_income    NUMERIC(12, 2) NOT NULL,
  income_stability  SMALLINT       NOT NULL CHECK (income_stability BETWEEN 1 AND 10),
  monthly_spending  NUMERIC(12, 2) NOT NULL,
  savings_ratio     NUMERIC(5, 4)  NOT NULL CHECK (savings_ratio BETWEEN 0 AND 1),

  -- Section 2: Payment Behaviour
  bill_payment_ratio           NUMERIC(5, 4) NOT NULL CHECK (bill_payment_ratio BETWEEN 0 AND 1),
  payment_delay_days           SMALLINT      NOT NULL CHECK (payment_delay_days >= 0),
  utility_payment_consistency  SMALLINT      NOT NULL CHECK (utility_payment_consistency BETWEEN 1 AND 10),
  rent_payment_consistency     SMALLINT      NOT NULL CHECK (rent_payment_consistency BETWEEN 1 AND 10),

  -- Section 3: Digital Behaviour
  transaction_frequency  SMALLINT NOT NULL CHECK (transaction_frequency >= 0),
  recharge_regularity    SMALLINT NOT NULL CHECK (recharge_regularity BETWEEN 1 AND 10),
  digital_payment_usage  SMALLINT NOT NULL CHECK (digital_payment_usage BETWEEN 1 AND 10),
  cashflow_consistency   SMALLINT NOT NULL CHECK (cashflow_consistency BETWEEN 1 AND 10),

  -- Section 4: Alternative Signals
  gig_income_consistency              SMALLINT NOT NULL CHECK (gig_income_consistency BETWEEN 1 AND 10),
  microfinance_repayment_consistency  SMALLINT NOT NULL CHECK (microfinance_repayment_consistency BETWEEN 1 AND 10),

  -- Model output
  score          SMALLINT     NOT NULL CHECK (score BETWEEN 0 AND 100),
  risk_band      TEXT         NOT NULL CHECK (risk_band IN ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH')),
  confidence     NUMERIC(4,3) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  model_version  TEXT         NOT NULL DEFAULT 'demo-v0',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id   ON credit_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON credit_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_band  ON credit_assessments(risk_band);

-- ─── score_explanations ────────────────────────────────────
CREATE TABLE IF NOT EXISTS score_explanations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id  UUID NOT NULL REFERENCES credit_assessments(id) ON DELETE CASCADE,

  feature_name   TEXT        NOT NULL,
  feature_value  TEXT        NOT NULL,
  contribution   NUMERIC(8,5) NOT NULL,  -- SHAP-style value
  direction      TEXT        NOT NULL CHECK (direction IN ('positive', 'negative')),
  explanation    TEXT        NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_explanations_assessment_id ON score_explanations(assessment_id);

-- ─── what_if_simulations ───────────────────────────────────
CREATE TABLE IF NOT EXISTS what_if_simulations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id  UUID NOT NULL REFERENCES credit_assessments(id) ON DELETE CASCADE,

  current_score   SMALLINT     NOT NULL,
  simulated_score SMALLINT     NOT NULL,
  score_change    SMALLINT     NOT NULL,
  scenario_json   JSONB        NOT NULL,  -- SimulationScenario object

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simulations_assessment_id ON what_if_simulations(assessment_id);

-- ─── model_versions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS model_versions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  version     TEXT NOT NULL UNIQUE,
  model_name  TEXT NOT NULL,
  model_type  TEXT NOT NULL,   -- e.g. 'Random Forest', 'Mock Rule-Based'
  trained_at  TIMESTAMPTZ,     -- NULL for mock models

  -- Evaluation metrics (NULL for mock)
  accuracy    NUMERIC(5,4),
  f1_score    NUMERIC(5,4),
  auc_roc     NUMERIC(5,4),

  notes       TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the demo model version
INSERT INTO model_versions (version, model_name, model_type, trained_at, accuracy, f1_score, auc_roc, notes)
VALUES (
  'demo-v0',
  'SCORIFY Demo Model',
  'Mock Rule-Based (Phase 1)',
  NULL,
  NULL,
  NULL,
  NULL,
  'Placeholder model for hackathon MVP. Replace with trained Random Forest + SHAP in Phase 2.'
) ON CONFLICT (version) DO NOTHING;
