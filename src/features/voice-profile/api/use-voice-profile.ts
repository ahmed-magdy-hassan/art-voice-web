import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { VoiceProfile, ProfileCompleteness, type VoiceProfile as VoiceProfileType } from '@/shared/api/contracts/profile'
import { apiFetch } from '@/shared/api/client'

export function useVoiceProfile() {
  return useQuery({
    queryKey: ['voice-profile'],
    queryFn: () => apiFetch('/api/dashboard/profile', { schema: VoiceProfile }),
    staleTime: 60_000,
  })
}

export function useProfileCompleteness() {
  return useQuery({
    queryKey: ['profile-completeness'],
    queryFn: () => apiFetch('/api/dashboard/profile/completeness', { schema: ProfileCompleteness }),
    staleTime: 30_000,
  })
}

export function useUpdateVoiceProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<VoiceProfileType>) =>
      apiFetch('/api/dashboard/profile', { method: 'PATCH', body: patch, schema: VoiceProfile }),
    onSuccess: (data) => {
      qc.setQueryData(['voice-profile'], data)
      qc.invalidateQueries({ queryKey: ['profile-completeness'] })
    },
  })
}
