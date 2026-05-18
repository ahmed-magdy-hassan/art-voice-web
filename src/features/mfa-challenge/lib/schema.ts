import { z } from 'zod'

export const mfaChallengeFormSchema = z.object({
  code: z
    .string()
    .min(6, 'Enter your 6-digit code or a recovery code.')
    .max(64),
})

export type MfaChallengeForm = z.infer<typeof mfaChallengeFormSchema>
