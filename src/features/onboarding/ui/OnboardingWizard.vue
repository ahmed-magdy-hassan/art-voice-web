<script setup lang="ts">
import { Check, ChevronRight, Waves } from 'lucide-vue-next'
import { useOnboarding, useAdvanceOnboarding } from '../api/use-onboarding'
import { STEPS, ORDERED_STEPS } from '../lib/steps'
import type { OnboardingStep } from '@/shared/api/contracts/onboarding'
import ProfileBasicsStep from './ProfileBasicsStep.vue'
import VoiceSampleStep from './VoiceSampleStep.vue'
import GoalsStep from './GoalsStep.vue'
import ConsentStep from './ConsentStep.vue'

const router = useRouter()
const { data, isPending } = useOnboarding()
const { mutate: advance, isPending: advancing } = useAdvanceOnboarding()

const activeIndex = computed(() => {
  if (!data.value) return 0
  const idx = ORDERED_STEPS.indexOf(data.value.currentStep)
  return idx === -1 ? 0 : idx
})

const activeStep = computed(() => STEPS[activeIndex.value])

function isCompleted(step: OnboardingStep) {
  return data.value?.completedSteps.some((r) => r.step === step) ?? false
}

// Called by step components that handle their own save (e.g. ProfileBasicsStep).
// Also called directly for steps that have no form (COMPLETE).
function onStepDone() {
  if (!activeStep.value) return
  if (activeStep.value.key === 'COMPLETE') {
    router.push('/dashboard')
    return
  }
  advance(activeStep.value.key, {
    onSuccess: (next) => {
      if (next.isComplete) router.push('/dashboard')
    },
  })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 py-12">
    <!-- Logo -->
    <div class="mb-10 flex items-center gap-2">
      <Waves :size="24" class="text-[var(--accent)]" />
      <span class="text-[18px] font-semibold tracking-tight">Art Voice</span>
    </div>

    <!-- Step rail -->
    <div class="mb-8 flex items-center gap-0">
      <template v-for="(step, i) in STEPS" :key="step.key">
        <div class="flex items-center gap-2">
          <div
            class="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-colors"
            :class="
              isCompleted(step.key)
                ? 'bg-[var(--accent)] text-white'
                : i === activeIndex
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--subtle)] text-[var(--fg-muted)]'
            "
          >
            <Check v-if="isCompleted(step.key) && i !== activeIndex" :size="12" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span
            class="hidden text-[12px] sm:inline"
            :class="i === activeIndex ? 'font-medium text-[var(--fg)]' : 'text-[var(--fg-subtle)]'"
          >
            {{ step.label }}
          </span>
        </div>
        <ChevronRight v-if="i < STEPS.length - 1" :size="14" class="mx-2 text-[var(--border)]" />
      </template>
    </div>

    <!-- Card -->
    <div
      v-if="!isPending && activeStep"
      class="w-full max-w-[520px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm"
    >
      <div class="t-caps mb-2">Step {{ activeIndex + 1 }} of {{ STEPS.length }}</div>
      <h1 class="t-display mb-2" style="font-size: 28px; line-height: 1.15">
        {{ activeStep.title }}
      </h1>
      <p class="mb-8 text-[14px] leading-relaxed text-[var(--fg-muted)]">
        {{ activeStep.description }}
      </p>

      <!-- Each step owns its UI and emits done when ready to advance -->
      <ProfileBasicsStep v-if="activeStep.key === 'PROFILE_BASICS'" @done="onStepDone" />
      <VoiceSampleStep  v-else-if="activeStep.key === 'VOICE_SAMPLE'" @done="onStepDone" />
      <GoalsStep        v-else-if="activeStep.key === 'GOALS'" @done="onStepDone" />
      <ConsentStep      v-else-if="activeStep.key === 'CONSENT'" @done="onStepDone" />

      <!-- COMPLETE — just a CTA to go to dashboard -->
      <template v-else-if="activeStep.key === 'COMPLETE'">
        <div class="flex justify-end">
          <button type="button" class="btn btn-primary" :disabled="advancing" @click="onStepDone">
            {{ advancing ? 'Loading…' : activeStep.cta }}
          </button>
        </div>
      </template>
    </div>

    <!-- Loading -->
    <div v-else class="h-[300px] w-full max-w-[520px] animate-pulse rounded-xl bg-[var(--subtle)]" />
  </div>
</template>
