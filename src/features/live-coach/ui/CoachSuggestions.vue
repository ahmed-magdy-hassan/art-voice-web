<script setup lang="ts">
import type { InferenceFrame } from '@/shared/api/contracts/realtime'
import { toRef } from 'vue'
import { useLiveCoach } from '../model/use-live-coach'

const props = defineProps<{ frames: InferenceFrame[] }>()
const { suggestions, degraded, dismiss } = useLiveCoach(
  toRef(props, 'frames'),
)

const ICON: Record<string, string> = {
  pace: '🐢',
  filler: '✂️',
  energy: '⚡',
  pause: '⏸️',
}
</script>

<template>
  <!-- Non-modal, pointer-events:none on the container so it never blocks
       input (UC-19.27); only the cards themselves are interactive. -->
  <div class="coach-layer" aria-live="polite" aria-label="Coach suggestions">
    <p v-if="degraded" class="degraded">
      Live coaching unavailable — you’ll get full feedback after the session.
    </p>

    <TransitionGroup name="card" tag="div" class="stack">
      <article
        v-for="s in suggestions"
        :key="s.id"
        class="card"
        :data-kind="s.kind"
      >
        <span class="icon" aria-hidden="true">{{ ICON[s.kind] }}</span>
        <p class="text">{{ s.text }}</p>
        <button
          type="button"
          class="dismiss"
          aria-label="Dismiss suggestion"
          @click="dismiss(s.id)"
        >
          ×
        </button>
      </article>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.coach-layer {
  position: sticky;
  bottom: 1rem;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.degraded {
  pointer-events: auto;
  font-size: 0.8125rem;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}
.card {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  max-width: 22rem;
  background: #111827;
  color: #f9fafb;
  border-radius: 0.625rem;
  padding: 0.75rem 0.875rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.card[data-kind='filler'] {
  background: #1e3a8a;
}
.card[data-kind='pace'] {
  background: #065f46;
}
.card[data-kind='energy'] {
  background: #7c2d12;
}
.icon {
  font-size: 1.1rem;
  line-height: 1.4;
}
.text {
  flex: 1;
  font-size: 0.9375rem;
  line-height: 1.4;
}
.dismiss {
  background: transparent;
  border: 0;
  color: inherit;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
}
.dismiss:hover {
  opacity: 1;
}
.card-enter-active,
.card-leave-active {
  transition: all 0.25s ease;
}
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
