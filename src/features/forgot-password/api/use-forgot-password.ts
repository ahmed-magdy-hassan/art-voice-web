import { useMutation } from '@tanstack/vue-query'
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from '@/shared/api/contracts/auth'
import { apiFetch } from '@/shared/api/client'

export function useForgotPassword() {
  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async (input: ForgotPasswordRequest) => {
      const validated = ForgotPasswordRequest.parse(input)
      return apiFetch('/api/auth/password-forgot', {
        method: 'POST',
        body: validated,
        schema: ForgotPasswordResponse,
      })
    },
  })
}
