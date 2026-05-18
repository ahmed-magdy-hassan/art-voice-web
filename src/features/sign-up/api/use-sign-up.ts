import { useMutation } from '@tanstack/vue-query'
import { SignUpRequest, SignUpResponse } from '@/shared/api/contracts/auth'
import { apiFetch } from '@/shared/api/client'

export function useSignUp() {
  return useMutation({
    mutationKey: ['sign-up'],
    mutationFn: async (input: SignUpRequest) => {
      const validated = SignUpRequest.parse(input)
      return apiFetch('/api/auth/sign-up', {
        method: 'POST',
        body: validated,
        schema: SignUpResponse,
      })
    },
  })
}
