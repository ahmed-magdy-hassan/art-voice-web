<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Analytics">
    <PageStub
      eyebrow="Analytics"
      title="Patterns over noise"
      description="Dense tables and the eight-colour data-viz palette. Editorial typography on the headlines, mono on the numbers."
    />
  </AppShell>
</template>
