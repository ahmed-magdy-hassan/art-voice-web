<script setup lang="ts">
// Banner — full-width inline notice (page/section level), per design system.
import { computed } from 'vue'
import { Info, AlertTriangle } from 'lucide-vue-next'
import { cn } from '@/shared/lib/cn'

type Tone = 'info' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{ tone?: Tone; class?: string }>(),
  { tone: 'info' },
)

const Icon = computed(() => (props.tone === 'info' ? Info : AlertTriangle))
</script>

<template>
  <div
    :class="cn('banner', `banner-${props.tone}`, props.class)"
    style="border-radius: var(--r-2); border-width: 1px; border-style: solid"
  >
    <component :is="Icon" :size="14" />
    <span><slot /></span>
  </div>
</template>
