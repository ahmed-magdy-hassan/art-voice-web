// KAN-345 BFF — sign out: revoke the refresh token upstream, then clear the
// session cookies so subsequent requests are unauthenticated.
import { getCookie, setCookie } from 'h3'
import { businessFetch } from '../../utils/upstream'

function clearCookie(event: Parameters<typeof setCookie>[0], name: string) {
  setCookie(event, name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  // Best-effort upstream revocation. Even if it fails (already expired, token
  // missing, business down) we still clear cookies — the client must end up
  // logged out regardless.
  if (refreshToken) {
    try {
      await businessFetch('/v1/auth/sign-out', {
        method: 'POST',
        body: { refreshToken },
      })
    } catch (err) {
      console.error('[sign-out] upstream revoke failed (clearing cookies anyway):', (err as Error)?.message)
    }
  }

  clearCookie(event, 'access_token')
  clearCookie(event, 'refresh_token')

  return { ok: true }
})
