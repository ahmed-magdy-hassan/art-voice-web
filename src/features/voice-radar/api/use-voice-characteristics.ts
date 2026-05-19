import { useQuery } from '@tanstack/vue-query'
import { VoiceCharacteristics } from '@/shared/api/contracts/voice-characteristics'
import { apiFetch } from '@/shared/api/client'
import type { MaybeRef } from 'vue'

export function useVoiceCharacteristics(analysisId: MaybeRef<string>) {
  return useQuery({
    queryKey: computed(() => ['voice-characteristics', toValue(analysisId)]),
    queryFn: () =>
      apiFetch(`/api/dashboard/analyses/${toValue(analysisId)}/voice-characteristics` as `/api/${string}`, {
        schema: VoiceCharacteristics,
      }),
    staleTime: 5 * 60_000,
    enabled: computed(() => !!toValue(analysisId)),
  })
}
