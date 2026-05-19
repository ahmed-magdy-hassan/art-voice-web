<script setup lang="ts">
import { Bell, Check } from 'lucide-vue-next'
import { PopoverRoot, PopoverTrigger, PopoverContent } from '@/shared/ui'
import { useNotifications, useMarkNotificationRead } from '../api/use-notifications'

const { data } = useNotifications()
const { mutate: markRead } = useMarkNotificationRead()

const unreadCount = computed(() => data.value?.unreadCount ?? 0)
const items = computed(() => data.value?.items ?? [])

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <button type="button" class="btn-icon relative" aria-label="Notifications">
        <Bell :size="14" />
        <span
          v-if="unreadCount > 0"
          class="absolute -right-0.5 -top-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[var(--accent)] px-[3px] text-[9px] font-semibold leading-none text-white"
          :aria-label="`${unreadCount} unread`"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>
    </PopoverTrigger>

    <PopoverContent align="end" :side-offset="8" style="padding: 0; width: 320px">
      <div class="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <span class="text-[13px] font-medium">Notifications</span>
        <span v-if="unreadCount > 0" class="text-[11px] text-[var(--fg-muted)]">{{ unreadCount }} unread</span>
      </div>

      <div v-if="items.length === 0" class="px-4 py-6 text-center text-[12px] text-[var(--fg-subtle)]">
        No notifications
      </div>

      <ul v-else class="divide-y divide-[var(--border)]">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-start gap-3 px-4 py-3 text-[13px]"
          :class="item.readAt ? 'opacity-60' : ''"
        >
          <span
            class="mt-[3px] h-2 w-2 shrink-0 rounded-full"
            :class="item.readAt ? 'bg-transparent' : 'bg-[var(--accent)]'"
          />
          <div class="min-w-0 flex-1">
            <p class="font-medium leading-snug">{{ item.title }}</p>
            <p v-if="item.body" class="mt-0.5 text-[var(--fg-muted)] leading-snug line-clamp-2">{{ item.body }}</p>
            <p class="mt-1 text-[11px] text-[var(--fg-subtle)]">{{ formatTime(item.createdAt) }}</p>
          </div>
          <button
            v-if="!item.readAt"
            type="button"
            class="btn-icon btn-icon-sm shrink-0"
            aria-label="Mark as read"
            @click="markRead(item.id)"
          >
            <Check :size="12" />
          </button>
        </li>
      </ul>

      <div class="border-t border-[var(--border)] px-4 py-2">
        <NuxtLink to="/notifications" class="text-[12px] text-[var(--accent)] hover:underline">
          View all
        </NuxtLink>
      </div>
    </PopoverContent>
  </PopoverRoot>
</template>
