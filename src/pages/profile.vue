<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Voice profile">
    <PageStub
      eyebrow="Voice profile"
      title="profile"
      description="Your voice profile: goals, samples, completeness, and consent."
    />
  </AppShell>
</template>
