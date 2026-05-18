// KAN-332 BFF — start TOTP enrollment (requires JWT, forwarded via X-User-Id header).
import { createError } from 'h3'
import { TotpEnrollResponse } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  // The upstream (gateway) validates the JWT and adds X-User-Id / X-Tenant-Id
  // headers before forwarding. We pass them through via businessFetch.
  try {
    return await businessFetch<TotpEnrollResponse>('/v1/auth/mfa/totp/enroll', {
      method: 'POST',
      schema: TotpEnrollResponse,
      // Forward the Authorization header from the incoming request so the
      // gateway can validate the JWT and inject identity headers.
      headers: {
        authorization: getHeader(event, 'authorization') ?? '',
      },
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 500
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
    }
    if (status === 409) {
      throw createError({ statusCode: 409, statusMessage: 'mfa_already_enrolled' })
    }
    throw createError({ statusCode: 502, statusMessage: 'mfa_enroll_unavailable' })
  }
})
