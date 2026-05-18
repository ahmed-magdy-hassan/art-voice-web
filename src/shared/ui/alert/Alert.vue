<script setup lang="ts">
// Alert — semantic block with icon + title + body, per the design system.
import { computed } from 'vue'
import { Info, CheckCircle2, AlertTriangle } from 'lucide-vue-next'
import { cn } from '@/shared/lib/cn'

type Tone = 'info' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{ tone?: Tone; title?: string; class?: string }>(),
  { tone: 'info' },
)

const iconFor = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertTriangle,
} as const

const Icon = computed(() => iconFor[props.tone])
const colorVar = computed(() => `var(--${props.tone})`)
</script>

<template>
  <div
    role="alert"
    :class="cn('alert', `alert-${props.tone}`, props.class)"
  >
    <component :is="Icon" :size="16" class="alert-icon" :style="{ color: colorVar }" />
    <div>
      <div v-if="props.title || $slots.title" class="alert-title">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <div class="alert-body"><slot /></div>
    </div>
  </div>
</template>
