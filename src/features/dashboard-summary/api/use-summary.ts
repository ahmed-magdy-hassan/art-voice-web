import { useQuery } from '@tanstack/vue-query'
import { DashboardSummary } from '@/shared/api/contracts/dashboard'
import { apiFetch } from '@/shared/api/client'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiFetch('/api/dashboard/summary', { schema: DashboardSummary }),
    staleTime: 60_000,
  })
}
