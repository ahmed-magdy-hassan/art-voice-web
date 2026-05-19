<script setup lang="ts">
import { Mic, Square, CheckCircle, AlertCircle, Loader } from 'lucide-vue-next'
import { useRecordAudio } from '../model/use-record-audio'

const props = defineProps<{ label?: string }>()
const emit = defineEmits<{ done: [] }>()

const { state, levelDb, durationSec, errorMessage, start, stop } = useRecordAudio(props.label)

watch(state, (s) => { if (s === 'done') emit('done') })

const DB_FLOOR = -60
const DB_CEIL = 0
const BAR_COUNT = 24

// Map levelDb to 0–1 fill for each bar
const bars = computed(() => {
  const norm = (levelDb.value - DB_FLOOR) / (DB_CEIL - DB_FLOOR)
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const threshold = i / BAR_COUNT
    return norm > threshold
  })
})

function formatDuration(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
    <!-- Level meter -->
    <div class="flex h-10 items-end gap-[3px]">
      <div
        v-for="(active, i) in bars"
        :key="i"
        class="w-[6px] rounded-sm transition-colors duration-75"
        :style="{
          height: `${30 + (i / BAR_COUNT) * 70}%`,
          background: active
            ? i > BAR_COUNT * 0.8
              ? 'var(--red, #ef4444)'
              : i > BAR_COUNT * 0.6
                ? 'var(--yellow, #f59e0b)'
                : 'var(--accent)'
            : 'var(--subtle)',
        }"
      />
    </div>

    <!-- Timer -->
    <div class="font-mono text-[24px] font-semibold tabular-nums text-[var(--fg)]">
      {{ formatDuration(durationSec) }}
    </div>

    <!-- Status message -->
    <p class="text-[13px] text-[var(--fg-muted)]">
      <template v-if="state === 'idle'">Press record to start</template>
      <template v-else-if="state === 'requesting'">Requesting microphone…</template>
      <template v-else-if="state === 'recording'">Recording — speak clearly</template>
      <template v-else-if="state === 'uploading'">Uploading…</template>
      <template v-else-if="state === 'done'">Saved successfully</template>
      <template v-else-if="state === 'error'">{{ errorMessage }}</template>
    </p>

    <!-- Controls -->
    <div class="flex gap-3">
      <button
        v-if="state === 'idle' || state === 'error'"
        type="button"
        class="btn btn-primary flex items-center gap-2"
        @click="start"
      >
        <Mic :size="14" />
        Record
      </button>

      <button
        v-if="state === 'recording'"
        type="button"
        class="btn btn-danger flex items-center gap-2"
        @click="stop"
      >
        <Square :size="14" />
        Stop
      </button>

      <div v-if="state === 'uploading'" class="flex items-center gap-2 text-[13px] text-[var(--fg-muted)]">
        <Loader :size="14" class="animate-spin" />
        Uploading…
      </div>

      <div v-if="state === 'done'" class="flex items-center gap-2 text-[13px] text-[var(--accent)]">
        <CheckCircle :size="14" />
        Done
      </div>

      <div v-if="state === 'error'" class="flex items-center gap-2 text-[13px] text-red-500">
        <AlertCircle :size="14" />
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
