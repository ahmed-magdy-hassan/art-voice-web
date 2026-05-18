import { describe, it, expect, vi } from 'vitest'
import {
  planParts,
  runChunkedUpload,
  type PartUploader,
} from './chunked-upload'
import type { InitUploadResponse } from '@/shared/api/contracts/uploads'

describe('planParts', () => {
  it('splits a file into N parts of partSize except the last (tail)', () => {
    const parts = planParts(2_500_000, 1_000_000)
    expect(parts).toHaveLength(3)
    expect(parts[0].size).toBe(1_000_000)
    expect(parts[2].size).toBe(500_000)
    expect(parts.map((p) => p.partNumber)).toEqual([1, 2, 3])
  })

  it('returns [] for a zero-size file', () => {
    expect(planParts(0, 1024)).toEqual([])
  })

  it('rejects non-positive partSize', () => {
    expect(() => planParts(100, 0)).toThrow()
  })
})

function fakeInit(parts: number, partSize = 100): InitUploadResponse {
  return {
    uploadId: 'u',
    audioId: 'a',
    partSize,
    parts: Array.from({ length: parts }, (_, i) => ({
      partNumber: i + 1,
      url: `https://s3.example/${i + 1}`,
      size: partSize,
    })),
  }
}

class FakeFile {
  constructor(public readonly size: number) {}
  slice() {
    return this as unknown as Blob
  }
}

describe('runChunkedUpload', () => {
  it('uploads every part and returns etags in part-number order', async () => {
    const uploader: PartUploader = {
      upload: vi.fn(async (part) => `"etag-${part.partNumber}"`),
    }
    const onProgress = vi.fn()
    const out = await runChunkedUpload({
      file: new FakeFile(300) as unknown as Blob & { name?: string },
      init: fakeInit(3),
      uploader,
      onProgress,
      delay: async () => undefined,
    })
    expect(out).toEqual([
      { partNumber: 1, etag: '"etag-1"' },
      { partNumber: 2, etag: '"etag-2"' },
      { partNumber: 3, etag: '"etag-3"' },
    ])
    expect(uploader.upload).toHaveBeenCalledTimes(3)
    // final progress should be 100% / done
    const last = onProgress.mock.calls.at(-1)![0]
    expect(last.percent).toBe(100)
    expect(last.status).toBe('done')
  })

  it('retries a transient failure within maxRetries (resume from last completed part)', async () => {
    let attempt = 0
    const uploader: PartUploader = {
      upload: vi.fn(async (part) => {
        if (part.partNumber === 2 && attempt++ === 0) {
          throw new Error('network drop')
        }
        return `"etag-${part.partNumber}"`
      }),
    }
    const out = await runChunkedUpload({
      file: new FakeFile(300) as unknown as Blob & { name?: string },
      init: fakeInit(3),
      uploader,
      delay: async () => undefined,
    })
    expect(out.map((p) => p.partNumber)).toEqual([1, 2, 3])
    // part 1 (1 attempt) + part 2 (2 attempts) + part 3 (1 attempt) = 4
    expect(uploader.upload).toHaveBeenCalledTimes(4)
  })

  it('throws and emits status=error after exceeding maxRetries', async () => {
    const uploader: PartUploader = {
      upload: vi.fn(async () => {
        throw new Error('permadown')
      }),
    }
    const onProgress = vi.fn()
    await expect(
      runChunkedUpload({
        file: new FakeFile(100) as unknown as Blob & { name?: string },
        init: fakeInit(1),
        uploader,
        onProgress,
        maxRetries: 2,
        delay: async () => undefined,
      }),
    ).rejects.toThrow('permadown')
    expect(uploader.upload).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
    const last = onProgress.mock.calls.at(-1)![0]
    expect(last.status).toBe('error')
    expect(last.error).toMatch(/permadown/)
  })
})
