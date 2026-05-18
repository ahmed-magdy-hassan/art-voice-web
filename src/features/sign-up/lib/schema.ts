import { z } from 'zod'

export const signUpFormSchema = z
  .object({
    email: z.string().email('Please enter a valid email.').max(254),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters.')
      .max(256, 'Password is too long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    orgName: z
      .string()
      .trim()
      .max(120, 'Workspace name must be 120 characters or less.')
      .optional()
      .or(z.literal('')),
    gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say']).optional(),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      })
    }
  })

export type SignUpForm = z.infer<typeof signUpFormSchema>

// NIST SP 800-63B inspired — score length, deduct for low entropy.
// Returns a 0–4 score for the password meter UX.
export function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (pw.length < 12) return 0
  let score: 0 | 1 | 2 | 3 | 4 = 1
  if (pw.length >= 16) score = 2
  if (pw.length >= 20) score = 3
  if (pw.length >= 24) score = 4
  const distinct = new Set(pw).size
  if (distinct < 6) score = Math.max(0, score - 1) as 0 | 1 | 2 | 3 | 4
  return score
}

export const strengthLabels = ['Too short', 'Weak', 'Okay', 'Strong', 'Very strong'] as const
export const strengthTones = ['danger', 'danger', 'warning', 'success', 'success'] as const
