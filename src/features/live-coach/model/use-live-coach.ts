import { onScopeDispose, ref, watch, type Ref } from 'vue'
import type { InferenceFrame } from '@/shared/api/contracts/realtime'
import {
  HeuristicCoachSource,
  type CoachSuggestion,
  type CoachSuggestionSource,
} from '../lib/coach-source'

/**
 * KAN-287 — surfaces ephemeral coach suggestions from the live frame stream.
 * Cards auto-expire after their ttl and can be dismissed manually; the list
 * is capped so it never grows unbounded or dominates the UI (UC-19.27:
 * suggestions never block input — enforced visually in the card component).
 *
 * `source` defaults to the heuristic adapter; swap for a WS-backed
 * CoachSuggestionSource when ai-coach lands.
 */
export function useLiveCoach(
  frames: Ref<InferenceFrame[]>,
  source: CoachSuggestionSource = new HeuristicCoachSource(),
) {
  const suggestions = ref<CoachSuggestion[]>([])
  const degraded = ref(!source.healthy)
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const MAX_VISIBLE = 3
  let applied = 0

  function dismiss(id: string): void {
    suggestions.value = suggestions.value.filter((s) => s.id !== id)
  }

  function push(s: CoachSuggestion): void {
    suggestions.value = [...suggestions.value, s].slice(-MAX_VISIBLE)
    const timer = setTimeout(() => {
      dismiss(s.id)
      timers.delete(timer)
    }, s.ttlMs)
    timers.add(timer)
  }

  watch(
    () => frames.value.length,
    (len) => {
      for (; applied < len; applied++) {
        const frame = frames.value[applied]
        if (!frame) continue
        const s = source.observe(frame)
        if (s) push(s)
      }
      degraded.value = !source.healthy
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    timers.forEach((t) => clearTimeout(t))
    timers.clear()
  })

  return { suggestions, degraded, dismiss }
}
