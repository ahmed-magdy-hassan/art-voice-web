import type { DashboardCard } from '@/shared/api/contracts/dashboard'

export function formatValue(card: DashboardCard): string {
  if (card.unit === '/100') return `${Math.round(card.value)}`
  if (card.unit === 'min') {
    if (card.value >= 60) {
      const h = Math.floor(card.value / 60)
      const m = card.value % 60
      return m === 0 ? `${h}h` : `${h}h ${m}m`
    }
    return `${card.value} min`
  }
  if (card.unit === 'days') return card.value === 1 ? '1 day' : `${card.value} days`
  return String(card.value)
}

export function deltaLabel(card: DashboardCard): string | null {
  if (card.deltaPercent === undefined) return null
  const sign = card.deltaPercent > 0 ? '+' : ''
  return `${sign}${card.deltaPercent.toFixed(1)}%`
}

export function deltaTone(card: DashboardCard): 'pos' | 'neg' | 'flat' {
  if (card.deltaPercent === undefined || card.deltaPercent === 0) return 'flat'
  return card.deltaPercent > 0 ? 'pos' : 'neg'
}
