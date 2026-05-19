import { NotificationsResponse } from '@/shared/api/contracts/dashboard'
import { businessFetch, contextHeaders } from '../../../utils/upstream'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { cursor, limit = '20', unreadOnly } = getQuery(event)

  const qs = new URLSearchParams()
  qs.set('limit', String(Math.min(parseInt(String(limit), 10) || 20, 100)))
  if (cursor) qs.set('cursor', String(cursor))
  if (unreadOnly === 'true') qs.set('unreadOnly', 'true')

  return await businessFetch<unknown>(`/v1/dashboard/notifications?${qs}`, {
    headers: contextHeaders(event),
    schema: NotificationsResponse,
  })
})
