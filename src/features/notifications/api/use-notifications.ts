import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { NotificationsResponse } from '@/shared/api/contracts/dashboard'
import { apiFetch } from '@/shared/api/client'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiFetch('/api/dashboard/notifications', { schema: NotificationsResponse }),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/dashboard/notifications/${id}/read` as `/api/${string}`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
