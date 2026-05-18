import { useQuery } from '@tanstack/vue-query'
import { AnalysisDetail } from '@/shared/api/contracts/analysis-detail'
import { apiFetch } from '@/shared/api/client'

export function useAnalysisDetail(id: string) {
  return useQuery({
    queryKey: ['analyses', id],
    queryFn: () =>
      apiFetch(`/api/analyses/${encodeURIComponent(id)}`, { schema: AnalysisDetail }),
    staleTime: 60_000,
  })
}
