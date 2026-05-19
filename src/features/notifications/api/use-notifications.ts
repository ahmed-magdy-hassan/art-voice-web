import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/vue-query'
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

export function useNotificationsPage(opts: { unreadOnly?: Ref<boolean> } = {}) {
  return useInfiniteQuery({
    queryKey: ['notifications', 'page', opts.unreadOnly],
    queryFn: ({ pageParam }) => {
      const qs = new URLSearchParams({ limit: '20' })
      if (pageParam) qs.set('cursor', pageParam as string)
      if (opts.unreadOnly?.value) qs.set('unreadOnly', 'true')
      return apiFetch(`/api/dashboard/notifications?${qs}` as `/api/${string}`, {
        schema: NotificationsResponse,
      })
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    staleTime: 30_000,
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

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () =>
      apiFetch('/api/dashboard/notifications/read-all' as `/api/${string}`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
