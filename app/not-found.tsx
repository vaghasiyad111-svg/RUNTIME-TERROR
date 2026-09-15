import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={28} className="text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">404</h1>
        <p className="text-white/50 text-base mb-8">
          This page doesn&apos;t exist. Return to SCORIFY.
        </p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
