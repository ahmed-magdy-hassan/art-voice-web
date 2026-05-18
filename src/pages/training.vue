<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Training plan">
    <PageStub
      eyebrow="Training plan"
      title="training"
      description="Track your weekly goal, streak, and exercise history."
    />
  </AppShell>
</template>
