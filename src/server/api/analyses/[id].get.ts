import { createError, getRouterParam } from 'h3'
import { AnalysisDetail } from '@/shared/api/contracts/analysis-detail'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'missing_analysis_id' })

  try {
    return await businessFetch(`/v1/analyses/${encodeURIComponent(id)}`, {
      schema: AnalysisDetail,
    })
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode ?? 502
    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'analysis_not_found' })
    }
    throw createError({ statusCode: 502, statusMessage: 'analysis_detail_unavailable' })
  }
})
