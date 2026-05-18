<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { ActivityRail } from '@/widgets/activity-rail'
import {
  KpiStrip,
  RecentCallsCard,
  QueueCard,
  SentimentByDayCard,
} from '@/features/dashboard'
import { Calendar, MoreHorizontal, Plus, Bell } from 'lucide-vue-next'
import { LatencyBadge, Badge } from '@/shared/ui'
</script>

<template>
  <AppShell title="Home" right-rail-title="Activity">
    <template #top-right>
      <LatencyBadge :ms="148" />
      <Badge tone="accent" class="badge-mono">ATLAS·0·7</Badge>
      <button type="button" class="btn-icon" aria-label="Notifications"><Bell :size="14" /></button>
      <button type="button" class="btn btn-secondary btn-sm">
        <Calendar :size="12" /> Today
      </button>
      <button type="button" class="btn btn-primary btn-sm">
        <Plus :size="12" /> New call
      </button>
    </template>

    <template #rail>
      <ActivityRail />
    </template>

    <div class="grid gap-6 px-8 py-6">
      <!-- Hello header -->
      <header class="flex items-end justify-between gap-6">
        <div>
          <div class="t-caps mb-[6px]">Tuesday · Nov 12</div>
          <h2
            class="t-display m-0"
            style="font-size: 40px; line-height: 1.05; letter-spacing: -0.02em"
          >
            Good morning, <em class="italic" style="color: var(--accent)">Maya</em>.
          </h2>
          <p class="mt-[6px] text-[14px] text-fg-muted">
            You have <strong class="font-medium text-fg">3 calls</strong> on the queue and
            <strong class="font-medium text-fg">2 transcripts</strong> waiting for review.
          </p>
        </div>
        <div class="flex gap-2">
          <button type="button" class="btn btn-secondary btn-sm">Last 7 days</button>
          <button type="button" class="btn-icon" aria-label="More">
            <MoreHorizontal :size="14" />
          </button>
        </div>
      </header>

      <KpiStrip />

      <div class="grid grid-cols-[1.6fr_1fr] gap-4">
        <RecentCallsCard />
        <div class="grid gap-4 content-start">
          <QueueCard />
          <SentimentByDayCard />
        </div>
      </div>
    </div>
  </AppShell>
</template>
