import { VueQueryPlugin, hydrate, dehydrate } from '@tanstack/vue-query'
import { createQueryClient } from '@/app/providers/query-client'

// SSR-safe TanStack Query setup. State serialises from server → client via Nuxt payload.
export default defineNuxtPlugin((nuxt) => {
  const queryClient = createQueryClient()
  const vueQueryState = useState<Record<string, unknown> | null>('vue-query', () => null)

  nuxt.vueApp.use(VueQueryPlugin, { queryClient })

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient) as unknown as Record<string, unknown>
    })
  }
  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value as never)
  }
})
