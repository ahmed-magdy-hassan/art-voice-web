<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Transcripts">
    <PageStub
      eyebrow="Transcript review"
      title="Words you can navigate"
      description="Audio player synced to transcript, speaker filter, search, export. Monospace timecodes; sentence-cased microcopy."
    />
  </AppShell>
</template>
