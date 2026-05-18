<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="API & keys">
    <PageStub
      eyebrow="API & keys"
      title="API"
      description="Issue API keys, browse interactive docs, and manage webhooks."
    />
  </AppShell>
</template>
