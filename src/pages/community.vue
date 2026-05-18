<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Community">
    <PageStub
      eyebrow="Community"
      title="community"
      description="Share analyses, follow creators, comment, and learn."
    />
  </AppShell>
</template>
