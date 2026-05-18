import { describe, it, expect } from 'vitest'
import { InitUploadResponse, CompleteUploadRequest } from './uploads'

describe('uploads contracts', () => {
  it('InitUploadResponse rejects part numbers above S3 multipart cap (10000)', () => {
    expect(
      InitUploadResponse.safeParse({
        uploadId: 'u',
        audioId: 'a',
        partSize: 8 * 1024 * 1024,
        parts: [
          { partNumber: 10_001, url: 'https://x/p1', size: 100 },
        ],
      }).success,
    ).toBe(false)
  })

  it('CompleteUploadRequest requires at least one part with etag', () => {
    expect(
      CompleteUploadRequest.safeParse({
        uploadId: 'u',
        audioId: 'a',
        parts: [{ partNumber: 1, etag: '"abc"' }],
      }).success,
    ).toBe(true)
    expect(
      CompleteUploadRequest.safeParse({ uploadId: 'u', audioId: 'a', parts: [] }).success,
    ).toBe(false)
  })
})
