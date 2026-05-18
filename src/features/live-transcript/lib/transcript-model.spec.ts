import { describe, expect, it } from 'vitest'
import {
  createTranscriptReducer,
  speakerColor,
  speakerLabel,
} from './transcript-model'

function frame(p: Partial<{ seq: number; text: string; final: boolean; spk: string }>) {
  return {
    sessionId: 's',
    seq: p.seq ?? 0,
    partialTranscript: p.text ?? '',
    speakerId: p.spk ?? 'spk_0',
    isFinal: p.final ?? false,
  }
}

describe('transcript reducer', () => {
  it('shows the newest partial as the live turn', () => {
    const r = createTranscriptReducer()
    r.apply(frame({ seq: 1, text: 'the' }))
    const s = r.apply(frame({ seq: 2, text: 'the quick' }))
    expect(s.committed).toHaveLength(0)
    expect(s.live).toEqual({ speakerId: 'spk_0', text: 'the quick', final: false })
  })

  it('ignores out-of-order/stale partials by seq', () => {
    const r = createTranscriptReducer()
    r.apply(frame({ seq: 5, text: 'the quick brown' }))
    const s = r.apply(frame({ seq: 3, text: 'the' })) // stale
    expect(s.live?.text).toBe('the quick brown')
  })

  it('commits the turn on final and clears live', () => {
    const r = createTranscriptReducer()
    r.apply(frame({ seq: 1, text: 'the quick' }))
    const s = r.apply(frame({ seq: 2, text: 'the quick brown fox', final: true }))
    expect(s.live).toBeNull()
    expect(s.committed).toEqual([
      { speakerId: 'spk_0', text: 'the quick brown fox', final: true },
    ])
  })

  it('falls back to the last live text if the final frame is empty', () => {
    const r = createTranscriptReducer()
    r.apply(frame({ seq: 1, text: 'hello world' }))
    const s = r.apply(frame({ seq: 2, text: '', final: true }))
    expect(s.committed[0]?.text).toBe('hello world')
  })

  it('starts a fresh live turn after a final', () => {
    const r = createTranscriptReducer()
    r.apply(frame({ seq: 1, text: 'first turn', final: true }))
    const s = r.apply(frame({ seq: 1, text: 'second' }))
    expect(s.committed).toHaveLength(1)
    expect(s.live?.text).toBe('second')
  })
})

describe('speaker helpers', () => {
  it('color is stable per speaker', () => {
    expect(speakerColor('spk_0')).toBe(speakerColor('spk_0'))
  })
  it('different speakers can differ', () => {
    expect(speakerColor('spk_0')).not.toBe(speakerColor('spk_3'))
  })
  it('labels spk_0 as Speaker 1', () => {
    expect(speakerLabel('spk_0')).toBe('Speaker 1')
    expect(speakerLabel('spk_2')).toBe('Speaker 3')
  })
})
