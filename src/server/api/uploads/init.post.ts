import { createError } from 'h3'
import {
  InitUploadRequest,
  InitUploadResponse,
} from '@/shared/api/contracts/uploads'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = InitUploadRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_init_payload' })
  }
  // BFF NEVER proxies bytes (UC-19.22 business rule). We only ask the upstream
  // for a presigned multipart URL set and forward that to the browser.
  return await businessFetch('/v1/uploads/init', {
    method: 'POST',
    body: parsed.data,
    schema: InitUploadResponse,
  })
})
