<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { Avatar, Badge } from '@/shared/ui'

interface Item {
  initials: string
  name: string
  time: string
  topic: string
}

const items: Item[] = [
  { initials: 'EW', name: 'Ellie Worth', time: '11:00', topic: 'Discovery — Veil Studio' },
  { initials: 'MO', name: 'Mateo Ojeda', time: '13:30', topic: 'Pricing follow-up' },
  { initials: 'NS', name: 'Noor Saad',   time: '15:45', topic: 'Renewal · 3 seats' },
]

function vizColor(i: number) {
  return `var(--viz-${((i + 3) % 8) + 1})`
}
</script>

<template>
  <section class="overflow-hidden rounded-md border border-border bg-surface">
    <header class="flex items-center justify-between border-b border-border px-[14px] py-[10px]">
      <div class="flex items-center gap-2">
        <div class="text-[13px] font-medium">Queue</div>
        <Badge>{{ items.length }}</Badge>
      </div>
      <button type="button" class="btn-icon btn-icon-sm" aria-label="Add to queue">
        <Plus :size="12" />
      </button>
    </header>

    <div
      v-for="(q, i) in items"
      :key="q.name"
      class="flex items-center gap-[10px] px-[14px] py-[10px]"
      :class="i < items.length - 1 ? 'border-b border-border-subtle' : ''"
    >
      <Avatar size="sm" :initials="q.initials" :color="vizColor(i)" />
      <div class="min-w-0 flex-1">
        <div class="text-[13px]">{{ q.name }}</div>
        <div class="text-[11px] text-fg-subtle">{{ q.topic }}</div>
      </div>
      <div class="t-mono text-[11px] text-fg-muted">{{ q.time }}</div>
    </div>

    <div class="px-[14px] py-2 text-center">
      <button type="button" class="btn btn-ghost btn-sm" style="color: var(--accent)">
        View calendar →
      </button>
    </div>
  </section>
</template>
