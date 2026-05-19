// KAN-273: BFF → ai-reco POST /v1/reco/recommendations
import { z } from 'zod'
import { RecoResponse } from '@/shared/api/contracts/reco'
import { aiRecoFetch, contextHeaders } from '../../utils/upstream'

const Body = z.object({
  recent_analyses: z.array(z.record(z.unknown())).optional(),
  completed_exercises: z.array(z.record(z.unknown())).optional(),
  max_results: z.number().int().min(1).max(20).optional(),
})

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const body = Body.parse(raw)
  const headers = contextHeaders(event)

  return await aiRecoFetch('/v1/reco/recommendations', {
    method: 'POST',
    body: {
      user_id: event.context.userId ?? 'anonymous',
      tenant_id: event.context.tenantId ?? 'default',
      recent_analyses: body.recent_analyses ?? [],
      completed_exercises: body.completed_exercises ?? [],
      max_results: body.max_results ?? 5,
    },
    headers,
    schema: RecoResponse,
  })
})
