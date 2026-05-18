<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Queue">
    <PageStub
      eyebrow="Queue"
      title="What's next"
      description="Scheduled calls with topic, owner, and status pills. Click to enter the live call view."
    />
  </AppShell>
</template>
