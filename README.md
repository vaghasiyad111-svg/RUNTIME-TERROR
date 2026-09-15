# SCORIFY

> **"No Credit History ≠ No Creditworthiness."**

**Creditworthiness Beyond Credit History** — An Explainable AI-powered Alternate Credit Scoring platform built for the financially underserved.

---

## 🎯 Problem Statement

Over **190 million adults in India** lack formal credit history. Traditional credit scoring systems (CIBIL, Equifax) rely entirely on past credit behaviour — credit cards, loans, EMIs. This creates a systemic exclusion of:

- Gig workers and freelancers
- First-time borrowers
- Informal economy workers
- Rural populations without bank accounts
- People who've simply never needed credit

Their creditworthiness **exists** — but traditional systems cannot see it.

---

## 💡 Solution

SCORIFY uses **alternate financial and behavioural signals** to compute a credit intelligence score:

- No CIBIL history required
- No credit card required
- No bank login required
- Privacy-aware by design

The product flow:

```
Alternate Data → AI Credit Intelligence → Score → WHY? → WHAT CAN I IMPROVE? → Responsible AI
```

---

## ✨ Unique Features

| Feature | Description |
|--------|-------------|
| 🔍 **Alternate Credit Intelligence** | 14 behavioral signals instead of traditional credit history |
| 🧠 **Explainable AI** | SHAP-style feature contributions — know exactly why |
| ⚡ **What-If Simulator** | Simulate score improvement from specific behaviour changes |
| 🛡️ **Responsible AI** | No demographics, transparent scoring, human review required |
| 🏗️ **ML-Ready Architecture** | Clean contract for FastAPI + Random Forest + SHAP in Phase 2 |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SCORIFY Frontend                      │
│              Next.js 14 + TypeScript + Tailwind          │
├──────────────┬──────────────────────────┬───────────────┤
│  Landing     │  Assessment Form         │  Dashboard    │
│  Page        │  (4-section, Zod valid.) │  + Explain.   │
│              │                          │  + Simulator  │
└──────────────┴──────────┬───────────────┴───────────────┘
                           │
              ┌────────────▼────────────┐
              │   Next.js API Routes    │
              │  POST /api/assessment   │
              │  GET  /api/assessment/[id]/explanation │
              │  POST /api/assessment/[id]/simulate    │
              │  GET  /api/model/status │
              └────────────┬────────────┘
                           │ (Phase 1: Mock)
              ┌────────────▼────────────┐    ┌─────────────────┐
              │   Mock Scoring Engine   │    │  Supabase       │
              │   lib/mock/engine.ts    │    │  PostgreSQL     │
              │   (Formula-based)       │    │  (Optional DB)  │
              └─────────────────────────┘    └─────────────────┘

─── Phase 2 (Future) ───────────────────────────────────────
              ┌────────────────────────┐
              │   Python FastAPI ML    │
              │   Random Forest        │
              │   SHAP Explainability  │
              │   Joblib Model Serving │
              └────────────────────────┘
```

---

## 🧰 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (custom fintech design system)
- **Lucide React** (icons)
- **Recharts** (charts — ready for Phase 2)
- **Zod** (form and API validation)

### Backend (Phase 1)
- **Next.js API Routes** (Route Handlers)
- **Mock scoring engine** (`lib/mock/engine.ts`)

### Database
- **Supabase PostgreSQL** (optional — graceful degradation in mock mode)

### Future AI/ML (Phase 2)
- **Python 3.11+**
- **Pandas + NumPy** (data processing)
- **Scikit-learn** (Random Forest classifier)
- **SHAP** (feature explainability)
- **Joblib** (model serialization)
- **FastAPI** (ML microservice)

---

## 📊 Database Structure

```
users
  └── id, email, name, created_at, updated_at

credit_assessments
  └── id, user_id (nullable)
      Financial: monthly_income, income_stability, monthly_spending, savings_ratio
      Payment:   bill_payment_ratio, payment_delay_days, utility_payment_consistency, rent_payment_consistency
      Digital:   transaction_frequency, recharge_regularity, digital_payment_usage, cashflow_consistency
      Alternate: gig_income_consistency, microfinance_repayment_consistency
      Result:    score, risk_band, confidence, model_version

score_explanations
  └── id, assessment_id → feature_name, feature_value, contribution, direction, explanation

what_if_simulations
  └── id, assessment_id → current_score, simulated_score, score_change, scenario_json

model_versions
  └── id, version, model_name, model_type, trained_at, accuracy, f1_score, auc_roc
