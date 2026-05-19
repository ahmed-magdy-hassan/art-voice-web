<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { RecommendationsCarousel, useRecommendations } from '@/features/recommendations'

const { data, isPending } = useRecommendations({ max_results: 8 })

function onStartExercise(exerciseId: string) {
  navigateTo(`/exercises/${exerciseId}`)
}
</script>

<template>
  <AppShell title="Exercises">
    <div class="exercises-page">
      <div class="page-header">
        <h1 class="page-title">Exercises</h1>
        <p class="page-subtitle">Targeted drills personalised to your recent sessions.</p>
      </div>

      <RecommendationsCarousel
        :recommendations="data?.recommendations ?? []"
        :loading="isPending"
        @start="onStartExercise"
      />

      <section v-if="!isPending && data?.recommendations?.length === 0" class="empty">
        <p>Complete a voice analysis first to get personalised exercise recommendations.</p>
        <a href="/upload" class="cta-link">Record or upload a session →</a>
      </section>
    </div>
  </AppShell>
</template>

<style scoped>
.exercises-page {
  padding: 1.5rem;
  max-width: 52rem;
}
.page-header { margin-bottom: 1.5rem; }
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}
.page-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
}
.empty {
  margin-top: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.9375rem;
}
.cta-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #6366f1;
  font-weight: 500;
}
</style>
