// KAN-281 — List voice samples.
import { VoiceSamplesResponse } from '@/shared/api/contracts/profile'
import { businessFetch, contextHeaders } from '../../../../utils/upstream'

export default defineEventHandler(async (event) => {
  return await businessFetch<unknown>('/v1/dashboard/profile/samples', {
    headers: contextHeaders(event),
    schema: VoiceSamplesResponse,
  })
})
