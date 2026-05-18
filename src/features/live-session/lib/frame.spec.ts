import { describe, expect, it } from 'vitest'
import { AUDIO_CODEC, encodeFrame, floatTo16BitPcm } from './frame'

describe('encodeFrame', () => {
  it('lays out [codec][seq LE][payload]', () => {
    const f = encodeFrame(AUDIO_CODEC.pcm16, 0x01020304, new Uint8Array([9, 9]))
    expect(f[0]).toBe(AUDIO_CODEC.pcm16)
    // 0x01020304 little-endian = 04 03 02 01
    expect([f[1], f[2], f[3], f[4]]).toEqual([0x04, 0x03, 0x02, 0x01])
    expect([f[5], f[6]]).toEqual([9, 9])
    expect(f.byteLength).toBe(7)
  })

  it('matches Node Buffer.readUInt32LE at offset 1', () => {
    const f = encodeFrame(0, 42, new Uint8Array(0))
    const view = new DataView(f.buffer)
    expect(view.getUint32(1, true)).toBe(42)
  })
})

describe('floatTo16BitPcm', () => {
  it('encodes silence as zero bytes', () => {
    const pcm = floatTo16BitPcm(new Float32Array([0, 0]))
    expect([...pcm]).toEqual([0, 0, 0, 0])
  })

  it('clamps out-of-range samples', () => {
    const pcm = floatTo16BitPcm(new Float32Array([2, -2]))
    const view = new DataView(pcm.buffer)
    expect(view.getInt16(0, true)).toBe(0x7fff)
    expect(view.getInt16(2, true)).toBe(-0x8000)
  })

  it('produces 2 bytes per sample', () => {
    expect(floatTo16BitPcm(new Float32Array(320)).byteLength).toBe(640)
  })
})
