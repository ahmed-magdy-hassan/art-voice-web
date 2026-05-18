import { useMutation } from '@tanstack/vue-query'
import { ResetPasswordRequest } from '@/shared/api/contracts/auth'
import { apiFetch } from '@/shared/api/client'

export function useResetPassword() {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (input: ResetPasswordRequest) => {
      const validated = ResetPasswordRequest.parse(input)
      await apiFetch<null>('/api/auth/password-reset', {
        method: 'POST',
        body: validated,
      })
    },
  })
}
