<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="AI Coach">
    <PageStub
      eyebrow="AI Coach"
      title="coach"
      description="Threaded conversation with the AI coach and weekly reports."
    />
  </AppShell>
</template>
