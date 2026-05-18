// UC-19.6 BFF — proxy sign-in to the gateway. Returns either session tokens
// (cookies set by gateway) or an MFA challenge ID that the SPA will forward
// to the /api/auth/mfa-verify endpoint.
import { createError, setCookie } from 'h3'
import { SignInRequest, UpstreamTokenResponse, SignInMfaResponse } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'
import { z } from 'zod'

const UpstreamSignInResponse = z.union([UpstreamTokenResponse, SignInMfaResponse])

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = SignInRequest.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_credentials_payload' })
  }
  try {
    const upstream = await businessFetch<z.infer<typeof UpstreamSignInResponse>>(
      '/v1/auth/sign-in',
      {
        method: 'POST',
        body: parsed.data,
        schema: UpstreamSignInResponse as typeof UpstreamSignInResponse,
      },
    )

    // MFA gate — return challenge ID to the SPA; no session cookie yet.
    if ('mfaRequired' in upstream && upstream.mfaRequired) {
      return { mfaRequired: true as const, challengeId: upstream.challengeId }
    }

    const tokens = upstream as z.infer<typeof UpstreamTokenResponse>
    console.log('[sign-in] token presence', {
      hasAccessToken: !!tokens.accessToken,
      hasRefreshToken: !!tokens.refreshToken,
      userId: tokens.userId,
    })

    // Establish the session: me.get.ts / session middleware authenticate via
    // the `access_token` cookie. secure only in prod (localhost dev is http).
    const isProd = process.env.NODE_ENV === 'production'
    setCookie(event, 'access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.accessTokenExpiresIn,
    })
    setCookie(event, 'refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      expires: new Date(tokens.refreshTokenExpiresAt),
    })

    return { userId: tokens.userId, tenantId: tokens.tenantId }
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 401
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 401, statusMessage: 'invalid_credentials' })
    }
    throw createError({ statusCode: 502, statusMessage: 'sign_in_upstream_unavailable' })
  }
})
