'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Banknote, CreditCard, Smartphone, Users, ArrowRight, ArrowLeft,
  Loader2, CheckCircle2, Info,
} from 'lucide-react'
import type { AssessmentInput } from '@/lib/types'
import {
  computeMockScore,
  getFactorLabels,
  computeMockExplanations,
} from '@/lib/mock/engine'

// ─── Form Sections ──────────────────────────────────────────
const SECTIONS = [
  { id: 1, label: 'Financial Profile',   icon: Banknote,     shortLabel: 'Finance' },
  { id: 2, label: 'Payment Behaviour',   icon: CreditCard,   shortLabel: 'Payments' },
  { id: 3, label: 'Digital Behaviour',   icon: Smartphone,   shortLabel: 'Digital' },
  { id: 4, label: 'Alternative Signals', icon: Users,        shortLabel: 'Alternate' },
]

// ─── Slider Input ────────────────────────────────────────────
function SliderField({
  label, name, value, onChange, min, max, step = 1, helper, unit = '',
  error,
}: {
  label: string; name: string; value: number; onChange: (v: number) => void
  min: number; max: number; step?: number; helper?: string; unit?: string; error?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="input-label mb-0">{label}</label>
        <span className="text-sm font-semibold text-blue-300 tabular-nums">
          {unit === '%' ? `${Math.round(value * 100)}%` : `${value}${unit}`}
        </span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-white/25 mt-1">
        <span>{min}{unit === '%' && unit}</span>
        <span>{max}{unit === '%' && unit}</span>
      </div>
      {helper && <p className="input-helper">{helper}</p>}
      {error && <p className="input-error">{error}</p>}
    </div>
  )
}

// ─── Number Input ────────────────────────────────────────────
function NumberField({
  label, name, value, onChange, placeholder, helper, prefix, error,
}: {
  label: string; name: string; value: number | ''; onChange: (v: number) => void
  placeholder?: string; helper?: string; prefix?: string; error?: string
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">{prefix}</span>
        )}
        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          className={cn('input-field', prefix && 'pl-8')}
          min={0}
        />
      </div>
      {helper && <p className="input-helper">{helper}</p>}
      {error && <p className="input-error">{error}</p>}
    </div>
  )
}

// ─── Select Field ────────────────────────────────────────────
function SelectField({
  label, name, value, onChange, options, helper, error,
}: {
  label: string; name: string; value: number; onChange: (v: number) => void
  options: { value: number; label: string }[]; helper?: string; error?: string
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input-field appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0d1240]">
            {opt.label}
          </option>
        ))}
      </select>
      {helper && <p className="input-helper">{helper}</p>}
      {error && <p className="input-error">{error}</p>}
    </div>
  )
}

const STABILITY_OPTIONS = [
  { value: 1, label: '1 — Very unstable / No fixed income' },
  { value: 2, label: '2 — Highly irregular' },
  { value: 3, label: '3 — Often irregular' },
  { value: 4, label: '4 — Somewhat irregular' },
  { value: 5, label: '5 — Moderate stability' },
  { value: 6, label: '6 — Mostly stable' },
  { value: 7, label: '7 — Stable with minor variations' },
  { value: 8, label: '8 — Very stable' },
  { value: 9, label: '9 — Highly stable' },
  { value: 10, label: '10 — Completely stable / Salaried' },
]

const CONSISTENCY_OPTIONS = [
  { value: 1, label: '1 — Almost never' },
  { value: 2, label: '2 — Rarely' },
  { value: 3, label: '3 — Sometimes' },
  { value: 4, label: '4 — Occasionally' },
  { value: 5, label: '5 — About half the time' },
  { value: 6, label: '6 — Often' },
  { value: 7, label: '7 — Mostly consistent' },
  { value: 8, label: '8 — Very consistent' },
  { value: 9, label: '9 — Almost always' },
  { value: 10, label: '10 — Always, without exception' },
]

