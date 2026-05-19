<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { ref } from 'vue'
import { AppShell } from '@/widgets/app-shell'
import { CoachPlanCard, CoachThread, useCoachPlan } from '@/features/coach-chat'

const threadId = ref(`thread-${Date.now()}`)
const showPlan = ref(true)

const { data: plan, isPending: planLoading, error: planError } = useCoachPlan({
  goal: undefined,
  recent_analyses: [],
})
</script>

<template>
  <AppShell title="AI Coach">
    <div class="coach-layout">
      <aside class="coach-sidebar">
        <div class="sidebar-toggle">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: showPlan }"
            @click="showPlan = true"
          >
            Plan
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: !showPlan }"
            @click="showPlan = false"
          >
            Session
          </button>
        </div>

        <div v-if="showPlan" class="plan-panel">
          <div v-if="planLoading" class="plan-skeleton" aria-label="Loading plan" />
          <p v-else-if="planError" class="plan-error">Could not load coaching plan.</p>
          <CoachPlanCard v-else-if="plan" :plan="plan" />
        </div>

        <div v-else class="session-info">
          <p class="session-hint">
            Your live session feedback will appear here during recording.
          </p>
        </div>
      </aside>

      <main class="coach-main">
        <div class="thread-header">
          <h1 class="thread-title">Coach Chat</h1>
          <button
            type="button"
            class="new-thread-btn"
            @click="threadId = `thread-${Date.now()}`"
          >
            New thread
          </button>
        </div>
        <div class="thread-wrapper">
          <CoachThread :key="threadId" :thread-id="threadId" />
        </div>
      </main>
    </div>
  </AppShell>
</template>

<style scoped>
.coach-layout {
  display: grid;
  grid-template-columns: 22rem 1fr;
  gap: 1.25rem;
  height: calc(100vh - 5rem);
  padding: 1.25rem;
  min-height: 0;
}
.coach-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  overflow-y: auto;
  min-height: 0;
}
.sidebar-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
  gap: 0.25rem;
}
.tab-btn {
  flex: 1;
  border: 0;
  background: transparent;
  border-radius: 0.375rem;
  padding: 0.375rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
}
.tab-btn.active {
  background: #fff;
  color: #111827;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.plan-panel { overflow-y: auto; }
.plan-skeleton {
  height: 24rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.plan-error {
  color: #991b1b;
  font-size: 0.875rem;
  padding: 0.75rem;
}
.session-hint {
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}
.coach-main {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}
.thread-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.thread-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}
.new-thread-btn {
  font-size: 0.8125rem;
  color: #6366f1;
  background: transparent;
  border: 1px solid #e0e7ff;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}
.new-thread-btn:hover { background: #eef2ff; }
.thread-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
