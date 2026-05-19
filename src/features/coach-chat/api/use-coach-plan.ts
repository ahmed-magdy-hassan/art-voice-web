import { useQuery } from '@tanstack/vue-query'
import { CoachingPlan } from '@/shared/api/contracts/coach'
import { apiFetch } from '@/shared/api/client'

export function useCoachPlan(payload: { recent_analyses?: unknown[]; goal?: string }) {
  return useQuery({
    queryKey: ['coach-plan', payload.goal ?? ''],
    queryFn: () =>
      apiFetch('/api/coach/plan' as `/api/${string}`, {
        method: 'POST',
        body: payload,
        schema: CoachingPlan,
      }),
    staleTime: 10 * 60_000,
  })
}
