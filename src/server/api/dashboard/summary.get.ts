// UC-19.11 BFF — single round-trip to compose the dashboard summary.
import { DashboardSummary } from '@/shared/api/contracts/dashboard'
import { businessFetch } from '../../utils/upstream'

export default defineEventHandler(async () => {
  try {
    return await businessFetch('/v1/dashboard/summary', { schema: DashboardSummary })
  } catch {
    // Until the upstream endpoint exists, return a deterministic empty
    // placeholder so the dashboard renders the new-user nudge without a
    // network error. This branch goes away in Sprint 2 once svc-business
    // ships the endpoint.
    return DashboardSummary.parse({
      isNewUser: true,
      cards: [
        { key: 'score', label: 'Overall score', value: 0, unit: '/100', trend: [] },
        { key: 'analyses', label: 'Analyses', value: 0, trend: [] },
        { key: 'streak', label: 'Streak', value: 0, unit: 'days', trend: [] },
        { key: 'listening', label: 'Listening', value: 0, unit: 'min', trend: [] },
      ],
      generatedAt: new Date().toISOString(),
    })
  }
})
