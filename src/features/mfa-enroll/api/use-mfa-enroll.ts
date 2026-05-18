import { useMutation, useQuery } from '@tanstack/vue-query'
import { TotpEnrollResponse, TotpConfirmRequest, TotpConfirmResponse } from '@/shared/api/contracts/auth'
import { apiFetch } from '@/shared/api/client'

export function useTotpEnroll() {
  return useMutation({
    mutationKey: ['totp-enroll'],
    mutationFn: async () => {
      return apiFetch('/api/auth/mfa-enroll', {
        method: 'POST',
        schema: TotpEnrollResponse,
      })
    },
  })
}

export function useTotpConfirm() {
  return useMutation({
    mutationKey: ['totp-confirm'],
    mutationFn: async (input: TotpConfirmRequest) => {
      const validated = TotpConfirmRequest.parse(input)
      return apiFetch('/api/auth/mfa-confirm', {
        method: 'POST',
        body: validated,
        schema: TotpConfirmResponse,
      })
    },
  })
}
