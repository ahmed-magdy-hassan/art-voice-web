// Wire frame for the svc-realtime WS (KAN-285): [codec:uint8][seq:uint32 LE]
// [payload]. Mirrors svc-realtime AudioCodec. The browser path is PCM16
// (AudioWorklet capture); Opus (0) is the SDK path.
export const AUDIO_CODEC = { opus: 0, pcm16: 1 } as const

const HEADER_BYTES = 5

export function encodeFrame(
  codec: number,
  seq: number,
  payload: Uint8Array,
): Uint8Array {
  const out = new Uint8Array(HEADER_BYTES + payload.byteLength)
  const view = new DataView(out.buffer)
  view.setUint8(0, codec)
  view.setUint32(1, seq >>> 0, true) // little-endian, matches readUInt32LE
  out.set(payload, HEADER_BYTES)
  return out
}

// Float32 [-1,1] samples → 16-bit signed LE PCM (svc-realtime PCM16 path).
export function floatTo16BitPcm(samples: Float32Array): Uint8Array {
  const out = new Uint8Array(samples.length * 2)
  const view = new DataView(out.buffer)
  for (let i = 0; i < samples.length; i++) {
    let s = samples[i] ?? 0
    s = s < -1 ? -1 : s > 1 ? 1 : s
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return out
}
