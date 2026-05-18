import { z } from 'zod'

export const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1).max(2048),
    newPassword: z
      .string()
      .min(12, 'Password must be at least 12 characters.')
      .max(256, 'Password is too long.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>
