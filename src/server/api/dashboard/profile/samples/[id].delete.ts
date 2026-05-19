// KAN-281 — Delete a voice sample.
import { businessFetch, contextHeaders } from '../../../../utils/upstream'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await businessFetch(`/v1/dashboard/profile/samples/${id}`, {
    method: 'DELETE',
    headers: contextHeaders(event),
  })
  return { ok: true }
})
