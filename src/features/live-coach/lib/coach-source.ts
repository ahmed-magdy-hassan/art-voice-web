import type { InferenceFrame } from '@/shared/api/contracts/realtime'

// KAN-287 — live coaching suggestions.
//
// The real source is the AI Coach WS channel (ai-coach service, not built
// yet). CoachSuggestionSource is the seam: a WS adapter implements the same
// interface when ai-coach lands; until then HeuristicCoachSource derives
// lightweight, in-session nudges from the transcript/emotion stream so the
// UX is demoable. Suggestions are advisory and must never block input
// (UC-19.27 business rule) — that is a UI concern, enforced in the card
// component.

export type CoachKind = 'pace' | 'filler' | 'energy' | 'pause'

export interface CoachSuggestion {
  id: string
  kind: CoachKind
  text: string
  /** ms the card should live before auto-dismissing (ephemeral). */
  ttlMs: number
}

export interface CoachSuggestionSource {
  /** Feed the latest inference frame; returns a suggestion to surface, or
   *  null. Implementations self-throttle so they don't spam. */
  observe(frame: InferenceFrame): CoachSuggestion | null
  /** Source health — UI falls back to "post-session feedback" when false
   *  (UC-19.27 alt-flow 2a). */
  readonly healthy: boolean
}

const FILLERS = [
  'um',
  'uh',
  'er',
  'like',
  'you know',
  'kind of',
  'sort of',
  'basically',
  'literally',
  'actually',
]

function wordCount(s: string): number {
  const t = s.trim()
  return t ? t.split(/\s+/).length : 0
}

/**
 * Stateless-per-tip heuristics over the running transcript. Each rule
 * self-throttles via a cooldown so a single long monologue yields the odd
 * nudge, not a wall of cards.
 */
export class HeuristicCoachSource implements CoachSuggestionSource {
  readonly healthy = true
  // -Infinity = "never fired", so the first suggestion of each kind is not
  // blocked by the cooldown (cooldown only throttles repeats).
  private lastByKind: Record<CoachKind, number> = {
    pace: -Infinity,
    filler: -Infinity,
    energy: -Infinity,
    pause: -Infinity,
  }
  private firstSeenAt = -1 // -1 = not yet seen (0 is a valid timestamp)
  private lastText = ''
  private now: () => number

  // cooldown so the same kind of tip isn't repeated too often
  private readonly cooldownMs = 12_000

  constructor(now: () => number = () => Date.now()) {
    this.now = now
  }

  private fresh(kind: CoachKind): boolean {
    return this.now() - this.lastByKind[kind] >= this.cooldownMs
  }

  private mark(kind: CoachKind): void {
    this.lastByKind[kind] = this.now()
  }

  observe(frame: InferenceFrame): CoachSuggestion | null {
    const text = frame.partialTranscript ?? ''
    if (this.firstSeenAt < 0 && text) this.firstSeenAt = this.now()

    // Only evaluate on growth, so finals/echoes don't double-fire.
    if (text.length <= this.lastText.length && !frame.isFinal) return null
    const prev = this.lastText
    this.lastText = text

    // 1. Filler words — check the words newly added since the last frame.
    // Whole-word match only: "er" must not fire on "here"/"were".
    const added = text.slice(prev.length).toLowerCase()
    const addedWords = added.split(/[^a-z']+/).filter(Boolean)
    if (addedWords.length && this.fresh('filler')) {
      const phrase = addedWords.join(' ')
      const hit = FILLERS.find((f) =>
        f.includes(' ')
          ? phrase.includes(f) // multi-word filler ("you know")
          : addedWords.includes(f), // single word, exact
      )
      if (hit) {
        this.mark('filler')
        return {
          id: `filler-${this.now()}`,
          kind: 'filler',
          text: `Heard "${hit}" — try a brief pause instead of a filler.`,
          ttlMs: 7_000,
        }
      }
    }

    // 2. Pace — words per second since the turn started.
    const elapsedS = (this.now() - this.firstSeenAt) / 1000
    if (elapsedS > 8 && this.fresh('pace')) {
      const wps = wordCount(text) / elapsedS
      if (wps > 3.0) {
        this.mark('pace')
        return {
          id: `pace-${this.now()}`,
          kind: 'pace',
          text: 'You’re speaking quickly — slow down a touch for clarity.',
          ttlMs: 8_000,
        }
      }
    }

    // 3. Energy — sustained low arousal reads as monotone.
    if (frame.emotion && this.fresh('energy')) {
      if (frame.emotion.arousal < 0.2 && elapsedS > 10) {
        this.mark('energy')
        return {
          id: `energy-${this.now()}`,
          kind: 'energy',
          text: 'Vary your pitch and energy to keep the listener engaged.',
          ttlMs: 8_000,
        }
      }
    }

    return null
  }
}
