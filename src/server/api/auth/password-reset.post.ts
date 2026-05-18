// UC-19.64 BFF (KAN-331) — proxy reset-password to the gateway. Upstream
// returns 204 on success; any failure collapses to a generic 400.
import { createError } from 'h3'
import { ResetPasswordRequest } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = ResetPasswordRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_payload' })
  }
  try {
    await businessFetch<void>('/v1/auth/password/reset', {
      method: 'POST',
      body: parsed.data,
    })
    setResponseStatus(event, 204)
    return null
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 400
    if (status === 400) {
      throw createError({ statusCode: 400, statusMessage: 'password_reset_failed' })
    }
    throw createError({ statusCode: 502, statusMessage: 'password_reset_upstream_unavailable' })
  }
})
