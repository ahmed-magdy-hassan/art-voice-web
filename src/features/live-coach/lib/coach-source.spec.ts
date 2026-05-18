import { describe, expect, it } from 'vitest'
import { HeuristicCoachSource } from './coach-source'

function frame(text: string, extra: Partial<{ arousal: number; final: boolean }> = {}) {
  return {
    sessionId: 's',
    seq: 0,
    partialTranscript: text,
    speakerId: 'spk_0',
    isFinal: extra.final ?? false,
    emotion:
      extra.arousal === undefined
        ? undefined
        : { label: 'neutral', valence: 0, arousal: extra.arousal, dominance: 0, confidence: 1 },
  }
}

describe('HeuristicCoachSource', () => {
  it('flags a filler word in newly added speech', () => {
    let t = 1000
    const src = new HeuristicCoachSource(() => t)
    src.observe(frame('so'))
    t += 500
    const s = src.observe(frame('so um the plan'))
    expect(s?.kind).toBe('filler')
    expect(s?.text).toContain('um')
  })

  it('cools down: first filler fires, repeats within the window are suppressed', () => {
    let t = 1000
    const src = new HeuristicCoachSource(() => t)
    t += 500
    expect(src.observe(frame('so um the plan'))?.kind).toBe('filler')
    t += 300
    expect(src.observe(frame('so um the plan um again'))).toBeNull()
    // After the cooldown elapses, a new filler tip is allowed again.
    t += 13_000
    expect(src.observe(frame('so um the plan um again uh more'))?.kind).toBe(
      'filler',
    )
  })

  it('flags fast pace after enough elapsed speech', () => {
    let t = 0
    const src = new HeuristicCoachSource(() => t)
    src.observe(frame('one')) // firstSeenAt = 0
    t = 9000 // 9s elapsed
    // ~40 words in 9s ≈ 4.4 wps > 3.0
    const many = Array.from({ length: 40 }, (_, i) => `w${i}`).join(' ')
    const s = src.observe(frame(many))
    expect(s?.kind).toBe('pace')
  })

  it('flags low energy (monotone) with sustained low arousal', () => {
    let t = 0
    const src = new HeuristicCoachSource(() => t)
    src.observe(frame('start', { arousal: 0.1 }))
    t = 11000
    const s = src.observe(frame('start and more words here', { arousal: 0.1 }))
    expect(s?.kind).toBe('energy')
  })

  it('returns null when nothing notable and reports healthy', () => {
    const src = new HeuristicCoachSource(() => 0)
    expect(src.observe(frame('a clean sentence'))).toBeNull()
    expect(src.healthy).toBe(true)
  })
})
