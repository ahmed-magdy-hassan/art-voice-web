import { apiFetch } from '@/shared/api/client'
import { CreateSampleResponse } from '@/shared/api/contracts/profile'

export type RecordState = 'idle' | 'requesting' | 'recording' | 'uploading' | 'done' | 'error'

export interface RecordAudioResult {
  state: Ref<RecordState>
  levelDb: Ref<number>          // current RMS dB, 0 = silence, –60 = floor
  durationSec: Ref<number>
  errorMessage: Ref<string>
  start: () => Promise<void>
  stop: () => Promise<void>
}

const DB_FLOOR = -60
const DB_CEIL = 0

function rmsToDb(rms: number): number {
  if (rms <= 0) return DB_FLOOR
  return Math.max(DB_FLOOR, Math.min(DB_CEIL, 20 * Math.log10(rms)))
}

export function useRecordAudio(label?: string): RecordAudioResult {
  const state = ref<RecordState>('idle')
  const levelDb = ref<number>(DB_FLOOR)
  const durationSec = ref(0)
  const errorMessage = ref('')

  let stream: MediaStream | null = null
  let ctx: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let recorder: MediaRecorder | null = null
  let rafId = 0
  let timerInterval: ReturnType<typeof setInterval> | null = null
  const chunks: Blob[] = []

  function startMeter() {
    if (!analyser) return
    const buf = new Float32Array(analyser.fftSize)
    function tick() {
      analyser!.getFloatTimeDomainData(buf)
      let sum = 0
      for (let i = 0; i < buf.length; i++) { const v = buf[i] ?? 0; sum += v * v }
      levelDb.value = rmsToDb(Math.sqrt(sum / buf.length))
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
  }

  function stopMeter() {
    cancelAnimationFrame(rafId)
    levelDb.value = DB_FLOOR
  }

  async function start() {
    if (state.value !== 'idle' && state.value !== 'error') return
    state.value = 'requesting'
    errorMessage.value = ''
    chunks.length = 0
    durationSec.value = 0

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
      })
    } catch (err) {
      state.value = 'error'
      errorMessage.value = (err as Error).message ?? 'Microphone access denied'
      return
    }

    ctx = new AudioContext()
    analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    const src = ctx.createMediaStreamSource(stream)
    src.connect(analyser)
    // Silence playback — AnalyserNode is a dead-end in the graph.

    recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }

    recorder.start(200) // collect in 200ms chunks
    state.value = 'recording'
    startMeter()
    timerInterval = setInterval(() => { durationSec.value += 1 }, 1000)
  }

  async function stop() {
    if (state.value !== 'recording') return

    stopMeter()
    if (timerInterval) clearInterval(timerInterval)

    await new Promise<void>((resolve) => {
      if (!recorder) { resolve(); return }
      recorder.onstop = () => resolve()
      recorder.stop()
    })

    stream?.getTracks().forEach((t) => t.stop())
    await ctx?.close()
    ctx = null; analyser = null; recorder = null; stream = null

    state.value = 'uploading'

    try {
      const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
      // Step 1: get presigned upload URL
      const slot = await apiFetch('/api/dashboard/profile/samples', {
        method: 'POST',
        body: {
          label: label ?? `Recording ${new Date().toISOString()}`,
          mimeType: 'audio/webm',
          fileSizeBytes: blob.size,
        },
        schema: CreateSampleResponse,
      })
      // Step 2: PUT blob directly to the presigned URL (no auth header — it's pre-signed)
      await $fetch(slot.uploadUrl, { method: 'PUT', body: blob, headers: { 'Content-Type': 'audio/webm' } })
      state.value = 'done'
    } catch (err) {
      state.value = 'error'
      errorMessage.value = (err as Error).message ?? 'Upload failed'
    }
  }

  return { state, levelDb, durationSec, errorMessage, start, stop }
}
