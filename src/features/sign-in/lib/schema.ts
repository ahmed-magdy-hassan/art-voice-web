import { z } from 'zod'

// Shared form schema — reused by vee-validate AND the BFF contract.
export const signInFormSchema = z.object({
  email: z.string().email('Please enter a valid email.').max(254),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters.')
    .max(256, 'Password is too long.'),
})

export type SignInForm = z.infer<typeof signInFormSchema>
