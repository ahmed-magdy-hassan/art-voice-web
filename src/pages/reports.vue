<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Reports">
    <PageStub
      eyebrow="Reports"
      title="reports"
      description="Scheduled email and PDF reports for you and your team."
    />
  </AppShell>
</template>
