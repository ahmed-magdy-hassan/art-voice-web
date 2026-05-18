import { getQuery } from 'h3'
import {
  AnalysisListQuery,
  AnalysisListResponse,
} from '@/shared/api/contracts/analyses'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  // Parse + validate query params at the BFF boundary so the upstream
  // never sees garbage.
  const rawQuery = getQuery(event)
  const parsed = AnalysisListQuery.parse({
    ...rawQuery,
    // Numeric coercion from strings.
    limit: rawQuery.limit ? Number(rawQuery.limit) : undefined,
    minScore: rawQuery.minScore ? Number(rawQuery.minScore) : undefined,
    maxScore: rawQuery.maxScore ? Number(rawQuery.maxScore) : undefined,
  })

  try {
    return await businessFetch('/v1/analyses', {
      method: 'GET',
      headers: serialise(parsed),
      schema: AnalysisListResponse,
    })
  } catch {
    // Empty placeholder until the upstream endpoint lands.
    return AnalysisListResponse.parse({ items: [], nextCursor: null, total: 0 })
  }
})

function serialise(q: typeof AnalysisListQuery._type): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined) out[k] = String(v)
  }
  return out
}
