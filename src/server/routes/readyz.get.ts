import { businessFetch } from '../utils/upstream'
import { UpstreamHealth } from '@/shared/api/contracts/health'

export default defineEventHandler(async () => {
  try {
    const upstream = await businessFetch('/readyz', { schema: UpstreamHealth })
    return { status: 'ready', business: upstream }
  } catch (err) {
    return { status: 'degraded', business: { error: (err as Error).message } }
  }
})
