import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RiskBand } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskColor(band: RiskBand): string {
  switch (band) {
    case 'LOW':      return 'text-emerald-400'
    case 'MEDIUM':   return 'text-amber-400'
    case 'HIGH':     return 'text-orange-400'
    case 'VERY_HIGH': return 'text-red-400'
  }
}

export function getRiskBgColor(band: RiskBand): string {
  switch (band) {
    case 'LOW':      return 'bg-emerald-400/10 border-emerald-400/30'
    case 'MEDIUM':   return 'bg-amber-400/10 border-amber-400/30'
    case 'HIGH':     return 'bg-orange-400/10 border-orange-400/30'
    case 'VERY_HIGH': return 'bg-red-400/10 border-red-400/30'
  }
}

export function getRiskLabel(band: RiskBand): string {
  switch (band) {
    case 'LOW':      return 'Low Risk'
    case 'MEDIUM':   return 'Medium Risk'
    case 'HIGH':     return 'High Risk'
    case 'VERY_HIGH': return 'Very High Risk'
  }
}

export function getScoreColor(score: number): string {
  if (score >= 70) return '#10b981' // emerald
  if (score >= 50) return '#f59e0b' // amber
  if (score >= 30) return '#f97316' // orange
  return '#ef4444'                  // red
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
