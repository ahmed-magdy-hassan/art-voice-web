<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: number
  height?: number
  bars?: number
  seed?: number
  color?: string
  playedRatio?: number
}
const props = withDefaults(defineProps<Props>(), {
  width: 240,
  height: 36,
  bars: 60,
  seed: 1,
  color: 'currentColor',
  playedRatio: 0,
})

const samples = computed(() => {
  let s = props.seed
  const arr: number[] = []
  for (let i = 0; i < props.bars; i++) {
    s = (s * 9301 + 49297) % 233280
    arr.push(0.2 + (s / 233280) * 0.95)
  }
  return arr
})

const barWidth = computed(() => (props.width - props.bars) / props.bars)
</script>

<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true">
    <rect
      v-for="(h, i) in samples"
      :key="i"
      :x="i * (barWidth + 1)"
      :y="(height - h * height) / 2"
      :width="barWidth"
      :height="h * height"
      :rx="1"
      :fill="color"
      :opacity="i / bars <= playedRatio ? 1 : 0.32"
    />
  </svg>
</template>
