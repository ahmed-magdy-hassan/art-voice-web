import { ref } from 'vue'
import {
  InitUploadResponse,
  CompleteUploadResponse,
} from '@/shared/api/contracts/uploads'
import { apiFetch } from '@/shared/api/client'
import {
  runChunkedUpload,
  type ChunkedUploadProgress,
  type PartUploader,
} from '../lib/chunked-upload'

class FetchPartUploader implements PartUploader {
  async upload(part: { url: string; partNumber: number }, blob: Blob): Promise<string> {
    const res = await fetch(part.url, { method: 'PUT', body: blob })
    if (!res.ok) throw new Error(`part ${part.partNumber} failed (${res.status})`)
    const etag = res.headers.get('etag') ?? res.headers.get('ETag')
    if (!etag) throw new Error(`part ${part.partNumber}: missing ETag header`)
    return etag
  }
}

export function useChunkedUpload() {
  const progress = ref<ChunkedUploadProgress>({
    uploadedBytes: 0,
    totalBytes: 0,
    percent: 0,
    completedParts: 0,
    totalParts: 0,
    status: 'idle',
  })

  async function start(file: File): Promise<{ audioId: string }> {
    progress.value = { ...progress.value, status: 'init', totalBytes: file.size }

    const init = await apiFetch('/api/uploads/init', {
      method: 'POST',
      body: {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        fileSize: file.size,
      },
      schema: InitUploadResponse,
    })

    const etags = await runChunkedUpload({
      file,
      init,
      uploader: new FetchPartUploader(),
      onProgress: (p) => (progress.value = p),
    })

    progress.value = { ...progress.value, status: 'completing' }
    const done = await apiFetch('/api/uploads/complete', {
      method: 'POST',
      body: { uploadId: init.uploadId, audioId: init.audioId, parts: etags },
      schema: CompleteUploadResponse,
    })
    progress.value = { ...progress.value, status: 'done' }
    return { audioId: done.audioId }
  }

  return { progress, start }
}
