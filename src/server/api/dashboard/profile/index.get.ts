// KAN-280 — Fetch voice profile.
import { VoiceProfile } from '@/shared/api/contracts/profile'
import { businessFetch, contextHeaders } from '../../../utils/upstream'

export default defineEventHandler(async (event) => {
  return await businessFetch<unknown>('/v1/dashboard/profile', {
    headers: contextHeaders(event),
    schema: VoiceProfile,
  })
})
