import { useQuery } from '@tanstack/vue-query'
import { RecoResponse } from '@/shared/api/contracts/reco'
import { apiFetch } from '@/shared/api/client'

export function useRecommendations(payload: {
  recent_analyses?: unknown[]
  completed_exercises?: unknown[]
  max_results?: number
}) {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: () =>
      apiFetch('/api/reco/recommendations' as `/api/${string}`, {
        method: 'POST',
        body: payload,
        schema: RecoResponse,
      }),
    staleTime: 5 * 60_000,
  })
}
