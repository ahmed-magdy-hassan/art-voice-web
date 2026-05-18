<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  ms: number
}
const props = defineProps<Props>()

const tone = computed<'good' | 'warn' | 'bad'>(() => {
  if (props.ms > 300) return 'bad'
  if (props.ms > 250) return 'warn'
  return 'good'
})
const dotColor = computed(() => ({
  good: 'var(--success)',
  warn: 'var(--warning)',
  bad: 'var(--danger)',
}[tone.value]))
</script>

<template>
  <span :class="['latency-badge', tone]">
    <span class="dot" :style="{ background: dotColor }" />
    {{ ms }}
  </span>
</template>
