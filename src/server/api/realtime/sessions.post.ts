// KAN-285 BFF — open a Live Analysis session.
//
// The session middleware (02.session.ts) has already validated the
// access_token cookie and set event.context.userId/tenantId. Here we:
//   1. exchange that session token for a short-lived realtime-scoped token
//      via the gateway (the browser never holds either token until now;
//      the realtime one is intentionally short-lived + narrow),
//   2. mint a session id,
//   3. return the gateway WSS url + token so the client opens the stream.
//
// `sfu: null` → no WebRTC SFU yet (KAN-100); the client uses the WSS Opus
// path (UC-19.25 alt-flow 1a), which is the transport this slice ships.
import { createError, getCookie, getRequestURL } from 'h3'
import { randomUUID } from 'node:crypto'
import { ExchangedToken, LiveSessionResponse } from '@/shared/api/contracts/realtime'
import { gatewayFetch } from '../../utils/upstream'

export default defineEventHandler(async (event): Promise<LiveSessionResponse> => {
  const token = getCookie(event, 'access_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'no_session' })
  }

  let exchanged
  try {
    exchanged = await gatewayFetch<ExchangedToken>('/v1/auth/token-exchange', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      schema: ExchangedToken,
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 502
    if (status === 401 || status === 403) {
      throw createError({ statusCode: 401, statusMessage: 'session_expired' })
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'realtime_token_exchange_unavailable',
    })
  }

  const sessionId = randomUUID()
  const config = useRuntimeConfig()
  // Prefer the configured public WS origin; fall back to deriving wss/ws
  // from the request host so the same code works behind any ingress.
  const wsBase =
    config.public.realtimeWsUrl ||
    (() => {
      const u = getRequestURL(event)
      return `${u.protocol === 'https:' ? 'wss:' : 'ws:'}//${u.host}`
    })()

  return {
    sessionId,
    wsUrl: `${wsBase.replace(/\/$/, '')}/realtime`,
    realtimeToken: exchanged.accessToken,
    expiresIn: exchanged.expiresIn,
    sfu: null,
  }
})
