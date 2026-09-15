import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Zap,
  BarChart2,
  Activity,
  Smartphone,
  Banknote,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080d1a] via-[#0d1240] to-[#080d1a]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Hackathon MVP — Explainable AI Credit Intelligence
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 text-balance">
            Creditworthiness{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-violet-400 bg-clip-text text-transparent">
              Beyond
            </span>
            <br />
            Credit History
          </h1>

          <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-4 text-balance">
            AI-powered alternate credit intelligence for people beyond traditional credit history.
          </p>
          <p className="text-sm text-white/35 max-w-xl mx-auto mb-12 italic">
            &ldquo;No Credit History &ne; No Creditworthiness.&rdquo;
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="btn-primary text-base px-8 py-4 gap-2.5">
              Check Your Creditworthiness
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
              How It Works
            </a>
          </div>

          {/* Social proof strip */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-white/30 text-xs font-medium uppercase tracking-wider">
            <span>Alternate Data</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Explainable AI</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>What-If Simulator</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Responsible AI</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Privacy-Aware</span>
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4">The Problem</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Millions are invisible to traditional credit systems
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-6">
                Over 190 million adults in India lack formal credit history. Traditional CIBIL scores
                rely on past credit behaviour — but what about gig workers, first-time borrowers,
                and people who&apos;ve never had a credit card?
              </p>
              <p className="text-white/55 text-base leading-relaxed">
                Their financial behaviour is real. Their creditworthiness exists. The data just
                needs a different lens.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '190M+', label: 'Adults with no credit history in India', icon: Users },
                { value: '40%', label: 'Of workforce in gig/informal economy', icon: Activity },
                { value: '₹0', label: 'Credit access for underserved segments', icon: Banknote },
                { value: '1 in 3', label: 'Loan applications rejected due to thin files', icon: AlertCircle },
              ].map(({ value, label, icon: Icon }) => (
                <div key={value} className="card p-5">
                  <Icon size={18} className="text-blue-400 mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{value}</div>
                  <div className="text-xs text-white/45 leading-relaxed">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-label mb-4">How SCORIFY Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              From behaviour to intelligence — in minutes
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              SCORIFY uses alternate financial signals to build a complete picture of creditworthiness.
            </p>
          </div>

          {/* 3-step flow */}
          <div className="relative grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Activity,
                title: 'Financial Behaviour Assessment',
                desc: 'Answer questions about your income, spending, payments, and digital transaction patterns. No sensitive data. No bank login required.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10 border-blue-500/20',
              },
              {
                step: '02',
                icon: Brain,
                title: 'AI Analysis',
                desc: 'Our model analyses 14 alternate financial signals to compute your credit intelligence score — with no CIBIL history required.',
                color: 'text-violet-400',
                bg: 'bg-violet-500/10 border-violet-500/20',
              },
              {
                step: '03',
                icon: BarChart2,
                title: 'Explainable Credit Intelligence',
                desc: 'Get your score, understand exactly why, and simulate how specific behaviour changes could improve your creditworthiness.',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/20',
              },
            ].map(({ step, icon: Icon, title, desc, color, bg }, idx) => (
              <div key={step} className="relative">
                <div className={`card p-8 h-full border ${bg}`}>
                  <div className={`text-5xl font-bold ${color} opacity-20 mb-4 font-mono`}>{step}</div>
                  <Icon size={28} className={`${color} mb-4`} />
                  <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 -translate-y-1/2">
                    <ChevronRight size={20} className="text-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/assessment" className="btn-primary">
              Start Your Assessment
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Data Signals ─────────────────────────────────── */}
      <section id="signals" className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-4">Alternate Data Signals</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your behaviour tells a richer story
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              We evaluate 14 behavioral and financial signals — not just a credit score from the past.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[
              { icon: Banknote,    label: 'Income Stability',              desc: 'How consistent is your income?' },
              { icon: TrendingUp,  label: 'Savings Behaviour',             desc: 'What fraction of income is saved?' },
              { icon: CheckCircle2,label: 'Bill Payment Ratio',            desc: 'How often are bills paid on time?' },
              { icon: RefreshCw,   label: 'Utility Payment Consistency',   desc: 'Regularity of utility payments' },
              { icon: Smartphone,  label: 'Recharge Regularity',           desc: 'Mobile recharge patterns' },
              { icon: Activity,    label: 'Transaction Frequency',          desc: 'Digital transaction volume' },
              { icon: Zap,         label: 'Cashflow Consistency',           desc: 'Month-to-month cashflow stability' },
              { icon: AlertCircle, label: 'Payment Delay Days',            desc: 'Average days of payment delay' },
              { icon: Users,       label: 'Gig Income Consistency',         desc: 'Reliability of gig income' },
              { icon: ShieldCheck, label: 'Microfinance Repayment',         desc: 'Microfinance loan repayment history' },
              { icon: BarChart2,   label: 'Digital Payment Usage',          desc: 'Adoption of digital payments' },
              { icon: Banknote,    label: 'Rent Payment Consistency',       desc: 'Regularity of rent payments' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card-hover p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={14} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/85">{label}</div>
                  <div className="text-xs text-white/35 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiators ──────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-4">What Makes SCORIFY Different</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Score. Explain. Improve.
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              &ldquo;Your score. Your reasons. Your next move.&rdquo;
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Brain,
                title: 'Explainable AI',
                desc: 'We don\'t just give you a number. Every score comes with feature-level explanations (SHAP-style) showing exactly which behaviours helped or hurt your score.',
                badge: 'Core Differentiator',
              },
              {
                icon: RefreshCw,
                title: 'What-If Credit Simulator',
                desc: 'Simulate how reducing spending, improving bill payments, or eliminating delays would change your score. Actionable, not just informational.',
                badge: 'Unique Feature',
              },
              {
                icon: ShieldCheck,
                title: 'Responsible AI',
                desc: 'No demographic data. No protected attributes. Transparent scoring criteria. AI as decision support — not automatic approval or rejection.',
                badge: 'Privacy-First',
              },
              {
                icon: Activity,
                title: 'Alternate Data Intelligence',
                desc: 'Built specifically for gig workers, first-time borrowers, and informal economy workers with zero traditional credit history.',
                badge: 'Inclusive',
              },
            ].map(({ icon: Icon, title, desc, badge }) => (
              <div key={title} className="card p-8">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Icon size={20} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-blue-300/70 border border-blue-400/20 rounded-full px-2.5 py-1">
                    {badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Responsible AI ───────────────────────────────── */}
      <section id="responsible-ai" className="py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-4">Responsible AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transparency is not optional
            </h2>
            <p className="text-white/50 text-base max-w-lg mx-auto">
              SCORIFY is built with fairness, transparency, and human oversight at its core.
            </p>
          </div>

          <div className="card p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: 'No Demographic Attributes',
                  desc: 'Gender, caste, religion, age, and region are not used as predictive features. Scoring is purely behaviour-based.',
                },
                {
                  icon: Brain,
                  title: 'Explainable by Design',
                  desc: 'Every score comes with SHAP-style explanations so the applicant understands exactly what drove their result.',
                },
                {
                  icon: Users,
                  title: 'Human Review for High-Impact Decisions',
                  desc: 'AI output is decision support, not an automatic approval or rejection. Human oversight applies at loan decisions.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Privacy-Aware',
                  desc: 'No bank login required. No unnecessary PII collected. Synthetic and demo data used during hackathon phase.',
                },
                {
                  icon: Activity,
                  title: 'Clearly Labelled Demo Mode',
                  desc: 'During this MVP phase, all scores are clearly marked as demo/mock. Real ML integration is Phase 2.',
                },
                {
                  icon: CheckCircle2,
                  title: 'Not a Lending Decision',
                  desc: 'SCORIFY is a credit intelligence tool — not a lender. Scores are indicative only and not financial advice.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/85 mb-1">{title}</div>
                    <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            Ready to understand your financial behaviour?
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-xl mx-auto">
            Complete the assessment in under 3 minutes. Get your AI credit intelligence score, see why, and discover what you can improve.
          </p>
          <Link href="/assessment" className="btn-primary text-base px-8 py-4">
            Check Your Creditworthiness
            <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-white/25 mt-4">
            Demo mode — no real data stored. All scores are for demonstration purposes only.
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <BarChart2 size={14} className="text-white" />
              </div>
              <span className="font-bold text-white">SCORIFY</span>
            </div>
            <p className="text-white/30 text-xs text-center">
              Hackathon MVP — Explainable AI Alternate Credit Scoring.<br />
              Scores are for demonstration purposes only. Not financial advice.
            </p>
            <div className="flex gap-6">
              <a href="#how-it-works" className="text-xs text-white/30 hover:text-white/60 transition-colors">How It Works</a>
              <a href="#responsible-ai" className="text-xs text-white/30 hover:text-white/60 transition-colors">Responsible AI</a>
              <Link href="/assessment" className="text-xs text-white/30 hover:text-white/60 transition-colors">Assessment</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
