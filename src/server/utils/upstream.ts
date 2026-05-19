import { z } from 'zod'
import type { H3Event } from 'h3'

// Build the gateway-style user context headers from the session middleware context.
// The business service VoiceController (and other dashboard controllers) read
// x-user-id / x-tenant-id that the real gateway injects after JWT verification.
// The BFF replicates this forwarding so the business service never needs to
// re-validate the token for downstream calls.
export function contextHeaders(event: H3Event): Record<string, string> {
  const headers: Record<string, string> = {}
  if (event.context.userId) headers['x-user-id'] = event.context.userId
  if (event.context.tenantId) headers['x-tenant-id'] = event.context.tenantId
  return headers
}

// Single typed `$fetch` to the business service. Every Nitro route hops through
// this — never `$fetch` a backend URL ad-hoc. See CLAUDE.md Nuxt standard #2.
export async function businessFetch<T>(
  path: string,
  init: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    headers?: Record<string, string>
    schema?: z.ZodType<T>
  } = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const data = await $fetch(path, {
    baseURL: config.businessUrl,
    method: init.method ?? 'GET',
    body: init.body,
    headers: init.headers,
  })
  if (init.schema) {
    // Boundary parse: contract drift fails loud, not silently.
    return init.schema.parse(data)
  }
  return data as T
}

export async function aiCoachFetch<T>(
  path: string,
  init: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    headers?: Record<string, string>
    schema?: z.ZodType<T>
  } = {},
): Promise<T> {
  const { aiCoachUrl } = useRuntimeConfig()
  const data = await $fetch(path, {
    baseURL: aiCoachUrl as string,
    method: init.method ?? 'GET',
    body: init.body,
    headers: init.headers,
  })
  if (init.schema) return init.schema.parse(data)
  return data as T
}

export async function aiRecoFetch<T>(
  path: string,
  init: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    headers?: Record<string, string>
    schema?: z.ZodType<T>
  } = {},
): Promise<T> {
  const { aiRecoUrl } = useRuntimeConfig()
  const data = await $fetch(path, {
    baseURL: aiRecoUrl as string,
    method: init.method ?? 'GET',
    body: init.body,
    headers: init.headers,
  })
  if (init.schema) return init.schema.parse(data)
  return data as T
}

// KAN-285: typed `$fetch` to the gateway (realtime token-exchange lives
// there, not on the business service). Same boundary-parse discipline.
export async function gatewayFetch<T>(
  path: string,
  init: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    headers?: Record<string, string>
    schema?: z.ZodType<T>
  } = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const data = await $fetch(path, {
    baseURL: config.gatewayUrl,
    method: init.method ?? 'GET',
    body: init.body,
    headers: init.headers,
  })
  if (init.schema) {
    return init.schema.parse(data)
  }
  return data as T
}
