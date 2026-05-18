<script setup lang="ts">
type Bar = [number, number, number] // [positive, neutral, negative]

const bars: Bar[] = [
  [12, 3, 1],
  [14, 4, 1],
  [10, 5, 2],
  [16, 4, 1],
  [13, 6, 2],
  [18, 5, 1],
  [15, 4, 2],
]
const days = ['W', 'T', 'F', 'S', 'S', 'M', 'T']
const maxTotal = 25

function pct(value: number, bar: Bar) {
  const total = bar[0] + bar[1] + bar[2]
  const scale = total / maxTotal
  return `${(value / total) * scale * 100}%`
}
</script>

<template>
  <section class="rounded-md border border-border bg-surface p-[14px]">
    <header class="mb-3 flex items-baseline justify-between">
      <div class="text-[13px] font-medium">Sentiment by day</div>
      <div class="t-mono text-[10px] text-fg-subtle">Last 7 days</div>
    </header>

    <div class="mb-2 flex h-20 items-end gap-[6px]">
      <div
        v-for="(bar, i) in bars"
        :key="i"
        class="flex flex-1 flex-col justify-end gap-px"
      >
        <div :style="{ height: pct(bar[0], bar), background: 'var(--viz-1)', borderRadius: '2px 2px 0 0' }" />
        <div :style="{ height: pct(bar[1], bar), background: 'var(--viz-8)', opacity: 0.7 }" />
        <div :style="{ height: pct(bar[2], bar), background: 'var(--viz-6)', borderRadius: '0 0 2px 2px' }" />
      </div>
    </div>

    <div class="t-mono flex justify-between text-[9.5px] text-fg-subtle">
      <span v-for="(d, i) in days" :key="i">{{ d }}</span>
    </div>

    <div class="mt-[10px] flex gap-3 text-[11px]">
      <span class="flex items-center gap-1"><span class="h-2 w-2" style="background: var(--viz-1)" /> Positive</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2" style="background: var(--viz-8); opacity: 0.7" /> Neutral</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2" style="background: var(--viz-6)" /> Negative</span>
    </div>
  </section>
</template>
