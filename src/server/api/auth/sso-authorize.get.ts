// KAN-267 BFF — initiate SSO: redirect browser to IdP authorization URL.
import { createError, sendRedirect } from 'h3'
import { z } from 'zod'
import { businessFetch } from '../../utils/upstream'

const SsoProvider = z.enum(['google', 'microsoft', 'okta', 'apple'])
const AuthorizeResponse = z.object({ redirectUrl: z.string().url(), state: z.string() })

export default defineEventHandler(async (event) => {
  const provider = getQuery(event).provider
  const parsed = SsoProvider.safeParse(provider)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'unsupported_provider' })
  }
  try {
    const result = await businessFetch<z.infer<typeof AuthorizeResponse>>(
      `/v1/auth/sso/${parsed.data}/authorize`,
      { method: 'GET', schema: AuthorizeResponse },
    )
    await sendRedirect(event, result.redirectUrl, 302)
  } catch (err) {
    console.error('[sso-authorize] upstream error:', err)
    throw createError({ statusCode: 502, statusMessage: 'sso_unavailable' })
  }
})
