// KAN-263 — Last 5 notifications for the topbar bell popover.
import { NotificationsResponse } from '@/shared/api/contracts/dashboard'
import { businessFetch, contextHeaders } from '../../utils/upstream'

export default defineEventHandler(async (event) => {
  try {
    return await businessFetch<unknown>('/v1/dashboard/notifications?limit=5', {
      headers: contextHeaders(event),
      schema: NotificationsResponse,
    })
  } catch {
    return NotificationsResponse.parse({ items: [], unreadCount: 0, nextCursor: null })
  }
})
