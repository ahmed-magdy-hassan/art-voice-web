import { QueryClient } from '@tanstack/vue-query'

// Centralised QueryClient config. Server state (analyses, user, …) flows
// exclusively through TanStack Query — never Pinia (CLAUDE.md Nuxt standard).
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, err) => {
          // Don't retry client errors. Server errors get one retry.
          const status = (err as { statusCode?: number } | null)?.statusCode
          if (status && status >= 400 && status < 500) return false
          return failureCount < 1
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
