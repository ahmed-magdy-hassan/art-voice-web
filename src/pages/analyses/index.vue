<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { AnalysesList } from '@/features/analyses-list'
</script>

<template>
  <AppShell title="Analyses">
    <div class="grid gap-6 px-8 py-6">
      <AnalysesList />
    </div>
  </AppShell>
</template>
