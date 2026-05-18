<script setup lang="ts">
type Tone = 'neutral' | 'accent' | 'warning' | 'success'

interface Item {
  time: string
  label: string
  body: string
  tone: Tone
}

const items: Item[] = [
  { time: '2m ago', label: 'Call ended', body: 'Maya · Hugo · 12m 34s', tone: 'neutral' },
  { time: '8m ago', label: 'Insight flagged', body: 'Pricing objection in Discovery call', tone: 'warning' },
  { time: '14m ago', label: 'Voice clone trained', body: 'northbeam-narrator · v3', tone: 'accent' },
  { time: '32m ago', label: 'Transcript exported', body: 'Q4-renewal-priya.docx', tone: 'neutral' },
  { time: '1h ago', label: 'Latency recovered', body: 'p95 down to 148 ms', tone: 'success' },
]

const dotFor = (tone: Tone) =>
  tone === 'accent' ? 'var(--accent)'
    : tone === 'warning' ? 'var(--warning)'
    : tone === 'success' ? 'var(--success)'
    : 'var(--fg-faint)'
</script>

<template>
  <div class="flex flex-col gap-[14px]">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="flex gap-[10px]"
    >
      <div class="flex w-[10px] justify-center pt-[6px]">
        <div class="h-[6px] w-[6px] rounded-full" :style="{ background: dotFor(item.tone) }" />
      </div>
      <div
        class="flex-1 pb-3"
        :class="i < items.length - 1 ? 'border-b border-border-subtle' : ''"
      >
        <div class="mb-[2px] flex justify-between">
          <span class="text-[12px] font-medium text-fg">{{ item.label }}</span>
          <span class="t-mono text-[10px] text-fg-subtle">{{ item.time }}</span>
        </div>
        <div class="text-[12px] text-fg-muted">{{ item.body }}</div>
      </div>
    </div>
  </div>
</template>