```

**Dataset note**: `credit_data.csv` contains synthetic behavioral data generated via `generate_data.py`.
- Safe features: `monthly_income, income_stability, bill_payment_ratio, recharge_regularity, monthly_spending, savings_ratio, transaction_frequency, payment_delay_days, cashflow_consistency`
- Target label (NOT a feature): `risk_band`
- Derived column (excluded to avoid leakage): `spending_to_income`

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ (LTS)
- npm or yarn

### 1. Clone and install

```bash
git clone https://github.com/your-org/scorify.git
cd scorify
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (optional for Phase 1)
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. TypeScript + lint checks

```bash
npm run type-check
npm run lint
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional (Phase 1) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional (Phase 1) | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional (Phase 1) | Supabase service role key (server-side) |
| `ML_SERVICE_URL` | Phase 2 | URL of Python FastAPI ML service |
| `ML_SERVICE_API_KEY` | Phase 2 | API key for ML service |
| `NEXT_PUBLIC_APP_URL` | Optional | Public app URL (default: http://localhost:3000) |

**Phase 1 works entirely without Supabase** — all data is computed in memory.

---

## 🗺️ Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — problem, how it works, features |
| `/assessment` | 4-section financial behaviour form |
| `/dashboard` | Credit Intelligence Dashboard with score |
| `/explainability` | SHAP-style feature contribution chart |
| `/simulator` | What-If Credit Improvement Simulator |
| `/demo` | Pre-built demo profiles (Low/Medium/High risk) |

---

## 🤖 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/assessment` | Submit assessment, returns score + explanation |
| `GET` | `/api/assessment/[id]` | Fetch assessment by ID |
| `GET` | `/api/assessment/[id]/explanation` | Fetch SHAP explanations |
| `POST` | `/api/assessment/[id]/simulate` | Run what-if simulation |
| `GET` | `/api/model/status` | Current model version/status |

---

## ⚠️ Current Mock Limitations (Phase 1)

- Scoring uses a rule-based formula (not a trained ML model)
- SHAP values are approximated (not real SHAP output)
- What-if simulation uses a linear delta formula (not ML counterfactual)
- No user authentication
- No persistent storage (data lives in browser sessionStorage)
- All scores are clearly labelled as **Demo / Mock**

---

## 🔬 Phase 2 — ML Integration

The architecture is designed to plug in the Python ML service without redesigning the frontend:

### Step 1 — Train the model
```bash
cd ml/
pip install -r requirements.txt
python train.py  # Trains RandomForestClassifier on credit_data.csv
```

### Step 2 — Start FastAPI ML service
```bash
uvicorn app:app --port 8000
```

### Step 3 — Update environment
```bash
ML_SERVICE_URL=http://localhost:8000
```

### Step 4 — Update API route
In `app/api/assessment/route.ts`, replace the mock scoring block with:
```typescript
const mlResponse = await fetch(`${process.env.ML_SERVICE_URL}/predict`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
})
const mlResult: MLPredictionResponse = await mlResponse.json()
```

The `MLPredictionResponse` TypeScript interface is already defined in `lib/types/index.ts`.

---

## 📸 Screenshots

> _Add screenshots after first demo run_

- [ ] Landing page hero
- [ ] Assessment form (Section 1)
- [ ] Credit Intelligence Dashboard
- [ ] Explainability chart
- [ ] What-If Simulator

---

## 🗓️ Future Roadmap

### Phase 2 — ML Integration
- [ ] Train Random Forest on `credit_data.csv`
- [ ] Integrate SHAP for real feature contributions
- [ ] FastAPI ML microservice
- [ ] Real ML-based what-if counterfactual engine

### Phase 3 — Product
- [ ] User authentication (Supabase Auth)
- [ ] Persistent assessment history
- [ ] PDF credit intelligence report export
- [ ] Lender API integration (B2B)
- [ ] Mobile app (React Native)

### Phase 4 — Scale
- [ ] Real banking data integration (Account Aggregator)
- [ ] Multilingual support (Hindi, Tamil, Kannada)
- [ ] Regulatory compliance review (RBI guidelines)
- [ ] Model fairness audits

---

## 🛡️ Responsible AI

- **No protected demographic attributes** are used as features (no gender, caste, religion, age, region)
- **Explainable by design** — every score comes with reasons
- **AI is decision support** — not automatic loan approval/rejection
- **Synthetic data** used during hackathon phase
- **Human review** required for any high-impact financial decisions
- **Not financial advice** — indicative score only

---

## 👥 Team

| Name | Role |
|------|------|
| _(Add team members)_ | _(Add roles)_ |

---

## 📄 License

MIT — See LICENSE file.

---

*Built for the AI Hackathon · SCORIFY MVP Foundation · Phase 1*
