// KAN-342 — Extend H3EventContext with fields set by Nitro middleware.
import type {} from 'h3'

declare module 'h3' {
  interface H3EventContext {
    requestId?: string
    userId?: string
    tenantId?: string
  }
}
