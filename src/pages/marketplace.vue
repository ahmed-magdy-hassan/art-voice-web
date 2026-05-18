<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Marketplace">
    <PageStub
      eyebrow="Marketplace"
      title="marketplace"
      description="Browse, preview, and license voices from the community."
    />
  </AppShell>
</template>
