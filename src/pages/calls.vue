<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Calls">
    <PageStub
      eyebrow="Live call view"
      title="In the moment"
      description="Waveform, live transcript, and coach insights side-by-side. Latency and model badges in the top bar. The whole screen is designed to feel calm under real-time motion."
    />
  </AppShell>
</template>
