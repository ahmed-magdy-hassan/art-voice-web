<script setup lang="ts">
import { CheckCircle2, Circle, XCircle, Loader2, MinusCircle } from 'lucide-vue-next'
import { usePipelineStatus } from '../api/use-pipeline-status'

const props = defineProps<{ analysisId: string }>()
const { data, isPending, isError } = usePipelineStatus(computed(() => props.analysisId))

function stepIcon(status: string) {
  switch (status) {
    case 'DONE': return CheckCircle2
    case 'FAILED': return XCircle
    case 'RUNNING': return Loader2
    case 'SKIPPED': return MinusCircle
    default: return Circle
  }
}

function stepColor(status: string) {
  switch (status) {
    case 'DONE': return 'text-[var(--accent)]'
    case 'FAILED': return 'text-red-500'
    case 'RUNNING': return 'text-[var(--fg-muted)]'
    case 'SKIPPED': return 'text-[var(--fg-subtle)]'
    default: return 'text-[var(--border)]'
  }
}

function stepLabel(step: string) {
  return step.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function elapsed(start: string | null, end: string | null): string {
  if (!start) return ''
  const ms = new Date(end ?? new Date()).getTime() - new Date(start).getTime()
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

const overallBadgeClass = computed(() => {
  switch (data.value?.overallStatus) {
    case 'DONE': return 'bg-[var(--accent)] text-white'
    case 'FAILED': return 'bg-red-500 text-white'
    case 'RUNNING': return 'bg-[var(--subtle)] text-[var(--fg-muted)] animate-pulse'
    default: return 'bg-[var(--subtle)] text-[var(--fg-subtle)]'
  }
})
</script>

<template>
  <div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-[14px] font-medium">Analysis pipeline</h3>
      <span
        v-if="data"
        class="rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize"
        :class="overallBadgeClass"
      >
        {{ data.overallStatus.toLowerCase() }}
      </span>
    </div>

    <div v-if="isPending" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-8 animate-pulse rounded bg-[var(--subtle)]" />
    </div>

    <div v-else-if="isError || !data" class="text-[13px] text-[var(--fg-subtle)]">
      Unable to load pipeline status.
    </div>

    <ol v-else class="relative space-y-0">
      <li
        v-for="(event, i) in data.events"
        :key="event.step"
        class="relative flex gap-4 pb-4"
      >
        <!-- Connector line -->
        <div
          v-if="i < data.events.length - 1"
          class="absolute left-[9px] top-[20px] h-full w-[2px] bg-[var(--border)]"
        />

        <!-- Icon -->
        <component
          :is="stepIcon(event.status)"
          :size="20"
          class="relative z-10 mt-[2px] shrink-0"
          :class="[stepColor(event.status), event.status === 'RUNNING' ? 'animate-spin' : '']"
        />

        <div class="flex-1">
          <div class="flex items-baseline justify-between gap-2">
            <span class="text-[13px] font-medium">{{ stepLabel(event.step) }}</span>
            <span class="text-[11px] text-[var(--fg-subtle)] tabular-nums">
              {{ elapsed(event.startedAt, event.finishedAt) }}
            </span>
          </div>
          <p v-if="event.errorMessage" class="mt-0.5 text-[11px] text-red-500">
            {{ event.errorMessage }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
