import { describe, it, expect } from 'vitest'
import { AnalysisDetail } from './analysis-detail'

const minimal = {
  id: 'a-1',
  title: 'Discovery call',
  createdAt: '2026-05-14T08:00:00Z',
  durationSeconds: 600,
  signedAudioUrl: 'https://s3.example.com/object?sig=abc',
  signedAudioExpiresAt: '2026-05-14T08:15:00Z',
}

describe('AnalysisDetail contract', () => {
  it('accepts a minimal record and defaults the array fields to empty', () => {
    const parsed = AnalysisDetail.parse(minimal)
    expect(parsed.transcript).toEqual([])
    expect(parsed.emotionTimeline).toEqual([])
    expect(parsed.speechMetrics).toEqual([])
    expect(parsed.diarization).toEqual([])
    expect(parsed.annotations).toEqual([])
  })

  it('rejects a non-URL signed audio URL', () => {
    expect(
      AnalysisDetail.safeParse({ ...minimal, signedAudioUrl: 'not-a-url' }).success,
    ).toBe(false)
  })

  it('clamps emotion frame scores to [0, 1]', () => {
    const bad = AnalysisDetail.safeParse({
      ...minimal,
      emotionTimeline: [{ t: 0, label: 'joy', score: 1.5 }],
    })
    expect(bad.success).toBe(false)
  })
})
