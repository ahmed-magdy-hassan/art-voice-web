// KAN-279 — Profile completeness score + field breakdown.
import { ProfileCompleteness } from '@/shared/api/contracts/profile'
import { businessFetch, contextHeaders } from '../../../utils/upstream'

export default defineEventHandler(async (event) => {
  return await businessFetch<unknown>('/v1/dashboard/profile/completeness', {
    headers: contextHeaders(event),
    schema: ProfileCompleteness,
  })
})
