import { z } from 'zod'

export const SignInRequest = z.object({
  email: z.string().email().max(254),
  password: z.string().min(12).max(256),
})
export type SignInRequest = z.infer<typeof SignInRequest>

export const SignInTokenResponse = z.object({
  userId: z.string(),
  tenantId: z.string(),
})
export type SignInTokenResponse = z.infer<typeof SignInTokenResponse>

// What the business service actually returns on successful sign-in / SSO.
// The BFF needs the tokens to set httpOnly cookies, so they must survive the
// boundary parse (the identity-only SignInTokenResponse strips them).
export const UpstreamTokenResponse = z.object({
  userId: z.string(),
  tenantId: z.string(),
  accessToken: z.string(),
  accessTokenExpiresIn: z.number(),
  refreshToken: z.string(),
  refreshTokenExpiresAt: z.string(),
})
export type UpstreamTokenResponse = z.infer<typeof UpstreamTokenResponse>

export const SignInMfaResponse = z.object({
  mfaRequired: z.literal(true),
  challengeId: z.string(),
})
export type SignInMfaResponse = z.infer<typeof SignInMfaResponse>

export const SignInResponse = z.union([SignInTokenResponse, SignInMfaResponse])
export type SignInResponse = z.infer<typeof SignInResponse>

// MFA
export const TotpEnrollResponse = z.object({
  factorId: z.string(),
  secretBase32: z.string(),
  otpauthUri: z.string(),
})
export type TotpEnrollResponse = z.infer<typeof TotpEnrollResponse>

export const TotpConfirmRequest = z.object({
  factorId: z.string(),
  code: z.string().length(6).regex(/^\d{6}$/),
})
export type TotpConfirmRequest = z.infer<typeof TotpConfirmRequest>

export const TotpConfirmResponse = z.object({
  recoveryCodes: z.array(z.string()),
})
export type TotpConfirmResponse = z.infer<typeof TotpConfirmResponse>

export const MfaVerifyRequest = z.object({
  challengeId: z.string(),
  code: z.string().min(6).max(64),
})
export type MfaVerifyRequest = z.infer<typeof MfaVerifyRequest>

export const MfaVerifyResponse = z.object({
  userId: z.string(),
  tenantId: z.string(),
})
export type MfaVerifyResponse = z.infer<typeof MfaVerifyResponse>

export const SignUpRequest = z.object({
  email: z.string().email().max(254),
  password: z.string().min(12).max(256),
  orgName: z.string().trim().max(120).optional(),
})
export type SignUpRequest = z.infer<typeof SignUpRequest>

export const SignUpResponse = z.object({
  userId: z.string(),
  tenantId: z.string(),
  status: z.literal('pending_verification'),
})
export type SignUpResponse = z.infer<typeof SignUpResponse>

// UC-19.63 (KAN-330) — Forgot password.
export const ForgotPasswordRequest = z.object({
  email: z.string().email().max(254),
})
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequest>

export const ForgotPasswordResponse = z.object({
  status: z.literal('accepted'),
})
export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponse>

// UC-19.64 (KAN-331) — Reset password.
export const ResetPasswordRequest = z.object({
  token: z.string().min(1).max(2048),
  newPassword: z.string().min(12).max(256),
})
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequest>
