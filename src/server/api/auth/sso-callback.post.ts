// KAN-267 BFF — complete SSO: exchange code for tokens via gateway.
// The gateway cookie-lifts the refresh token (same as sign-in).
import { createError, setCookie } from 'h3'
import { z } from 'zod'
import { UpstreamTokenResponse, SignInMfaResponse } from '@/shared/api/contracts/auth'
import { businessFetch } from '../../utils/upstream'

const SsoProvider = z.enum(['google', 'microsoft', 'okta', 'apple'])
const CallbackBody = z.object({
  provider: SsoProvider,
  code: z.string().min(1),
  state: z.string().min(1),
  iss: z.string().nullable().optional(),
})
const UpstreamResponse = z.union([UpstreamTokenResponse, SignInMfaResponse])

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = CallbackBody.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_payload' })
  }
  try {
    console.log('[sso-callback] start', {
      provider: parsed.data.provider,
      hasCode: !!parsed.data.code,
      state: parsed.data.state,
      iss: parsed.data.iss,
    })
    const upstream = await businessFetch<z.infer<typeof UpstreamResponse>>(
      `/v1/auth/sso/${parsed.data.provider}/callback`,
      {
        method: 'POST',
        body: { code: parsed.data.code, state: parsed.data.state, iss: parsed.data.iss },
        schema: UpstreamResponse as typeof UpstreamResponse,
      },
    )
    console.log('[sso-callback] upstream response keys:', Object.keys(upstream as object))
    if ('mfaRequired' in upstream && upstream.mfaRequired) {
      console.log('[sso-callback] MFA required, returning challenge')
      return { mfaRequired: true as const, challengeId: upstream.challengeId }
    }

    const tokens = upstream as z.infer<typeof UpstreamTokenResponse>
    console.log('[sso-callback] token presence', {
      hasAccessToken: !!tokens.accessToken,
      accessTokenLen: tokens.accessToken?.length ?? 0,
      hasRefreshToken: !!tokens.refreshToken,
      accessTokenExpiresIn: tokens.accessTokenExpiresIn,
      userId: tokens.userId,
      tenantId: tokens.tenantId,
    })
    if (!tokens.accessToken) {
      console.error('[sso-callback] FATAL: upstream returned no accessToken — cookie cannot be set. Raw upstream:', JSON.stringify(upstream))
      throw createError({ statusCode: 502, statusMessage: 'sso_no_token' })
    }

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
    const status = (err as { statusCode?: number }).statusCode ?? 500
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 401, statusMessage: 'sso_auth_failed' })
    }
    throw createError({ statusCode: 502, statusMessage: 'sso_unavailable' })
  }
})
