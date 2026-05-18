import { describe, it, expect } from 'vitest'
import { DashboardSummary } from './dashboard'

const sample = {
  isNewUser: false,
  cards: [
    { key: 'score', label: 'Overall score', value: 84, unit: '/100', trend: [], deltaPercent: 2.1 },
    { key: 'analyses', label: 'Analyses', value: 12, trend: [] },
    { key: 'streak', label: 'Streak', value: 4, unit: 'days', trend: [] },
    { key: 'listening', label: 'Listening', value: 320, unit: 'min', trend: [] },
  ],
  generatedAt: '2026-05-14T08:00:00Z',
}

describe('DashboardSummary contract', () => {
  it('parses a valid 4-card summary', () => {
    expect(DashboardSummary.safeParse(sample).success).toBe(true)
  })

  it('refuses != 4 cards (UC-19.11 fixed card set)', () => {
    expect(
      DashboardSummary.safeParse({ ...sample, cards: sample.cards.slice(0, 3) }).success,
    ).toBe(false)
  })

  it('refuses unknown card keys', () => {
    const bad = {
      ...sample,
      cards: [...sample.cards.slice(0, 3), { ...sample.cards[3], key: 'mystery' }],
    }
    expect(DashboardSummary.safeParse(bad).success).toBe(false)
  })
})
