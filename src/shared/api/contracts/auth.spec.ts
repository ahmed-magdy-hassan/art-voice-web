import { describe, it, expect } from 'vitest'
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from './auth'

describe('auth contracts', () => {
  it('SignInRequest enforces email + min-12 password', () => {
    expect(
      SignInRequest.safeParse({ email: 'a@b.co', password: 'twelvecharsxxx' }).success,
    ).toBe(true)
    expect(SignInRequest.safeParse({ email: 'a@b.co', password: 'short' }).success).toBe(
      false,
    )
    expect(SignInRequest.safeParse({ email: 'not-email', password: 'twelvecharsxxx' }).success).toBe(false)
  })

  it('SignUpResponse rejects non-pending_verification status (drift detection)', () => {
    expect(
      SignUpResponse.safeParse({ userId: 'u', tenantId: 't', status: 'active' }).success,
    ).toBe(false)
  })

  it('SignUpRequest treats orgName as optional', () => {
    expect(
      SignUpRequest.safeParse({ email: 'a@b.co', password: 'twelvecharsxxx' }).success,
    ).toBe(true)
  })

  it('SignInResponse parses success payload', () => {
    expect(SignInResponse.safeParse({ userId: 'u', tenantId: 't' }).success).toBe(true)
  })
})
