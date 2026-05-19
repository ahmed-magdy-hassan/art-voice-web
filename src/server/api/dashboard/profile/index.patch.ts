// KAN-280 — Update voice profile.
import { VoiceProfile } from '@/shared/api/contracts/profile'
import { businessFetch, contextHeaders } from '../../../utils/upstream'
import { readBody } from 'h3'
import { z } from 'zod'

const Body = z.object({
  displayName: z.string().max(100).nullable().optional(),
  role: z.string().max(100).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  language: z.string().max(20).nullable().optional(),
  accent: z.string().max(100).nullable().optional(),
  goals: z.array(z.string()).optional(),
})

export default defineEventHandler(async (event) => {
  const body = Body.parse(await readBody(event))
  return await businessFetch<unknown>('/v1/dashboard/profile', {
    method: 'PATCH',
    body,
    headers: contextHeaders(event),
    schema: VoiceProfile,
  })
})
