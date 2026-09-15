import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'SCORIFY — Creditworthiness Beyond Credit History',
  description:
    'AI-powered alternate credit intelligence for people beyond traditional credit history. Understand your financial behaviour, get your score, and know why.',
  keywords: ['credit score', 'alternate credit', 'financial inclusion', 'explainable AI', 'SHAP'],
  authors: [{ name: 'SCORIFY Team' }],
  openGraph: {
    title: 'SCORIFY — Creditworthiness Beyond Credit History',
    description: 'AI-powered alternate credit scoring for the underserved.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-[#080d1a] text-white antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
