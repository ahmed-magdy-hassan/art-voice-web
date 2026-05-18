// UC-19.9 BFF — proxy sign-up to the gateway; no cookie set since the
// account requires email verification before sign-in.
import { createError } from 'h3'
import { SignUpRequest, SignUpResponse } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = SignUpRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_signup_payload' })
  }
  try {
    return await businessFetch('/v1/auth/register', {
      method: 'POST',
      body: parsed.data,
      schema: SignUpResponse,
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 502
    if (status === 409) {
      // UC-19.9 alt-flow 1a — generic message, no enumeration leak through BFF.
      throw createError({ statusCode: 409, statusMessage: 'registration_failed' })
    }
    if (status === 400) {
      throw createError({ statusCode: 400, statusMessage: 'invalid_signup_payload' })
    }
    throw createError({ statusCode: 502, statusMessage: 'sign_up_upstream_unavailable' })
  }
})
