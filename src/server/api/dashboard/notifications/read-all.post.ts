import { businessFetch, contextHeaders } from '../../../utils/upstream'

export default defineEventHandler(async (event) => {
  return await businessFetch<unknown>('/v1/dashboard/notifications/read-all', {
    method: 'POST',
    headers: contextHeaders(event),
  })
})
