import { describe, it, expect } from 'vitest'
import { signInFormSchema } from './schema'

describe('signInFormSchema', () => {
  it('accepts a valid payload', () => {
    const r = signInFormSchema.safeParse({
      email: 'alice@example.com',
      password: 'correct-horse-battery-staple',
    })
    expect(r.success).toBe(true)
  })

  it('rejects short passwords with a friendly message', () => {
    const r = signInFormSchema.safeParse({ email: 'a@b.co', password: 'short' })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error.issues.find((i) => i.path[0] === 'password')?.message).toMatch(
        /12 characters/,
      )
    }
  })

  it('rejects malformed emails', () => {
    const r = signInFormSchema.safeParse({
      email: 'not-an-email',
      password: 'twelvecharsxxx',
    })
    expect(r.success).toBe(false)
  })
})
