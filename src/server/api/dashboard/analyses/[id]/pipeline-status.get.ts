// KAN-284 — Full pipeline event history for an analysis.
import { PipelineStatus } from '@/shared/api/contracts/pipeline'
import { businessFetch, contextHeaders } from '../../../../utils/upstream'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  return await businessFetch<unknown>(`/v1/dashboard/analyses/${id}/pipeline-status`, {
    headers: contextHeaders(event),
    schema: PipelineStatus,
  })
})
