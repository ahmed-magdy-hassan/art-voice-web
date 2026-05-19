<script setup lang="ts">
import type { CoachingPlan, CoachingStep } from '@/shared/api/contracts/coach'

defineProps<{ plan: CoachingPlan }>()

const METRIC_LABELS: Record<string, string> = {
  pace: 'Pace',
  filler_ratio: 'Filler words',
  articulation: 'Articulation',
  emotion_range: 'Emotion range',
  valence: 'Valence',
  arousal: 'Energy',
  talk_listen_ratio: 'Talk/listen',
  volume_consistency: 'Volume',
}
</script>

<template>
  <section class="plan-card">
    <header class="plan-header">
      <h2 class="plan-title">Your Coaching Plan</h2>
      <span v-if="plan.cache_hit" class="cache-badge" title="Served from cache">cached</span>
    </header>

    <p class="plan-summary">{{ plan.summary }}</p>

    <div class="plan-columns">
      <div>
        <h3 class="col-heading">Strengths</h3>
        <ul class="bullet-list green">
          <li v-for="s in plan.strengths" :key="s">{{ s }}</li>
        </ul>
      </div>
      <div>
        <h3 class="col-heading">Focus areas</h3>
        <ul class="bullet-list amber">
          <li v-for="a in plan.improvement_areas" :key="a">{{ a }}</li>
        </ul>
      </div>
    </div>

    <ol class="steps">
      <li v-for="step in plan.steps" :key="step.order" class="step">
        <span class="step-num">{{ step.order }}</span>
        <div class="step-body">
          <p class="step-title">{{ step.title }}</p>
          <p class="step-desc">{{ step.description }}</p>
          <blockquote class="step-exercise">{{ step.exercise }}</blockquote>
          <div class="step-meta">
            <span class="badge">{{ step.duration_minutes }}min</span>
            <span class="badge focus">{{ METRIC_LABELS[step.focus_metric] ?? step.focus_metric }}</span>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.plan-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
}
.plan-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.plan-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}
.cache-badge {
  font-size: 0.6875rem;
  font-weight: 500;
  background: #ede9fe;
  color: #7c3aed;
  border-radius: 999px;
  padding: 0.125rem 0.5rem;
}
.plan-summary {
  color: #4b5563;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.plan-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.col-heading {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  margin-bottom: 0.375rem;
}
.bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.bullet-list li::before {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  vertical-align: middle;
  content: '';
}
.bullet-list.green li::before { background: #10b981; }
.bullet-list.amber li::before { background: #f59e0b; }
.bullet-list li {
  font-size: 0.9375rem;
  color: #374151;
  margin-bottom: 0.25rem;
}
.steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.step {
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
}
.step-num {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-body { flex: 1; }
.step-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
}
.step-desc {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.375rem;
}
.step-exercise {
  font-size: 0.875rem;
  font-style: italic;
  color: #1d4ed8;
  background: #eff6ff;
  border-left: 3px solid #93c5fd;
  padding: 0.375rem 0.75rem;
  border-radius: 0 0.375rem 0.375rem 0;
  margin-bottom: 0.375rem;
}
.step-meta {
  display: flex;
  gap: 0.375rem;
}
.badge {
  font-size: 0.6875rem;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;
  border-radius: 999px;
  padding: 0.125rem 0.5rem;
}
.badge.focus {
  background: #dbeafe;
  color: #1e40af;
}
</style>
