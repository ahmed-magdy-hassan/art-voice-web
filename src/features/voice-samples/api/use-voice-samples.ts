import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { VoiceSamplesResponse } from '@/shared/api/contracts/profile'
import { apiFetch } from '@/shared/api/client'

export function useVoiceSamples() {
  return useQuery({
    queryKey: ['voice-samples'],
    queryFn: () => apiFetch('/api/dashboard/profile/samples', { schema: VoiceSamplesResponse }),
    staleTime: 30_000,
  })
}

export function useDeleteVoiceSample() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/dashboard/profile/samples/${id}` as `/api/${string}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['voice-samples'] }),
  })
}
