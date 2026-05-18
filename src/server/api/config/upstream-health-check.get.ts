import { businessFetch } from '../../utils/upstream'
import { HealthResponse, UpstreamHealth } from '@/shared/api/contracts/health'

export default defineEventHandler(async () => {
  const upstream = await businessFetch('/readyz', { schema: UpstreamHealth })
  return HealthResponse.parse({
    web: 'ok',
    business: upstream,
    checkedAt: new Date().toISOString(),
  })
})
