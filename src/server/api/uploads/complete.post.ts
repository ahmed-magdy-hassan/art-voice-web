import { createError } from 'h3'
import {
  CompleteUploadRequest,
  CompleteUploadResponse,
} from '@/shared/api/contracts/uploads'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = CompleteUploadRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_complete_payload' })
  }
  return await businessFetch('/v1/uploads/complete', {
    method: 'POST',
    body: parsed.data,
    schema: CompleteUploadResponse,
  })
})
