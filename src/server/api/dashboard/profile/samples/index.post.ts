// KAN-283 — Create a voice sample slot and get presigned upload URL.
import { businessFetch, contextHeaders } from '../../../../utils/upstream'
import { readBody } from 'h3'
import { z } from 'zod'

const ALLOWED_MIME_TYPES = ['audio/wav', 'audio/mpeg', 'audio/webm', 'audio/ogg'] as const

const Body = z.object({
  label: z.string().optional(),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  fileSizeBytes: z.number().int().min(1).max(104_857_600),
})

const CreateSampleResponseRaw = z.object({
  sample: z.object({ id: z.string() }).passthrough(),
  uploadUrl: z.string(),
  uploadExpiresAt: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = Body.parse(await readBody(event))
  return await businessFetch<unknown>('/v1/dashboard/profile/samples', {
    method: 'POST',
    body,
    headers: contextHeaders(event),
    schema: CreateSampleResponseRaw,
  })
})
