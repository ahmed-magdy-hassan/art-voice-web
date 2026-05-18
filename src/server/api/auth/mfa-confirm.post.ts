// KAN-332 BFF — confirm TOTP enrollment with first code.
import { createError } from 'h3'
import { TotpConfirmRequest, TotpConfirmResponse } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = TotpConfirmRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_payload' })
  }
  try {
    return await businessFetch<TotpConfirmResponse>('/v1/auth/mfa/totp/confirm', {
      method: 'POST',
      body: parsed.data,
      schema: TotpConfirmResponse,
      headers: {
        authorization: getHeader(event, 'authorization') ?? '',
      },
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 500
    if (status === 401) {
      throw createError({ statusCode: 401, statusMessage: 'mfa_code_invalid' })
    }
    throw createError({ statusCode: 502, statusMessage: 'mfa_confirm_unavailable' })
  }
})
