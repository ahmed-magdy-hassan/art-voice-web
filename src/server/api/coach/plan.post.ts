// KAN-294: BFF → ai-coach POST /v1/coach/plan
import { z } from 'zod'
import { CoachingPlan } from '@/shared/api/contracts/coach'
import { aiCoachFetch, contextHeaders } from '../../utils/upstream'

const Body = z.object({
  recent_analyses: z.array(z.record(z.unknown())).optional(),
  goal: z.string().optional(),
  language: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const body = Body.parse(raw)
  const headers = contextHeaders(event)

  return await aiCoachFetch('/v1/coach/plan', {
    method: 'POST',
    body: {
      user_id: event.context.userId ?? 'anonymous',
      tenant_id: event.context.tenantId ?? 'default',
      recent_analyses: body.recent_analyses ?? [],
      goal: body.goal,
      language: body.language ?? 'en',
    },
    headers,
    schema: CoachingPlan,
  })
})
