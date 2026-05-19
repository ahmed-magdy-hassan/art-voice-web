<script setup lang="ts">
import { Bell, Check, CheckCheck, Filter } from 'lucide-vue-next'
import { useNotificationsPage, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/features/notifications'

const unreadOnly = ref(false)

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
} = useNotificationsPage({ unreadOnly })

const { mutate: markRead, isPending: markingOne } = useMarkNotificationRead()
const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead()

const items = computed(() => data.value?.pages.flatMap((p) => p.items) ?? [])
const unreadCount = computed(() => data.value?.pages[0]?.unreadCount ?? 0)

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const typeIcon: Record<string, string> = {
  analysis_complete: '🎙️',
  coaching_tip: '💡',
  streak_milestone: '🔥',
  system: '🔔',
}
</script>

<template>
  <div class="grid gap-6 px-8 py-6">
    <!-- Header -->
    <header class="flex items-start justify-between">
      <div>
        <div class="t-caps mb-[6px]">Inbox</div>
        <h2 class="t-display m-0" style="font-size: 36px; line-height: 1.1">
          Your <em class="italic" style="color: var(--accent)">notifications</em>
        </h2>
        <p class="mt-2 text-[14px] text-[var(--fg-muted)]">
          Stay up to date with your analyses, coaching tips, and milestones.
        </p>
      </div>

      <button
        v-if="unreadCount > 0"
        type="button"
        class="btn btn-ghost flex items-center gap-1.5 text-[13px]"
        :disabled="markingAll"
        @click="markAll()"
      >
        <CheckCheck :size="14" />
        Mark all as read
      </button>
    </header>

    <!-- Filter bar -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors"
        :class="!unreadOnly
          ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
          : 'border-[var(--border)] bg-transparent text-[var(--fg-muted)] hover:border-[var(--fg-muted)]'"
        @click="unreadOnly = false"
      >
        All
      </button>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors"
        :class="unreadOnly
          ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
          : 'border-[var(--border)] bg-transparent text-[var(--fg-muted)] hover:border-[var(--fg-muted)]'"
        @click="unreadOnly = true"
      >
        <span
          v-if="unreadCount > 0"
          class="flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--accent)] px-[4px] text-[10px] font-semibold text-white"
          :class="unreadOnly ? 'bg-white !text-[var(--accent)]' : ''"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
        Unread
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isPending" class="flex flex-col divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
      <div v-for="i in 5" :key="i" class="flex items-start gap-4 px-5 py-4">
        <div class="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--border)]" />
        <div class="flex-1 space-y-2">
          <div class="h-3 w-2/5 animate-pulse rounded bg-[var(--border)]" />
          <div class="h-3 w-4/5 animate-pulse rounded bg-[var(--border)]" />
          <div class="h-2.5 w-16 animate-pulse rounded bg-[var(--border)]" />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="items.length === 0"
      class="flex flex-col items-center gap-4 rounded-xl border border-[var(--border)] py-10 text-center"
    >
      <Bell :size="32" class="text-[var(--fg-subtle)]" />
      <p class="text-[14px] font-medium">{{ unreadOnly ? 'No unread notifications' : 'No notifications yet' }}</p>
      <p class="text-[12px] text-[var(--fg-subtle)]">
        {{ unreadOnly ? 'Switch to "All" to see your history.' : 'Analyses, tips and milestones will appear here.' }}
      </p>
    </div>

    <!-- List -->
    <ul
      v-else
      class="flex flex-col divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]"
    >
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-[var(--bg-subtle)]"
        :class="item.readAt ? 'opacity-60' : ''"
      >
        <!-- Unread dot -->
        <span
          class="mt-[5px] h-2 w-2 shrink-0 rounded-full"
          :class="item.readAt ? 'bg-transparent' : 'bg-[var(--accent)]'"
        />

        <!-- Icon -->
        <span class="mt-0.5 text-[18px] leading-none select-none" aria-hidden="true">
          {{ typeIcon[item.type] ?? '🔔' }}
        </span>

        <!-- Content -->
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-medium leading-snug">{{ item.title }}</p>
          <p v-if="item.body" class="mt-0.5 text-[13px] text-[var(--fg-muted)] leading-snug">{{ item.body }}</p>
          <p class="mt-1 text-[11px] text-[var(--fg-subtle)]">{{ formatTime(item.createdAt) }}</p>
        </div>

        <!-- Mark read -->
        <button
          v-if="!item.readAt"
          type="button"
          class="btn-icon btn-icon-sm shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          :class="{ 'opacity-100': !item.readAt }"
          :disabled="markingOne"
          aria-label="Mark as read"
          @click="markRead(item.id)"
        >
          <Check :size="13" />
        </button>
      </li>
    </ul>

    <!-- Load more -->
    <div v-if="hasNextPage" class="flex justify-center">
      <button
        type="button"
        class="btn btn-ghost text-[13px]"
        :disabled="isFetchingNextPage"
        @click="fetchNextPage()"
      >
        {{ isFetchingNextPage ? 'Loading…' : 'Load more' }}
      </button>
    </div>
  </div>
</template>
