import { useMutation } from '@tanstack/vue-query'
import { SignInRequest, SignInTokenResponse, SignInMfaResponse } from '@/shared/api/contracts/auth'
import { apiFetch } from '@/shared/api/client'
import { z } from 'zod'

const BffSignInResponse = z.union([SignInTokenResponse, SignInMfaResponse])
export type BffSignInResult = z.infer<typeof BffSignInResponse>

export function useSignIn() {
  return useMutation({
    mutationKey: ['sign-in'],
    mutationFn: async (input: SignInRequest): Promise<BffSignInResult> => {
      const validated = SignInRequest.parse(input)
      return apiFetch('/api/auth/sign-in', {
        method: 'POST',
        body: validated,
        schema: BffSignInResponse,
      })
    },
  })
}
