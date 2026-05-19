import { useQuery } from '@tanstack/vue-query'
import { PipelineStatus } from '@/shared/api/contracts/pipeline'
import { apiFetch } from '@/shared/api/client'
import type { MaybeRef } from 'vue'

export function usePipelineStatus(analysisId: MaybeRef<string>) {
  const id = computed(() => toValue(analysisId))

  return useQuery({
    queryKey: computed(() => ['pipeline-status', id.value]),
    queryFn: () =>
      apiFetch(`/api/dashboard/analyses/${id.value}/pipeline-status` as `/api/${string}`, {
        schema: PipelineStatus,
      }),
    staleTime: 10_000,
    enabled: computed(() => !!id.value),
    // Poll every 5s while the pipeline is running; stop once it reaches a
    // terminal state. A future sprint can replace this with a WS push once
    // the Nitro→svc-realtime WS proxy route is wired up.
    refetchInterval: (query) => {
      const status = query.state.data?.overallStatus
      if (status === 'RUNNING' || status === 'PENDING') return 5_000
      return false
    },
  })
}
