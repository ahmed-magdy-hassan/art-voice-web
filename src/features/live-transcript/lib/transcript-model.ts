import type { InferenceFrame } from '@/shared/api/contracts/realtime'

// KAN-286 — reconcile the InferenceFrame stream into a renderable transcript.
//
// ai-realtime emits, per speaker turn, a series of partials (each carries the
// full text-so-far for that turn) and exactly one final. We therefore keep:
//   - committed[]  : finalized turns (rendered normal weight)
//   - live         : the newest partial for the in-progress turn (italic)
// Out-of-order frames are reconciled by seq: a frame whose seq is <= the
// last applied seq for its turn is ignored (UC-19.26 alt-flow 1a). A turn is
// keyed by speakerId; a final flushes the live turn into committed[].

export interface TranscriptTurn {
  speakerId: string
  text: string
  final: boolean
}

export interface TranscriptState {
  committed: TranscriptTurn[]
  live: TranscriptTurn | null
}

export function emptyTranscript(): TranscriptState {
  return { committed: [], live: null }
}

interface Internal extends TranscriptState {
  _liveSeq: number
}

export function createTranscriptReducer() {
  const state: Internal = { committed: [], live: null, _liveSeq: -1 }

  function apply(frame: InferenceFrame): TranscriptState {
    if (frame.isFinal) {
      const text = frame.partialTranscript.trim() || state.live?.text || ''
      if (text) {
        state.committed = [
          ...state.committed,
          { speakerId: frame.speakerId, text, final: true },
        ]
      }
      state.live = null
      state._liveSeq = -1
      return snapshot()
    }

    // Stale/out-of-order partial for the current turn — ignore.
    if (frame.seq <= state._liveSeq) return snapshot()

    state._liveSeq = frame.seq
    const text = frame.partialTranscript
    state.live = text
      ? { speakerId: frame.speakerId, text, final: false }
      : state.live
    return snapshot()
  }

  function snapshot(): TranscriptState {
    return {
      committed: state.committed,
      live: state.live,
    }
  }

  return { apply, snapshot }
}

// Stable color per speaker id (UC-19.26: speaker label color-coded).
const SPEAKER_PALETTE = [
  '#2563eb',
  '#16a34a',
  '#db2777',
  '#d97706',
  '#7c3aed',
  '#0891b2',
]

export function speakerColor(speakerId: string): string {
  let h = 0
  for (let i = 0; i < speakerId.length; i++) {
    h = (h * 31 + speakerId.charCodeAt(i)) >>> 0
  }
  return SPEAKER_PALETTE[h % SPEAKER_PALETTE.length] as string
}

export function speakerLabel(speakerId: string): string {
  // "spk_0" → "Speaker 1"
  const m = /(\d+)$/.exec(speakerId)
  return m ? `Speaker ${Number(m[1]) + 1}` : speakerId
}
