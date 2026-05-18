import { describe, it, expect } from 'vitest'
import { DEFAULT_FILTERS, withFilter, clampScoreRange } from './filters'

describe('analyses-list filters', () => {
  it('exposes the UC-19.15 default page size + sort', () => {
    expect(DEFAULT_FILTERS.limit).toBe(50)
    expect(DEFAULT_FILTERS.sort).toBe('date_desc')
  })

  it('drops the cursor whenever a filter changes', () => {
    const start = { ...DEFAULT_FILTERS, cursor: 'abc' }
    const next = withFilter(start, 'type', 'call')
    expect(next.cursor).toBeUndefined()
    expect(next.type).toBe('call')
  })

  it('removes a filter when set to undefined or empty string', () => {
    const start = { ...DEFAULT_FILTERS, type: 'call' as const }
    const next = withFilter(start, 'type', undefined)
    expect('type' in next).toBe(false)
  })

  it('clampScoreRange swaps min/max if reversed', () => {
    expect(clampScoreRange(80, 20)).toEqual([20, 80])
    expect(clampScoreRange(20, 80)).toEqual([20, 80])
    expect(clampScoreRange(undefined, 80)).toEqual([undefined, 80])
  })
})
