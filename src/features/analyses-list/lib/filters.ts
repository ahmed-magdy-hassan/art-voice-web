import type { AnalysisListQuery } from '@/shared/api/contracts/analyses'

export const DEFAULT_FILTERS: AnalysisListQuery = {
  sort: 'date_desc',
  limit: 50,
}

export function withFilter<K extends keyof AnalysisListQuery>(
  current: AnalysisListQuery,
  key: K,
  value: AnalysisListQuery[K] | undefined,
): AnalysisListQuery {
  const next = { ...current }
  if (value === undefined || value === '' || value === null) {
    delete next[key]
  } else {
    next[key] = value
  }
  // Changing any filter resets the cursor (UC-19.15 alt-flow 2a — pagination
  // preserves filters; conversely changing filters drops the cursor).
  delete next.cursor
  return next
}

export function clampScoreRange(min?: number, max?: number): [number?, number?] {
  let a = min
  let b = max
  if (a !== undefined && b !== undefined && a > b) {
    ;[a, b] = [b, a]
  }
  return [a, b]
}
