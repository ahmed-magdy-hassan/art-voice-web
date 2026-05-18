<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Compare">
    <PageStub
      eyebrow="Compare"
      title="compare"
      description="Side-by-side comparison of two analyses or two cloned voices."
    />
  </AppShell>
</template>
