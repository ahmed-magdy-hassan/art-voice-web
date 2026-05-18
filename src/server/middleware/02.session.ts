// KAN-342 — Session guard for authenticated BFF routes.
// Routes under /api/** (except the whitelist below) require a valid access_token cookie.
// Sets event.context.userId and event.context.tenantId for downstream handlers.
import { createError, getCookie, getRequestURL } from 'h3'
import { z } from 'zod'
import { businessFetch } from '../utils/upstream'

const PUBLIC_PREFIXES = [
  '/api/auth/',
  '/api/config/',
  '/healthz',
  '/readyz',
]

const MeResponse = z.object({
  userId: z.string(),
  tenantId: z.string(),
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // Only guard /api/** routes
  if (!path.startsWith('/api/')) return

  // Whitelist: auth bootstrap, health checks
  if (PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))) return

  const token = getCookie(event, 'access_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'no_session' })
  }

  try {
    const me = await businessFetch<z.infer<typeof MeResponse>>('/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      schema: MeResponse,
    })
    event.context.userId = me.userId
    event.context.tenantId = me.tenantId
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 401
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 401, statusMessage: 'session_expired' })
    }
    throw createError({ statusCode: 502, statusMessage: 'session_check_failed' })
  }
})
