import { z } from 'zod'

export const confirmTotpSchema = z.object({
  code: z
    .string()
    .length(6, 'Enter the 6-digit code from your authenticator app.')
    .regex(/^\d{6}$/, 'Code must be 6 digits.'),
})

export type ConfirmTotpForm = z.infer<typeof confirmTotpSchema>
