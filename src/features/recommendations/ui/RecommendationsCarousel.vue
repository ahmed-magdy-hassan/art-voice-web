<script setup lang="ts">
import { ref } from 'vue'
import type { RecommendedExercise } from '@/shared/api/contracts/reco'

const props = defineProps<{
  recommendations: RecommendedExercise[]
  loading?: boolean
}>()

const emit = defineEmits<{
  start: [exerciseId: string]
}>()

const activeIdx = ref(0)

function prev() {
  activeIdx.value = Math.max(0, activeIdx.value - 1)
}
function next() {
  activeIdx.value = Math.min(props.recommendations.length - 1, activeIdx.value + 1)
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pace:              { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  filler_reduction:  { bg: '#fef9c3', text: '#92400e', dot: '#f59e0b' },
  articulation:      { bg: '#eff6ff', text: '#1e40af', dot: '#60a5fa' },
  emotion_range:     { bg: '#fdf4ff', text: '#7e22ce', dot: '#c084fc' },
  volume:            { bg: '#fff7ed', text: '#9a3412', dot: '#fb923c' },
  breathing:         { bg: '#ecfdf5', text: '#065f46', dot: '#34d399' },
  confidence:        { bg: '#f0f9ff', text: '#075985', dot: '#38bdf8' },
}

function colors(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: '#f9fafb', text: '#374151', dot: '#9ca3af' }
}

function difficultyLabel(d: number) {
  return ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'][d] ?? d
}
</script>

<template>
  <section class="carousel" aria-label="Recommended exercises">
    <header class="carousel-header">
      <h2 class="carousel-title">Recommended for you</h2>
      <div class="nav" role="group" aria-label="Carousel navigation">
        <button type="button" class="nav-btn" :disabled="activeIdx === 0" aria-label="Previous" @click="prev">‹</button>
        <span class="counter" aria-live="polite">{{ activeIdx + 1 }} / {{ recommendations.length }}</span>
        <button type="button" class="nav-btn" :disabled="activeIdx === recommendations.length - 1" aria-label="Next" @click="next">›</button>
      </div>
    </header>

    <div v-if="loading" class="skeleton" aria-label="Loading recommendations" />

    <TransitionGroup v-else name="slide" tag="div" class="cards-viewport">
      <article
        v-for="(rec, i) in recommendations"
        v-show="i === activeIdx"
        :key="rec.exercise.exercise_id"
        class="card"
        :style="{ background: colors(rec.exercise.category).bg }"
        role="listitem"
      >
        <div class="card-top">
          <div class="category-chip" :style="{ color: colors(rec.exercise.category).text }">
            <span class="dot" :style="{ background: colors(rec.exercise.category).dot }" />
            {{ rec.exercise.category.replace('_', ' ') }}
          </div>
          <div class="score-badge" :title="`Relevance score: ${(rec.score * 100).toFixed(0)}%`">
            {{ (rec.score * 100).toFixed(0) }}% match
          </div>
        </div>

        <h3 class="card-title">{{ rec.exercise.title }}</h3>
        <p class="card-desc">{{ rec.exercise.description }}</p>
        <p class="card-rationale">{{ rec.rationale }}</p>

        <div class="card-meta">
          <span class="meta-chip">{{ rec.exercise.duration_minutes }}min</span>
          <span class="meta-chip">{{ difficultyLabel(rec.exercise.difficulty) }}</span>
        </div>

        <button
          type="button"
          class="action-btn"
          :style="{ background: colors(rec.exercise.category).dot, color: '#fff' }"
          @click="emit('start', rec.exercise.exercise_id)"
        >
          {{ rec.action_label }}
        </button>
      </article>
    </TransitionGroup>

    <div class="dots" role="tablist" aria-label="Exercise pages">
      <button
        v-for="(_, i) in recommendations"
        :key="i"
        type="button"
        role="tab"
        :aria-selected="i === activeIdx"
        class="dot-btn"
        :class="{ active: i === activeIdx }"
        :aria-label="`Exercise ${i + 1}`"
        @click="activeIdx = i"
      />
    </div>
  </section>
</template>

<style scoped>
.carousel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.carousel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}
.carousel-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #111827;
}
.nav { display: flex; align-items: center; gap: 0.5rem; }
.nav-btn {
  width: 2rem;
  height: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 1.125rem;
  cursor: pointer;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.nav-btn:not(:disabled):hover { background: #f9fafb; }
.counter { font-size: 0.8125rem; color: #6b7280; min-width: 3rem; text-align: center; }
.skeleton {
  height: 14rem;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.cards-viewport { position: relative; min-height: 14rem; }
.card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.card-top { display: flex; align-items: center; justify-content: space-between; }
.category-chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: capitalize;
}
.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}
.score-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background: rgba(255,255,255,0.7);
  border-radius: 999px;
  padding: 0.125rem 0.5rem;
}
.card-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #111827;
}
.card-desc {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.55;
}
.card-rationale {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}
.card-meta { display: flex; gap: 0.375rem; }
.meta-chip {
  font-size: 0.6875rem;
  font-weight: 500;
  background: rgba(255,255,255,0.7);
  border-radius: 999px;
  padding: 0.125rem 0.5rem;
  color: #374151;
}
.action-btn {
  align-self: flex-start;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.25rem;
}
.action-btn:hover { filter: brightness(0.92); }
.dots {
  display: flex;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.75rem;
  border-top: 1px solid #f3f4f6;
}
.dot-btn {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #d1d5db;
  border: 0;
  cursor: pointer;
  transition: background 0.2s;
}
.dot-btn.active { background: #6366f1; }
.slide-enter-active, .slide-leave-active { transition: opacity 0.2s; }
.slide-enter-from, .slide-leave-to { opacity: 0; }
</style>
