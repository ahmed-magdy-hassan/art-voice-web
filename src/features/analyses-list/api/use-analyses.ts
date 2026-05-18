import { computed, MaybeRef, unref } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import {
  AnalysisListQuery,
  AnalysisListResponse,
} from '@/shared/api/contracts/analyses'
import { apiFetch } from '@/shared/api/client'

export function useAnalysesList(filters: MaybeRef<Partial<AnalysisListQuery>> = {}) {
  return useInfiniteQuery({
    queryKey: computed(() => ['analyses', unref(filters)] as const),
    queryFn: ({ pageParam }) => {
      const f = unref(filters)
      return apiFetch('/api/analyses', {
        query: { ...f, cursor: pageParam ?? undefined },
        schema: AnalysisListResponse,
      })
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    staleTime: 30_000,
  })
}