// ─── Default form state ──────────────────────────────────────
const DEFAULT_FORM: AssessmentInput = {
  monthly_income: 35000,
  income_stability: 7,
  monthly_spending: 22000,
  savings_ratio: 0.25,
  bill_payment_ratio: 0.85,
  payment_delay_days: 3,
  utility_payment_consistency: 8,
  rent_payment_consistency: 8,
  transaction_frequency: 45,
  recharge_regularity: 7,
  digital_payment_usage: 7,
  cashflow_consistency: 7,
  gig_income_consistency: 5,
  microfinance_repayment_consistency: 7,
}

export default function AssessmentPage() {
  const router = useRouter()
  const [section, setSection] = useState(1)
  const [form, setForm] = useState<AssessmentInput>(DEFAULT_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof AssessmentInput, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update<K extends keyof AssessmentInput>(key: K, value: AssessmentInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validateSection(s: number): boolean {
    const newErrors: Partial<Record<keyof AssessmentInput, string>> = {}
    if (s === 1) {
      if (!form.monthly_income || form.monthly_income < 1000)
        newErrors.monthly_income = 'Please enter a valid monthly income (min ₹1,000)'
      if (!form.monthly_spending || form.monthly_spending < 0)
        newErrors.monthly_spending = 'Please enter a valid amount'
      if (form.monthly_spending > form.monthly_income * 2)
        newErrors.monthly_spending = 'Spending seems unusually high relative to income'
    }
    if (s === 2) {
      if (form.payment_delay_days < 0 || form.payment_delay_days > 90)
        newErrors.payment_delay_days = 'Enter a value between 0–90 days'
    }
    if (s === 3) {
      if (form.transaction_frequency < 0 || form.transaction_frequency > 500)
        newErrors.transaction_frequency = 'Enter a realistic value (0–500)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (!validateSection(section)) return
    setSection((s) => Math.min(s + 1, 4) as 1 | 2 | 3 | 4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    if (!validateSection(section)) return
    setIsSubmitting(true)
    setSubmitError('')

    try {
      let data: any = null

      // Attempt server-side API assessment with a strict 3.5s timeout
      try {
        const controller = new AbortController()
        const timerId = setTimeout(() => controller.abort(), 3500)

        const res = await fetch('/api/assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
          signal: controller.signal,
        })
        clearTimeout(timerId)

        if (res.ok) {
          data = await res.json()
        }
      } catch (networkOrTimeoutErr) {
        console.warn('API route call failed or timed out, applying instant fallback scoring:', networkOrTimeoutErr)
      }

      // Robust fallback: if API route failed or timed out, calculate score immediately in-browser
      if (!data || !data.score) {
        const { score, risk_band, confidence } = computeMockScore(form)
        const { positive, negative } = getFactorLabels(form)
        const assessment_id = `asmt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        data = {
          assessment_id,
          score,
          risk_band,
          confidence,
          model_version: 'demo-v0',
          key_positive_factors: positive,
          key_negative_factors: negative,
          _explanations: computeMockExplanations(form, score),
          _input: form,
        }
      }

      // Store result in sessionStorage for dashboard
      sessionStorage.setItem('scorify_result', JSON.stringify(data))
      sessionStorage.setItem('scorify_input', JSON.stringify(form))

      router.push(`/dashboard?id=${data.assessment_id}`)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((section - 1) / 4) * 100

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="section-label mb-3">Financial Behaviour Assessment</p>
          <h1 className="text-3xl font-bold text-white mb-2">Understand your creditworthiness</h1>
          <p className="text-white/45 text-sm">
            Answer honestly — no sensitive data is required. Takes about 2–3 minutes.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {SECTIONS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    section === s.id
                      ? 'bg-blue-600 text-white ring-2 ring-blue-500/40'
                      : section > s.id
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-white/30'
                  )}
                >
                  {section > s.id ? <CheckCircle2 size={14} /> : s.id}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block',
                    section === s.id ? 'text-white' : section > s.id ? 'text-emerald-400' : 'text-white/30'
                  )}
                >
                  {s.shortLabel}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Section card */}
        <div className="card p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.07]">
            {(() => {
              const s = SECTIONS.find((x) => x.id === section)!
              const Icon = s.icon
              return (
                <>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Icon size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{s.label}</h2>
                    <p className="text-xs text-white/40">Section {s.id} of 4</p>
                  </div>
                </>
              )
            })()}
          </div>

          {/* Section 1 */}
          {section === 1 && (
            <div className="space-y-8">
              <NumberField
                label="Monthly Income"
                name="monthly_income"
                value={form.monthly_income}
                onChange={(v) => update('monthly_income', v)}
                prefix="₹"
                placeholder="e.g. 35000"
                helper="Your average monthly take-home income (salary, freelance, business)"
                error={errors.monthly_income}
              />
              <SelectField
                label="Income Stability"
                name="income_stability"
                value={form.income_stability}
                onChange={(v) => update('income_stability', v)}
                options={STABILITY_OPTIONS}
                helper="How consistent and predictable is your monthly income?"
                error={errors.income_stability}
              />
              <NumberField
                label="Monthly Spending"
                name="monthly_spending"
                value={form.monthly_spending}
                onChange={(v) => update('monthly_spending', v)}
                prefix="₹"
                placeholder="e.g. 22000"
                helper="Your average total monthly expenditure"
                error={errors.monthly_spending}
              />
              <SliderField
                label="Savings Ratio"
                name="savings_ratio"
                value={form.savings_ratio}
                onChange={(v) => update('savings_ratio', v)}
                min={0} max={0.6} step={0.01} unit="%"
                helper="What fraction of your income do you save each month? (0–60%)"
                error={errors.savings_ratio}
              />
            </div>
          )}

          {/* Section 2 */}
          {section === 2 && (
            <div className="space-y-8">
              <SliderField
                label="Bill Payment Ratio"
                name="bill_payment_ratio"
                value={form.bill_payment_ratio}
                onChange={(v) => update('bill_payment_ratio', v)}
                min={0.3} max={1} step={0.01} unit="%"
                helper="What fraction of your monthly bills do you pay on time? (e.g. 0.85 = 85%)"
                error={errors.bill_payment_ratio}
              />
              <NumberField
                label="Average Payment Delay (days)"
                name="payment_delay_days"
                value={form.payment_delay_days}
                onChange={(v) => update('payment_delay_days', v)}
                placeholder="e.g. 3"
                helper="Average number of days you delay payments past due date. Enter 0 if always on time."
                error={errors.payment_delay_days}
              />
              <SelectField
                label="Utility Payment Consistency"
                name="utility_payment_consistency"
                value={form.utility_payment_consistency}
                onChange={(v) => update('utility_payment_consistency', v)}
                options={CONSISTENCY_OPTIONS}
                helper="How consistently do you pay electricity, water, and other utility bills?"
                error={errors.utility_payment_consistency}
              />
              <SelectField
                label="Rent Payment Consistency"
                name="rent_payment_consistency"
                value={form.rent_payment_consistency}
                onChange={(v) => update('rent_payment_consistency', v)}
                options={[{ value: 1, label: '1 — Does not apply / Not applicable' }, ...CONSISTENCY_OPTIONS.slice(1)]}
                helper="How consistently do you pay rent? Select 1 if you own your home or this doesn't apply."
                error={errors.rent_payment_consistency}
              />
            </div>
          )}

          {/* Section 3 */}
          {section === 3 && (
            <div className="space-y-8">
              <NumberField
                label="Monthly Transaction Frequency"
                name="transaction_frequency"
                value={form.transaction_frequency}
                onChange={(v) => update('transaction_frequency', v)}
                placeholder="e.g. 45"
                helper="Total number of digital/bank transactions you make per month"
                error={errors.transaction_frequency}
              />
              <SelectField
                label="Mobile Recharge Regularity"
                name="recharge_regularity"
                value={form.recharge_regularity}
                onChange={(v) => update('recharge_regularity', v)}
                options={CONSISTENCY_OPTIONS}
                helper="How regularly do you recharge your mobile plan without gaps or interruptions?"
                error={errors.recharge_regularity}
              />
              <SelectField
                label="Digital Payment Usage"
                name="digital_payment_usage"
                value={form.digital_payment_usage}
                onChange={(v) => update('digital_payment_usage', v)}
                options={[
                  { value: 1, label: '1 — Cash only, no digital payments' },
                  { value: 3, label: '3 — Occasionally use UPI/card' },
                  { value: 5, label: '5 — Use digital for some payments' },
                  { value: 7, label: '7 — Mostly digital payments' },
                  { value: 9, label: '9 — Almost entirely digital' },
                  { value: 10, label: '10 — Fully digital, no cash' },
                ]}
                helper="How much do you use UPI, mobile banking, or digital wallets?"
                error={errors.digital_payment_usage}
              />
              <SelectField
                label="Cashflow Consistency"
                name="cashflow_consistency"
                value={form.cashflow_consistency}
                onChange={(v) => update('cashflow_consistency', v)}
                options={CONSISTENCY_OPTIONS}
                helper="How consistent is your month-to-month income and expense pattern?"
                error={errors.cashflow_consistency}
              />
            </div>
          )}

          {/* Section 4 */}
          {section === 4 && (
            <div className="space-y-8">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/8 border border-blue-500/20 mb-2">
                <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300/80">
                  These alternate signals help SCORIFY assess creditworthiness for gig workers and those
                  with non-traditional income. If a field doesn&apos;t apply, select the middle option (5).
                </p>
              </div>

              <SelectField
                label="Gig Income Consistency"
                name="gig_income_consistency"
                value={form.gig_income_consistency}
                onChange={(v) => update('gig_income_consistency', v)}
                options={[
                  { value: 1, label: '1 — Not applicable / No gig income' },
                  { value: 2, label: '2 — Very irregular gig income' },
                  { value: 4, label: '4 — Somewhat inconsistent' },
                  { value: 5, label: '5 — Moderate consistency' },
                  { value: 7, label: '7 — Mostly consistent gig work' },
                  { value: 9, label: '9 — Very consistent gig income' },
                  { value: 10, label: '10 — Highly stable, primary income source' },
                ]}
                helper="How consistent is your income from freelance, gig, or platform work?"
                error={errors.gig_income_consistency}
              />
              <SelectField
                label="Microfinance Repayment Consistency"
                name="microfinance_repayment_consistency"
                value={form.microfinance_repayment_consistency}
                onChange={(v) => update('microfinance_repayment_consistency', v)}
                options={[
                  { value: 1, label: '1 — Not applicable / No microfinance history' },
                  { value: 2, label: '2 — Very irregular repayments' },
                  { value: 4, label: '4 — Occasional missed payments' },
                  { value: 5, label: '5 — Moderate repayment consistency' },
                  { value: 7, label: '7 — Mostly on-time' },
                  { value: 9, label: '9 — Very consistent' },
                  { value: 10, label: '10 — Always on time, perfect repayment' },
                ]}
                helper="How consistently do you repay microfinance or SHG loans? Select 1 if not applicable."
                error={errors.microfinance_repayment_consistency}
              />

              {/* Review summary */}
              <div className="pt-4 border-t border-white/[0.07]">
                <p className="text-xs text-white/40 mb-4 font-medium">Quick Review</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="text-white/40">Monthly Income</span>
                    <span className="text-white/70 font-medium">₹{form.monthly_income.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="text-white/40">Bill Payment</span>
                    <span className="text-white/70 font-medium">{Math.round(form.bill_payment_ratio * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="text-white/40">Savings Ratio</span>
                    <span className="text-white/70 font-medium">{Math.round(form.savings_ratio * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2">
                    <span className="text-white/40">Payment Delay</span>
                    <span className="text-white/70 font-medium">{form.payment_delay_days} days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.07]">
            <button
              onClick={() => setSection((s) => Math.max(s - 1, 1) as 1 | 2 | 3 | 4)}
              disabled={section === 1}
              className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {section < 4 ? (
              <button onClick={handleNext} className="btn-primary">
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary px-8 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze My Creditworthiness
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-white/20 text-center mt-6">
          Demo mode — no real data is stored or shared. Scores are for demonstration purposes only.
        </p>
      </div>
    </div>
  )
}
