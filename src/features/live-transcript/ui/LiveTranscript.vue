<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import type { InferenceFrame } from '@/shared/api/contracts/realtime'
import {
  createTranscriptReducer,
  speakerColor,
  speakerLabel,
  type TranscriptState,
} from '../lib/transcript-model'

// Receives the running InferenceFrame stream from useLiveSession. We watch
// the array length and apply only newly appended frames to the reducer.
const props = defineProps<{ frames: InferenceFrame[] }>()

const reducer = createTranscriptReducer()
const state = shallowRef<TranscriptState>(reducer.snapshot())
let applied = 0

watch(
  () => props.frames.length,
  (len) => {
    for (; applied < len; applied++) {
      state.value = reducer.apply(props.frames[applied]!)
    }
  },
  { immediate: true },
)

const scroller = ref<HTMLElement | null>(null)
const pinned = ref(true) // auto-scroll unless the user is hovering/scrolled up

watch(
  state,
  async () => {
    if (!pinned.value) return
    await Promise.resolve()
    const el = scroller.value
    if (el) el.scrollTop = el.scrollHeight
  },
)

function onScroll() {
  const el = scroller.value
  if (!el) return
  // Re-pin only if the user scrolled back to the bottom.
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24
  if (atBottom) pinned.value = true
}

// a11y: announce only the latest finalized line politely (announcing every
// partial would spam a screen reader).
const lastFinal = computed(() => {
  const c = state.value.committed
  return c.length ? c[c.length - 1]!.text : ''
})

const isEmpty = computed(
  () => state.value.committed.length === 0 && !state.value.live,
)
</script>

<template>
  <div class="transcript">
    <div
      ref="scroller"
      class="scroller"
      tabindex="0"
      aria-label="Live transcript"
      @mouseenter="pinned = false"
      @mouseleave="pinned = true"
      @scroll="onScroll"
    >
      <p v-if="isEmpty" class="hint">
        Transcript will appear here as you speak.
      </p>

      <p
        v-for="(turn, i) in state.committed"
        :key="`c-${i}`"
        class="line"
      >
        <span
          class="speaker"
          :style="{ color: speakerColor(turn.speakerId) }"
        >
          {{ speakerLabel(turn.speakerId) }}
        </span>
        <span class="text final">{{ turn.text }}</span>
      </p>

      <p v-if="state.live" class="line">
        <span
          class="speaker"
          :style="{ color: speakerColor(state.live.speakerId) }"
        >
          {{ speakerLabel(state.live.speakerId) }}
        </span>
        <span class="text partial">{{ state.live.text }}</span>
      </p>
    </div>

    <!-- Polite live region: only the latest finalized line is announced. -->
    <p class="sr-only" role="status" aria-live="polite">{{ lastFinal }}</p>
  </div>
</template>

<style scoped>
.transcript {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
}
.scroller {
  max-height: 22rem;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  scroll-behavior: smooth;
}
.scroller:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}
.line {
  line-height: 1.6;
}
.speaker {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: 0.5rem;
}
.text {
  font-size: 1.0625rem;
}
.text.final {
  color: #111827;
}
.text.partial {
  color: #6b7280;
  font-style: italic;
}
.hint {
  color: #9ca3af;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>
