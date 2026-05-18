import { describe, it, expect } from 'vitest'
import { AnalysisListQuery, AnalysisListResponse } from './analyses'

describe('AnalysisListQuery', () => {
  it('defaults limit to 50 (UC-19.15 business rule: default 50 rows)', () => {
    const p = AnalysisListQuery.parse({})
    expect(p.limit).toBe(50)
    expect(p.sort).toBe('date_desc')
  })

  it('rejects a limit greater than 200', () => {
    expect(AnalysisListQuery.safeParse({ limit: 201 }).success).toBe(false)
  })

  it('rejects an unknown sort key', () => {
    expect(AnalysisListQuery.safeParse({ sort: 'mystery' }).success).toBe(false)
  })

  it('coerces nothing — score range out of [0,100] is rejected', () => {
    expect(AnalysisListQuery.safeParse({ minScore: -1 }).success).toBe(false)
    expect(AnalysisListQuery.safeParse({ maxScore: 101 }).success).toBe(false)
  })
})

describe('AnalysisListResponse', () => {
  it('parses items + pagination cursor', () => {
    const sample = {
      items: [
        {
          id: '1',
          type: 'call' as const,
          title: 'First call',
          createdAt: '2026-05-14T08:00:00Z',
          durationSeconds: 600,
          score: 87,
        },
      ],
      nextCursor: 'opaque-cursor',
      total: 100,
    }
    expect(AnalysisListResponse.safeParse(sample).success).toBe(true)
  })

  it('allows nullable score (pending analyses)', () => {
    const sample = {
      items: [
        {
          id: '1',
          type: 'training' as const,
          title: 'Pending',
          createdAt: '2026-05-14T08:00:00Z',
          durationSeconds: 0,
          score: null,
        },
      ],
      nextCursor: null,
      total: 1,
    }
    expect(AnalysisListResponse.safeParse(sample).success).toBe(true)
  })
})
