// KAN-272 — Voice characteristics for radar chart.
import { VoiceCharacteristics } from '@/shared/api/contracts/voice-characteristics'
import { businessFetch, contextHeaders } from '../../../../utils/upstream'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  return await businessFetch<unknown>(`/v1/dashboard/analyses/${id}/voice-characteristics`, {
    headers: contextHeaders(event),
    schema: VoiceCharacteristics,
  })
})
