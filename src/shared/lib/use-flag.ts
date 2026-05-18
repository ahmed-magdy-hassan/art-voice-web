import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { getFlagClient } from '@/app/providers/feature-flags'

// CLAUDE.md "Nuxt Architecture Standard" — flags ONLY through OpenFeature.
// Returns a reactive Ref so feature switches re-render UI when the provider pushes a change.
export function useFlag(key: string, fallback = false): Readonly<Ref<boolean>> {
  const client = getFlagClient()
  const value = ref(client.getBooleanValue(key, fallback))
  const handler = () => {
    value.value = client.getBooleanValue(key, fallback)
  }
  client.addHandler('PROVIDER_CONFIGURATION_CHANGED' as never, handler)
  onUnmounted(() => client.removeHandler('PROVIDER_CONFIGURATION_CHANGED' as never, handler))
  return value as Readonly<Ref<boolean>>
}
