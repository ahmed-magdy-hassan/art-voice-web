import { z } from 'zod'

export const forgotPasswordFormSchema = z.object({
  email: z.string().email('Please enter a valid email.').max(254),
})

export type ForgotPasswordForm = z.infer<typeof forgotPasswordFormSchema>
