<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { useRoute } from 'vue-router'
import { AppShell } from '@/widgets/app-shell'
import { AnalysisDetail } from '@/features/analysis-detail'
import { VoiceRadarChart } from '@/features/voice-radar'
import { PipelineTimeline } from '@/features/pipeline-status'
import { ExportButton } from '@/features/export-analysis'

const route = useRoute()
const id = String(route.params.id)
</script>

<template>
  <AppShell title="Analysis">
    <template #top-right>
      <ExportButton :analysis-id="id" />
    </template>

    <div class="grid gap-6 px-8 py-6">
      <AnalysisDetail :id="id" />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <VoiceRadarChart :analysis-id="id" />
        <PipelineTimeline :analysis-id="id" />
      </div>
    </div>
  </AppShell>
</template>
