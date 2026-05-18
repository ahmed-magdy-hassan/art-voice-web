// Mic → 16kHz mono → 20ms PCM16 frames (KAN-285).
//
// AudioContext output rate varies by device (often 48kHz), so the worklet
// downsamples to 16kHz and emits fixed 320-sample (20ms) chunks — the frame
// size svc-realtime / the ASR rolling buffer expect. The processor is
// inlined as a blob so there's no separate static asset to wire through
// Nuxt/Nitro.

const WORKLET_SOURCE = `
class PcmFramer extends AudioWorkletProcessor {
  constructor (options) {
    super()
    this._target = 16000
    this._frame = 320            // 20ms @ 16kHz
    this._ratio = sampleRate / this._target
    this._buf = []
    this._pos = 0
  }
  process (inputs) {
    const ch = inputs[0] && inputs[0][0]
    if (!ch) return true
    // Linear-interpolation downsample to 16kHz.
    for (let i = 0; i < ch.length; i += this._ratio) {
      const idx = Math.floor(i + this._pos)
      if (idx < ch.length) this._buf.push(ch[idx])
    }
    this._pos = 0
    while (this._buf.length >= this._frame) {
      const chunk = this._buf.splice(0, this._frame)
      this.port.postMessage(Float32Array.from(chunk))
    }
    return true
  }
}
registerProcessor('pcm-framer', PcmFramer)
`

export interface AudioCapture {
  stop: () => void
}

export async function startAudioCapture(
  onFrame: (samples: Float32Array) => void,
): Promise<AudioCapture> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
    },
  })
  const ctx = new AudioContext()
  const blobUrl = URL.createObjectURL(
    new Blob([WORKLET_SOURCE], { type: 'application/javascript' }),
  )
  await ctx.audioWorklet.addModule(blobUrl)
  URL.revokeObjectURL(blobUrl)

  const source = ctx.createMediaStreamSource(stream)
  const node = new AudioWorkletNode(ctx, 'pcm-framer')
  node.port.onmessage = (e: MessageEvent<Float32Array>) => onFrame(e.data)
  source.connect(node)
  // Worklet must be in the graph to run; route to a muted gain so nothing
  // is played back (no echo of the user's own mic).
  const sink = ctx.createGain()
  sink.gain.value = 0
  node.connect(sink).connect(ctx.destination)

  return {
    stop: () => {
      node.port.onmessage = null
      source.disconnect()
      node.disconnect()
      sink.disconnect()
      stream.getTracks().forEach((t) => t.stop())
      void ctx.close()
    },
  }
}
