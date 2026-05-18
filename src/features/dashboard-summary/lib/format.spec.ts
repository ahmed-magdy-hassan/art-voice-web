import { describe, it, expect } from 'vitest'
import { formatValue, deltaLabel, deltaTone } from './format'
import type { DashboardCard } from '@/shared/api/contracts/dashboard'

const card = (over: Partial<DashboardCard>): DashboardCard => ({
  key: 'score',
  label: 'Overall score',
  value: 0,
  trend: [],
  ...over,
})

describe('formatValue', () => {
  it('rounds /100 scores', () => {
    expect(formatValue(card({ unit: '/100', value: 83.6 }))).toBe('84')
  })

  it('reformats long listening minutes to Xh Ym', () => {
    expect(formatValue(card({ unit: 'min', value: 320 }))).toBe('5h 20m')
    expect(formatValue(card({ unit: 'min', value: 60 }))).toBe('1h')
    expect(formatValue(card({ unit: 'min', value: 45 }))).toBe('45 min')
  })

  it('pluralises streak days', () => {
    expect(formatValue(card({ unit: 'days', value: 1 }))).toBe('1 day')
    expect(formatValue(card({ unit: 'days', value: 4 }))).toBe('4 days')
  })

  it('falls back to raw value for unknown units', () => {
    expect(formatValue(card({ value: 12 }))).toBe('12')
  })
})

describe('deltaLabel + deltaTone', () => {
  it('returns null when no delta is supplied', () => {
    expect(deltaLabel(card({}))).toBeNull()
    expect(deltaTone(card({}))).toBe('flat')
  })

  it('formats positive deltas with +', () => {
    expect(deltaLabel(card({ deltaPercent: 2.1 }))).toBe('+2.1%')
    expect(deltaTone(card({ deltaPercent: 2.1 }))).toBe('pos')
  })

  it('flags zero delta as flat', () => {
    expect(deltaTone(card({ deltaPercent: 0 }))).toBe('flat')
  })

  it('marks negatives appropriately', () => {
    expect(deltaLabel(card({ deltaPercent: -3.0 }))).toBe('-3.0%')
    expect(deltaTone(card({ deltaPercent: -3.0 }))).toBe('neg')
  })
})
