// UC-19.16 alt-flow 1a — when the signed URL is within `staleBeforeMs` of
// expiry, re-fetch the analysis to get a fresh URL.

const DEFAULT_STALE_BEFORE_MS = 60_000 // 1 minute

export function shouldRefreshAudioUrl(
  expiresAtIso: string,
  now: Date = new Date(),
  staleBeforeMs: number = DEFAULT_STALE_BEFORE_MS,
): boolean {
  const expiresAt = new Date(expiresAtIso).getTime()
  if (Number.isNaN(expiresAt)) return true
  return expiresAt - now.getTime() <= staleBeforeMs
}

export function annotationsBetween<T extends { tStart: number; tEnd: number }>(
  annotations: readonly T[],
  windowStart: number,
  windowEnd: number,
): T[] {
  return annotations.filter((a) => a.tEnd >= windowStart && a.tStart <= windowEnd)
}
