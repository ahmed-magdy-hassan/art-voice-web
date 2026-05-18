import { describe, it, expect } from 'vitest'
import { resetPasswordFormSchema } from './schema'

describe('resetPasswordFormSchema', () => {
  it('accepts matching strong passwords', () => {
    expect(
      resetPasswordFormSchema.safeParse({
        token: 't',
        newPassword: 'correct-horse-battery-staple',
        confirmPassword: 'correct-horse-battery-staple',
      }).success,
    ).toBe(true)
  })

  it('rejects when passwords do not match', () => {
    const r = resetPasswordFormSchema.safeParse({
      token: 't',
      newPassword: 'correct-horse-battery-staple',
      confirmPassword: 'a-different-long-password',
    })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(
        r.error.issues.find((i) => i.path[0] === 'confirmPassword')?.message,
      ).toMatch(/do not match/)
    }
  })

  it('rejects short passwords', () => {
    expect(
      resetPasswordFormSchema.safeParse({
        token: 't',
        newPassword: 'short',
        confirmPassword: 'short',
      }).success,
    ).toBe(false)
  })
})
