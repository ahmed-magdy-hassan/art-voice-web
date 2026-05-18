// UC-19.63 BFF (KAN-330) — proxy forgot-password to the gateway. The upstream
// always returns 202 with body { status: 'accepted' } regardless of whether
// the email exists; the BFF mirrors that contract.
import { createError } from 'h3'
import { ForgotPasswordRequest, ForgotPasswordResponse } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = ForgotPasswordRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_payload' })
  }
  try {
    return await businessFetch<ForgotPasswordResponse>('/v1/auth/password/forgot', {
      method: 'POST',
      body: parsed.data,
      schema: ForgotPasswordResponse,
    })
  } catch {
    // Even on upstream failure we tell the client we accepted the request —
    // the user shouldn't be able to learn about backend health here. The
    // gateway audit log captures the real outcome.
    return { status: 'accepted' as const }
  }
})
