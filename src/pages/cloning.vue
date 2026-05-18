<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Voice cloning">
    <PageStub
      eyebrow="Voice cloning"
      title="cloning"
      description="Consent-bound voice clones with revocation and TTS playground."
    />
  </AppShell>
</template>
