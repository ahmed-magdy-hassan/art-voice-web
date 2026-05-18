// KAN-342 — Propagate or generate x-request-id on every Nitro request.
// Downstream calls via businessFetch() can forward event.context.requestId.
import { randomUUID } from 'node:crypto'
import { getHeader, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const existing = getHeader(event, 'x-request-id') ?? randomUUID()
  event.context.requestId = existing
  setHeader(event, 'x-request-id', existing)
})
