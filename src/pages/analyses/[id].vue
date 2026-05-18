<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { useRoute } from 'vue-router'
import { AppShell } from '@/widgets/app-shell'
import { AnalysisDetail } from '@/features/analysis-detail'

const route = useRoute()
const id = String(route.params.id)
</script>

<template>
  <AppShell title="Analysis">
    <div class="grid gap-6 px-8 py-6">
      <AnalysisDetail :id="id" />
    </div>
  </AppShell>
</template>
