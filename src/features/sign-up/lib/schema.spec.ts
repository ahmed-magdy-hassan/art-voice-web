import { describe, it, expect } from 'vitest'
import { signUpFormSchema, passwordStrength } from './schema'

describe('signUpFormSchema', () => {
  it('accepts a valid payload with optional org name omitted', () => {
    expect(
      signUpFormSchema.safeParse({
        email: 'alice@example.com',
        password: 'correct-horse-battery-staple',
      }).success,
    ).toBe(true)
  })

  it('accepts empty orgName (treated as not provided)', () => {
    expect(
      signUpFormSchema.safeParse({
        email: 'alice@example.com',
        password: 'correct-horse-battery-staple',
        orgName: '',
      }).success,
    ).toBe(true)
  })

  it('rejects short passwords', () => {
    expect(
      signUpFormSchema.safeParse({ email: 'a@b.co', password: 'short' }).success,
    ).toBe(false)
  })
})

describe('passwordStrength meter (UC-19.9 password meter UX)', () => {
  it('returns 0 for short passwords', () => {
    expect(passwordStrength('short')).toBe(0)
  })
  it('returns higher scores for longer passwords', () => {
    expect(passwordStrength('twelvecharsxxx')).toBeGreaterThanOrEqual(1)
    expect(passwordStrength('correct-horse-battery-staple')).toBeGreaterThanOrEqual(3)
  })
  it('penalises low-entropy passwords', () => {
    expect(passwordStrength('aaaaaaaaaaaaaaaa')).toBeLessThanOrEqual(1)
  })
})
