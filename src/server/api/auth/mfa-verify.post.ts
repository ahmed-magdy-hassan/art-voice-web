// KAN-333 BFF — proxy MFA verify to the gateway. The gateway cookie-lifts the
// refresh token just like sign-in; the BFF strips the refresh token and returns
// identity only (same pattern as sign-in.post.ts).
import { createError } from 'h3'
import { MfaVerifyRequest, MfaVerifyResponse } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = MfaVerifyRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_payload' })
  }
  try {
    const upstream = await businessFetch<MfaVerifyResponse & Record<string, unknown>>(
      '/v1/auth/mfa/verify',
      {
        method: 'POST',
        body: parsed.data,
        schema: MfaVerifyResponse.passthrough() as unknown as typeof MfaVerifyResponse,
      },
    )
    return { userId: upstream.userId, tenantId: upstream.tenantId }
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 401
    if (status === 401) {
      const message = (err as { statusMessage?: string }).statusMessage ?? 'mfa_code_invalid'
      throw createError({ statusCode: 401, statusMessage: message })
    }
    throw createError({ statusCode: 502, statusMessage: 'mfa_verify_unavailable' })
  }
})
