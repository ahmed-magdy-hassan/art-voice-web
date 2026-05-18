import { describe, it, expect } from 'vitest'
import { shouldRefreshAudioUrl, annotationsBetween } from './audio-url'

describe('shouldRefreshAudioUrl', () => {
  const now = new Date('2026-05-14T08:00:00Z')

  it('returns true when expiry is in the past', () => {
    expect(shouldRefreshAudioUrl('2026-05-14T07:59:59Z', now)).toBe(true)
  })

  it('returns true when expiry is inside the staleBeforeMs window', () => {
    expect(shouldRefreshAudioUrl('2026-05-14T08:00:30Z', now)).toBe(true)
  })

  it('returns false when expiry is comfortably in the future', () => {
    expect(shouldRefreshAudioUrl('2026-05-14T08:30:00Z', now)).toBe(false)
  })

  it('returns true for unparseable ISO strings (fail-safe → refresh)', () => {
    expect(shouldRefreshAudioUrl('garbage', now)).toBe(true)
  })
})

describe('annotationsBetween', () => {
  const data = [
    { tStart: 0, tEnd: 5, label: 'a' },
    { tStart: 4, tEnd: 12, label: 'b' },
    { tStart: 12, tEnd: 20, label: 'c' },
  ]

  it('returns annotations that overlap the window', () => {
    expect(annotationsBetween(data, 3, 6).map((a) => a.label)).toEqual(['a', 'b'])
  })

  it('treats boundary touches as overlap', () => {
    expect(annotationsBetween(data, 12, 12).map((a) => a.label)).toEqual(['b', 'c'])
  })

  it('returns empty when the window misses everything', () => {
    expect(annotationsBetween(data, 100, 200)).toEqual([])
  })
})
