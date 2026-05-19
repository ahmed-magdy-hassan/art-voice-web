<script setup lang="ts">
import { CheckCircle2, Circle } from 'lucide-vue-next'
import { useProfileCompleteness } from '../api/use-voice-profile'

const { data, isPending } = useProfileCompleteness()

const score = computed(() => data.value?.score ?? 0)
const fields = computed(() => Object.entries(data.value?.breakdown ?? {}))

// SVG ring params
const RADIUS = 36
const CIRC = 2 * Math.PI * RADIUS
const strokeDash = computed(() => `${(score.value / 100) * CIRC} ${CIRC}`)

function fieldLabel(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const scoreColor = computed(() => {
  if (score.value >= 80) return 'var(--accent)'
  if (score.value >= 50) return 'var(--yellow, #f59e0b)'
  return 'var(--red, #ef4444)'
})
</script>

<template>
  <div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
    <h3 class="mb-4 text-[14px] font-medium">Profile completeness</h3>

    <div v-if="isPending" class="flex gap-6">
      <div class="h-20 w-20 animate-pulse rounded-full bg-[var(--subtle)]" />
      <div class="flex-1 space-y-2">
        <div v-for="i in 4" :key="i" class="h-4 animate-pulse rounded bg-[var(--subtle)]" />
      </div>
    </div>

    <div v-else class="flex items-start gap-6">
      <!-- Ring -->
      <div class="relative shrink-0">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" :r="RADIUS" fill="none" stroke="var(--subtle)" stroke-width="8" />
          <circle
            cx="40" cy="40" :r="RADIUS" fill="none"
            :stroke="scoreColor"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="strokeDash"
            stroke-dashoffset="0"
            transform="rotate(-90 40 40)"
            style="transition: stroke-dasharray 0.4s ease"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[15px] font-semibold tabular-nums">{{ score }}%</span>
        </div>
      </div>

      <!-- Checklist -->
      <ul class="flex-1 space-y-2">
        <li
          v-for="[key, done] in fields"
          :key="key"
          class="flex items-center gap-2 text-[12px]"
          :class="done ? 'text-[var(--fg)]' : 'text-[var(--fg-subtle)]'"
        >
          <CheckCircle2 v-if="done" :size="13" class="shrink-0 text-[var(--accent)]" />
          <Circle v-else :size="13" class="shrink-0" />
          {{ fieldLabel(key) }}
        </li>
      </ul>
    </div>
  </div>
</template>
