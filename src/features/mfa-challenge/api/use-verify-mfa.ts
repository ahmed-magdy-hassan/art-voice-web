import { useMutation } from '@tanstack/vue-query'
import { MfaVerifyRequest, MfaVerifyResponse } from '@/shared/api/contracts/auth'
import { apiFetch } from '@/shared/api/client'

export function useVerifyMfa() {
  return useMutation({
    mutationKey: ['mfa-verify'],
    mutationFn: async (input: MfaVerifyRequest) => {
      const validated = MfaVerifyRequest.parse(input)
      return apiFetch('/api/auth/mfa-verify', {
        method: 'POST',
        body: validated,
        schema: MfaVerifyResponse,
      })
    },
  })
}
