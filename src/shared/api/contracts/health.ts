import { z } from 'zod'

// Contracts live in shared/api/contracts so BOTH the BFF (server/api/*) and
// browser-side hooks import the same Zod schema. Drift is a build-time error.
export const UpstreamHealth = z.object({
  status: z.string(),
  db: z.string().optional(),
})
export type UpstreamHealth = z.infer<typeof UpstreamHealth>

export const HealthResponse = z.object({
  web: z.literal('ok'),
  business: UpstreamHealth,
  checkedAt: z.string(),
})
export type HealthResponse = z.infer<typeof HealthResponse>
