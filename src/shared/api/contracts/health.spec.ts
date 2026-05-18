import { describe, it, expect } from 'vitest'
import { HealthResponse, UpstreamHealth } from './health'

describe('health contracts', () => {
  it('UpstreamHealth requires status', () => {
    expect(UpstreamHealth.safeParse({ status: 'ok' }).success).toBe(true)
    expect(UpstreamHealth.safeParse({}).success).toBe(false)
  })

  it('HealthResponse requires web=ok, business, checkedAt', () => {
    const ok = HealthResponse.safeParse({
      web: 'ok',
      business: { status: 'ok', db: 'up' },
      checkedAt: '2026-05-14T08:00:00Z',
    })
    expect(ok.success).toBe(true)
  })

  it('HealthResponse rejects web other than "ok" (drift-detection)', () => {
    const bad = HealthResponse.safeParse({
      web: 'degraded',
      business: { status: 'ok' },
      checkedAt: '2026-05-14T08:00:00Z',
    })
    expect(bad.success).toBe(false)
  })
})
