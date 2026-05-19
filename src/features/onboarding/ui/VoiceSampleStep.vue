<script setup lang="ts">
import AudioRecorder from '@/features/record-audio/ui/AudioRecorder.vue'

const emit = defineEmits<{ done: [] }>()
const recorded = ref(false)

function onRecordDone() {
  recorded.value = true
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-lg bg-[var(--subtle)] p-4 text-[13px] leading-relaxed text-[var(--fg-muted)]">
      Read this prompt aloud at a comfortable pace:<br />
      <span class="mt-2 block font-medium text-[var(--fg)]">
        "The quick brown fox jumps over the lazy dog. In 2026, artificial intelligence is transforming how we communicate and connect with one another across every industry and culture."
      </span>
    </div>

    <AudioRecorder label="Onboarding baseline" @done="onRecordDone" />

    <button
      type="button"
      class="btn btn-primary w-full"
      :disabled="!recorded"
      @click="emit('done')"
    >
      Use this recording
    </button>

    <p v-if="!recorded" class="text-center text-[11px] text-[var(--fg-subtle)]">
      Record a sample above first
    </p>
  </div>
</template>
