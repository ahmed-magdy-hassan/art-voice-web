// KAN-263 — Mark a single notification as read.
import { businessFetch, contextHeaders } from '../../../../utils/upstream'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await businessFetch(`/v1/dashboard/notifications/${id}/read`, {
    method: 'POST',
    headers: contextHeaders(event),
  })
  return { ok: true }
})
