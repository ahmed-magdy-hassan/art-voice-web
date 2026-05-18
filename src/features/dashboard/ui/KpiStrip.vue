<script setup lang="ts">
import { ArrowDown, ArrowUpRight } from 'lucide-vue-next'
import { Sparkline } from '@/shared/ui'

interface Kpi {
  label: string
  value: string
  suffix?: string
  delta: string
  trend: number[]
  /** Lower is better (latency, duration). */
  inverted?: boolean
}

const kpis: Kpi[] = [
  { label: 'Calls today', value: '47', delta: '+12', trend: [4, 6, 5, 9, 8, 12, 14, 11, 15, 18, 16, 19] },
  { label: 'Avg duration', value: '9:24', delta: '−0:38', trend: [12, 11, 10, 9, 11, 10, 9, 8, 9, 8, 9, 9], inverted: true },
  { label: 'Sentiment', value: '0.71', delta: '+0.04', trend: [0.5, 0.55, 0.58, 0.6, 0.63, 0.61, 0.65, 0.68, 0.66, 0.7, 0.69, 0.71] },
  { label: 'p95 latency', value: '148', suffix: 'ms', delta: '−24', trend: [212, 198, 190, 182, 178, 170, 168, 162, 158, 154, 150, 148], inverted: true },
]

function isGood(k: Kpi) {
  const positive = !k.delta.startsWith('−') && !k.delta.startsWith('-')
  return k.inverted ? !positive : positive
}
</script>

<template>
  <div class="grid grid-cols-4 gap-3">
    <div
      v-for="k in kpis"
      :key="k.label"
      class="flex flex-col gap-2 rounded-md border border-border bg-surface p-4"
    >
      <div class="t-caps">{{ k.label }}</div>
      <div class="flex items-baseline justify-between gap-3">
        <div class="flex items-baseline gap-1">
          <span
            class="t-display t-tabular leading-none"
            style="font-size: 36px; letter-spacing: -0.025em"
          >{{ k.value }}</span>
          <span v-if="k.suffix" class="t-mono text-[12px] text-fg-subtle">{{ k.suffix }}</span>
        </div>
        <Sparkline
          :data="k.trend"
          :width="80"
          :height="28"
          :color="isGood(k) ? 'var(--accent)' : 'var(--danger)'"
        />
      </div>
      <div class="flex items-center gap-[6px]">
        <span
          class="t-mono inline-flex items-center gap-1 text-[11px]"
          :style="{ color: isGood(k) ? 'var(--success)' : 'var(--danger)' }"
        >
          <ArrowUpRight v-if="isGood(k)" :size="10" />
          <ArrowDown v-else :size="10" />
          {{ k.delta }}
        </span>
        <span class="text-[11px] text-fg-subtle">vs. last week</span>
      </div>
    </div>
  </div>
</template>
