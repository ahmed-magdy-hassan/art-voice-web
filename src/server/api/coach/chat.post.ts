// KAN-294: BFF → ai-coach POST /v1/coach/chat
import { z } from 'zod'
import { ChatResponse } from '@/shared/api/contracts/coach'
import { aiCoachFetch, contextHeaders } from '../../utils/upstream'

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

const Body = z.object({
  thread_id: z.string(),
  history: z.array(ChatMessageSchema).optional(),
  message: z.string().min(1).max(4000),
  language: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const body = Body.parse(raw)
  const headers = contextHeaders(event)

  return await aiCoachFetch('/v1/coach/chat', {
    method: 'POST',
    body: {
      user_id: event.context.userId ?? 'anonymous',
      tenant_id: event.context.tenantId ?? 'default',
      thread_id: body.thread_id,
      history: body.history ?? [],
      message: body.message,
      language: body.language ?? 'en',
    },
    headers,
    schema: ChatResponse,
  })
})
