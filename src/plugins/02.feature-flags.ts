import { initFeatureFlags } from '@/app/providers/feature-flags'

export default defineNuxtPlugin(async () => {
  // Bootstrap OpenFeature before the first useFlag() call.
  await initFeatureFlags()
})
