import type { FetchOptions } from 'ofetch'
import type { z } from 'zod'

// Browser-side wrapper around Nuxt's $fetch. ALWAYS hits the BFF (`/api/**`),
// never an upstream service directly (CLAUDE.md Nuxt standard #2).
export async function apiFetch<T>(
  path: `/api/${string}`,
  options: FetchOptions<'json'> & { schema?: z.ZodSchema<T> } = {},
): Promise<T> {
  const data = await $fetch<T>(path, options)
  return options.schema ? options.schema.parse(data) : data
}
