import { describe, it, expect } from 'vitest'
import { forgotPasswordFormSchema } from './schema'

describe('forgotPasswordFormSchema', () => {
  it('accepts a valid email', () => {
    expect(
      forgotPasswordFormSchema.safeParse({ email: 'alice@example.com' }).success,
    ).toBe(true)
  })
  it('rejects a malformed email with a friendly message', () => {
    const r = forgotPasswordFormSchema.safeParse({ email: 'not-an-email' })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error.issues[0]?.message).toMatch(/valid email/i)
    }
  })
})
