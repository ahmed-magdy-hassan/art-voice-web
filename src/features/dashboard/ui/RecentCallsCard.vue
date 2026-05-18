<script setup lang="ts">
import { Filter, MoreHorizontal } from 'lucide-vue-next'
import { Avatar, Badge, LatencyBadge, WaveformStatic } from '@/shared/ui'

type Sentiment = 'positive' | 'neutral' | 'negative' | 'needs-review'

interface Row {
  initials: string
  name: string
  company: string
  duration: string
  sentiment: Sentiment
  latencyMs: number
  waveformWeight: number
}

const rows: Row[] = [
  { initials: 'HG', name: 'Hugo Garrett',  company: 'Lumen.io',    duration: '12:34', sentiment: 'positive',     latencyMs: 148, waveformWeight: 7 },
  { initials: 'PR', name: 'Priya Rajan',   company: 'Storyfield',  duration: '08:51', sentiment: 'positive',     latencyMs: 176, waveformWeight: 11 },
  { initials: 'JT', name: 'Jules Tan',     company: 'Halftone',    duration: '21:08', sentiment: 'needs-review', latencyMs: 312, waveformWeight: 3 },
  { initials: 'ER', name: 'Eli Ramos',     company: 'Field & Co.', duration: '02:48', sentiment: 'negative',     latencyMs: 165, waveformWeight: 5 },
  { initials: 'AC', name: 'Aria Chen',     company: 'Veil Studio', duration: '16:02', sentiment: 'neutral',      latencyMs: 184, waveformWeight: 9 },
  { initials: 'MN', name: 'Mara Nilsson',  company: 'Northwind',   duration: '06:19', sentiment: 'positive',     latencyMs: 142, waveformWeight: 6 },
]

function vizColor(i: number) {
  return `var(--viz-${(i % 8) + 1})`
}

const filters = ['All', 'Mine', 'Flagged'] as const
const active = 'All'
</script>

<template>
  <section class="overflow-hidden rounded-md border border-border bg-surface">
    <header class="flex items-center justify-between border-b border-border px-[14px] py-[10px]">
      <div class="text-[13px] font-medium">Recent calls</div>
      <div class="flex items-center gap-2">
        <button
          v-for="f in filters"
          :key="f"
          type="button"
          class="btn btn-ghost btn-sm"
          :class="f === active ? 'text-fg' : 'text-fg-muted'"
        >{{ f }}</button>
        <button type="button" class="btn-icon btn-icon-sm" aria-label="Filter">
          <Filter :size="12" />
        </button>
      </div>
    </header>

    <table class="table table-tabular" style="font-size: 13px">
      <thead>
        <tr>
          <th>Contact</th>
          <th>Duration</th>
          <th>Sentiment</th>
          <th>Latency</th>
          <th style="width: 24px" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="r.name">
          <td>
            <div class="flex items-center gap-[10px]">
              <Avatar size="sm" :initials="r.initials" :color="vizColor(i)" />
              <div class="flex flex-col">
                <span>{{ r.name }}</span>
                <span class="text-[11px] text-fg-subtle">{{ r.company }}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="flex items-center gap-2 text-fg-muted">
              <WaveformStatic
                :width="48"
                :height="14"
                :bars="r.waveformWeight * 2"
                :seed="i * 3 + 1"
              />
              <span class="t-mono text-fg">{{ r.duration }}</span>
            </div>
          </td>
          <td>
            <Badge v-if="r.sentiment === 'positive'" tone="success">Positive</Badge>
            <Badge v-else-if="r.sentiment === 'neutral'" tone="neutral">Neutral</Badge>
            <Badge v-else-if="r.sentiment === 'negative'" tone="danger">Negative</Badge>
            <Badge v-else tone="warning">Review</Badge>
          </td>
          <td>
            <LatencyBadge :ms="r.latencyMs" />
          </td>
          <td>
            <button type="button" class="btn-icon btn-icon-sm" aria-label="Row actions">
              <MoreHorizontal :size="12" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
