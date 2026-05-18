import { z } from 'zod'

// Single typed `$fetch` to the business service. Every Nitro route hops through
// this — never `$fetch` a backend URL ad-hoc. See CLAUDE.md Nuxt standard #2.
export async function businessFetch<T>(
  path: string,
  init: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
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

// KAN-285: typed `$fetch` to the gateway (realtime token-exchange lives
// there, not on the business service). Same boundary-parse discipline.
export async function gatewayFetch<T>(
  path: string,
  init: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
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
