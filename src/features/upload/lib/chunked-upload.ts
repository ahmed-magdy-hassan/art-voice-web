// UC-19.22 — chunked resumable upload runner.
//
// Lifecycle:
//   1. caller selects/drops a file
//   2. runner asks the BFF for a presigned multipart URL set (/api/uploads/init)
//   3. runner PUTs each part *directly to S3* (BFF never proxies bytes)
//   4. on success runner POSTs /api/uploads/complete with etags
//   5. caller observes progress + status via the returned `state` ref
//
// Resumability:
//   - completed parts are tracked by partNumber; a retried part doesn't
//     re-upload an earlier part.
//   - failed parts retry with bounded backoff.

import type {
  InitUploadResponse,
  UploadPart,
} from '@/shared/api/contracts/uploads'

export interface ChunkedUploadProgress {
  uploadedBytes: number
  totalBytes: number
  percent: number
  completedParts: number
  totalParts: number
  status: 'idle' | 'init' | 'uploading' | 'completing' | 'done' | 'error'
  error?: string
}

export interface PartUploader {
  /** PUTs a single part to S3 and returns the ETag header value. */
  upload(part: UploadPart, blob: Blob): Promise<string>
}

export function planParts(fileSize: number, partSize: number): { partNumber: number; rangeStart: number; rangeEnd: number; size: number }[] {
  if (fileSize <= 0) return []
  if (partSize <= 0) throw new Error('partSize must be positive')
  const parts: { partNumber: number; rangeStart: number; rangeEnd: number; size: number }[] = []
  let cursor = 0
  let partNumber = 1
  while (cursor < fileSize) {
    const end = Math.min(cursor + partSize, fileSize)
    parts.push({ partNumber, rangeStart: cursor, rangeEnd: end, size: end - cursor })
    cursor = end
    partNumber += 1
  }
  return parts
}

export interface RunChunkedUploadOpts {
  file: Blob & { name?: string }
  init: InitUploadResponse
  uploader: PartUploader
  onProgress?: (p: ChunkedUploadProgress) => void
  /** Maximum retries per part. Default 3. */
  maxRetries?: number
  /** Test hook: deterministic delay between retries. */
  delay?: (attempt: number) => Promise<void>
}

export async function runChunkedUpload(
  opts: RunChunkedUploadOpts,
): Promise<{ partNumber: number; etag: string }[]> {
  const { file, init, uploader, onProgress } = opts
  const maxRetries = opts.maxRetries ?? 3
  const delay = opts.delay ?? defaultBackoff

  const total = file.size
  const uploadedByPart = new Map<number, number>()
  const etags = new Map<number, string>()

  const emit = (status: ChunkedUploadProgress['status'], error?: string) => {
    if (!onProgress) return
    const uploaded = sum(uploadedByPart.values())
    onProgress({
      uploadedBytes: uploaded,
      totalBytes: total,
      percent: total === 0 ? 0 : Math.round((uploaded / total) * 100),
      completedParts: etags.size,
      totalParts: init.parts.length,
      status,
      error,
    })
  }

  emit('uploading')
  for (const part of init.parts) {
    if (etags.has(part.partNumber)) continue // resume: already uploaded
    const blob = file.slice(
      offsetFor(init, part.partNumber),
      offsetFor(init, part.partNumber) + part.size,
    )

    let attempt = 0
    // bounded retry loop — UC-19.22 alt-flow 3a (network drop).
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const etag = await uploader.upload(part, blob)
        etags.set(part.partNumber, etag)
        uploadedByPart.set(part.partNumber, part.size)
        emit('uploading')
        break
      } catch (err) {
        attempt += 1
        if (attempt > maxRetries) {
          const message = err instanceof Error ? err.message : 'upload_failed'
          emit('error', message)
          throw err
        }
        await delay(attempt)
      }
    }
  }

  emit('done')
  return [...etags.entries()]
    .map(([partNumber, etag]) => ({ partNumber, etag }))
    .sort((a, b) => a.partNumber - b.partNumber)
}

function offsetFor(init: InitUploadResponse, partNumber: number): number {
  return (partNumber - 1) * init.partSize
}

function sum(values: Iterable<number>): number {
  let total = 0
  for (const v of values) total += v
  return total
}

async function defaultBackoff(attempt: number): Promise<void> {
  const wait = Math.min(2 ** attempt * 100, 4000)
  await new Promise((resolve) => setTimeout(resolve, wait))
}
