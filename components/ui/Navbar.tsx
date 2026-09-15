'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'

const navLinks = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#signals', label: 'Data Signals' },
  { href: '/#responsible-ai', label: 'Responsible AI' },
]

export function Navbar() {
  const pathname = usePathname()
  const isAssessment = pathname?.startsWith('/assessment')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#080d1a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <BarChart3 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg">SCORIFY</span>
        </Link>

        {/* Nav links — hidden on small screens */}
        <nav className="hidden md:flex items-center gap-8">
          {!isAssessment && navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className={cn(
              'btn-primary text-sm py-2 px-5',
              isAssessment && 'opacity-50 pointer-events-none'
            )}
          >
            Check Creditworthiness
          </Link>
        </div>
      </div>
    </header>
  )
}
