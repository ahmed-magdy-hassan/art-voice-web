import { ref, shallowRef } from 'vue'
import { apiFetch } from '@/shared/api/client'
import {
  InferenceFrame,
  LiveSessionResponse,
} from '@/shared/api/contracts/realtime'
import {
  startAudioCapture,
  type AudioCapture,
} from '../lib/audio-capture'
import { AUDIO_CODEC, encodeFrame, floatTo16BitPcm } from '../lib/frame'

export type LiveStatus =
  | 'idle'
  | 'connecting'
  | 'live'
  | 'ending'
  | 'ended'
  | 'error'

/**
 * KAN-285 — Live Analysis session lifecycle (WSS Opus/PCM path; the
 * WebRTC SFU path is KAN-100). Owns: BFF session open → mic capture →
 * PCM16 frames over the gateway WSS → inference frames back. Recording is
 * gated by explicit consent (UC-19.25 business rule); when consent is off
 * we still transcribe live but tell the server not to persist audio.
 */
export function useLiveSession() {
  const status = ref<LiveStatus>('idle')
  const error = ref<string | null>(null)
  const consentToRecord = ref(false)
  // The newest inference frame; KAN-286 consumes the stream of these.
  const lastFrame = shallowRef<InferenceFrame | null>(null)
  const frames = shallowRef<InferenceFrame[]>([])

  let ws: WebSocket | null = null
  let capture: AudioCapture | null = null
  let seq = 0

  async function start(): Promise<void> {
    if (status.value === 'live' || status.value === 'connecting') return
    error.value = null
    status.value = 'connecting'
    try {
      const session = await apiFetch<LiveSessionResponse>(
        '/api/realtime/sessions',
        { method: 'POST', schema: LiveSessionResponse },
      )

      const url =
        `${session.wsUrl}?session=${encodeURIComponent(session.sessionId)}` +
        `&access_token=${encodeURIComponent(session.realtimeToken)}` +
        `&record=${consentToRecord.value ? '1' : '0'}`
      ws = new WebSocket(url)
      ws.binaryType = 'arraybuffer'

      ws.onopen = async () => {
        try {
          capture = await startAudioCapture((samples) => {
            if (ws?.readyState !== WebSocket.OPEN) return
            const pcm = floatTo16BitPcm(samples)
            ws.send(encodeFrame(AUDIO_CODEC.pcm16, seq++, pcm))
          })
          status.value = 'live'
        } catch (e) {
          fail((e as Error).message || 'microphone unavailable')
        }
      }
      ws.onmessage = (ev) => {
        if (typeof ev.data !== 'string') return
        const parsed = InferenceFrame.safeParse(JSON.parse(ev.data))
        if (!parsed.success) return
        lastFrame.value = parsed.data
        frames.value = [...frames.value, parsed.data]
      }
      ws.onerror = () => fail('connection error')
      ws.onclose = () => {
        if (status.value !== 'error') status.value = 'ended'
        teardownAudio()
      }
    } catch (e) {
      fail((e as Error).message || 'could not open session')
    }
  }

  function stop(): void {
    if (!ws) return
    status.value = 'ending'
    // Tell svc-realtime to flush + finalize, then close.
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'eos' }))
    }
    teardownAudio()
  }

  function teardownAudio(): void {
    capture?.stop()
    capture = null
  }

  function fail(msg: string): void {
    error.value = msg
    status.value = 'error'
    teardownAudio()
    ws?.close()
  }

  return {
    status,
    error,
    consentToRecord,
    lastFrame,
    frames,
    start,
    stop,
  }
}
