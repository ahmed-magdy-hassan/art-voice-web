<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { LiveSession } from '@/features/live-session'
import { LiveTranscript } from '@/features/live-transcript'
import { CoachSuggestions } from '@/features/live-coach'
</script>

<template>
  <AppShell title="Live sessions">
    <div class="live-page">
      <header class="intro">
        <p class="eyebrow">Live sessions</p>
        <h1>Live</h1>
        <p class="desc">
          Run a live, coached voice session with real-time transcription.
        </p>
      </header>
      <LiveSession>
        <template #transcript="{ frames }">
          <LiveTranscript :frames="frames" />
          <CoachSuggestions :frames="frames" />
        </template>
      </LiveSession>
    </div>
  </AppShell>
</template>

<style scoped>
.live-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 48rem;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: #6b7280;
}
.intro h1 {
  font-family: 'Instrument Serif', serif;
  font-size: 2.5rem;
  line-height: 1.1;
}
.desc {
  color: #6b7280;
}
</style>
