<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Exercises">
    <PageStub
      eyebrow="Exercises"
      title="exercises"
      description="Catalogue of targeted drills with metronome and metric tracking."
    />
  </AppShell>
</template>
