<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Voice Studio">
    <PageStub
      eyebrow="Voice clone studio"
      title="Train · preview · publish"
      description="Upload reference audio, watch training progress, preview the clone, and ship it to production with a destructive confirm."
    />
  </AppShell>
</template>
