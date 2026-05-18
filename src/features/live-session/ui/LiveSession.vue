<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/shared/ui'
import { useLiveSession } from '../model/use-live-session'

const {
  status,
  error,
  consentToRecord,
  lastFrame,
  frames,
  start,
  stop,
} = useLiveSession()

const isLive = computed(() => status.value === 'live')
const isBusy = computed(
  () => status.value === 'connecting' || status.value === 'ending',
)
const statusLabel = computed(() => {
  switch (status.value) {
    case 'idle':
      return 'Ready'
    case 'connecting':
      return 'Connecting…'
    case 'live':
      return 'Live'
    case 'ending':
      return 'Finishing…'
    case 'ended':
      return 'Session ended'
    case 'error':
      return 'Error'
  }
})
</script>

<template>
  <section class="live-session" aria-label="Live analysis session">
    <header class="row">
      <span
        class="pill"
        :class="status"
        role="status"
        aria-live="polite"
      >
        <span class="dot" />
        {{ statusLabel }}
      </span>

      <div class="actions">
        <Button
          v-if="!isLive"
          :disabled="isBusy"
          @click="start"
        >
          Start live session
        </Button>
        <Button
          v-else
          variant="destructive"
          :disabled="isBusy"
          @click="stop"
        >
          End session
        </Button>
      </div>
    </header>

    <label class="consent">
      <input
        type="checkbox"
        v-model="consentToRecord"
        :disabled="isLive || isBusy"
      />
      <span>
        Record this session for later review
        <small>Off by default. Live transcription works either way.</small>
      </span>
    </label>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <!-- KAN-286 renders the incremental transcript via this slot, fed the
         running frame stream. Fallback shows the latest partial only. -->
    <slot name="transcript" :frame="lastFrame" :frames="frames">
      <p v-if="lastFrame" class="latest">{{ lastFrame.partialTranscript }}</p>
      <p v-else class="hint">
        Start a session and speak — transcription appears here.
      </p>
    </slot>
  </section>
</template>

<style scoped>
.live-session {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}
.pill .dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: currentColor;
}
.pill.live {
  color: #16a34a;
}
.pill.error {
  color: #dc2626;
}
.pill.idle,
.pill.ended {
  color: #6b7280;
}
.consent {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.875rem;
}
.consent small {
  display: block;
  color: #6b7280;
}
.error {
  color: #dc2626;
  font-size: 0.875rem;
}
.latest {
  font-size: 1.125rem;
  line-height: 1.5;
}
.hint {
  color: #6b7280;
}
</style>
