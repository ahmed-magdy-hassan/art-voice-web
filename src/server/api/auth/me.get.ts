// KAN-338 BFF — return the current session identity from the access_token cookie.
// Used by useAuth (client plugin) and the auth route middleware to validate the session.
import { createError, getCookie } from 'h3'
import { z } from 'zod'
import { businessFetch } from '../../utils/upstream'

const MeResponse = z.object({
  userId: z.string(),
  tenantId: z.string(),
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  console.log('[me.get] access_token cookie present:', !!token, 'len:', token?.length ?? 0)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'no_session' })
  }
  try {
    const me = await businessFetch<z.infer<typeof MeResponse>>('/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      schema: MeResponse,
    })
    console.log('[me.get] business /v1/auth/me OK userId=', me.userId)
    return me
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 401
    console.error('[me.get] /v1/auth/me failed status=', status, 'msg=', (err as Error)?.message)
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 401, statusMessage: 'session_expired' })
    }
    throw createError({ statusCode: 502, statusMessage: 'me_upstream_unavailable' })
  }
})
