import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { OnboardingState, type OnboardingStep } from '@/shared/api/contracts/onboarding'
import { apiFetch } from '@/shared/api/client'

export function useOnboarding() {
  return useQuery({
    queryKey: ['onboarding'],
    queryFn: () => apiFetch('/api/dashboard/onboarding', { schema: OnboardingState }),
    staleTime: 60_000,
  })
}

export function useAdvanceOnboarding() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (completedStep: OnboardingStep) =>
      apiFetch('/api/dashboard/onboarding/advance', {
        method: 'POST',
        body: { completedStep },
        schema: OnboardingState,
      }),
    onSuccess: (data) => {
      qc.setQueryData(['onboarding'], data)
    },
  })
}
