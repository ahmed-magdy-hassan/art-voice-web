// KAN-277 — Export analysis as JSON or CSV.
import { businessFetch, contextHeaders } from '../../../../utils/upstream'
import { getQuery, setHeader } from 'h3'
import { z } from 'zod'

const QuerySchema = z.object({ format: z.enum(['json', 'csv']).default('json') })

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const { format } = QuerySchema.parse(getQuery(event))

  const raw = await businessFetch<string>(`/v1/dashboard/analyses/${id}/export?format=${format}`, {
    headers: contextHeaders(event),
  })

  const contentType = format === 'csv' ? 'text/csv' : 'application/json'
  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Content-Disposition', `attachment; filename="analysis-${id}.${format}"`)
  return raw
})
