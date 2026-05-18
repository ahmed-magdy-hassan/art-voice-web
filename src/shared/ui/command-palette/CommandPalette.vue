<script setup lang="ts">
// Command palette (⌘K) — full-screen overlay with fuzzy filter, grouped
// results, kbd hints, and keyboard navigation. Visual = design-system .cmdk.
import { computed, ref, watch, nextTick } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  VisuallyHidden,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'
import type { CommandItem } from './types'

const props = defineProps<{
  open: boolean
  items: CommandItem[]
  placeholder?: string
}>()
const emit = defineEmits<{ 'update:open': [boolean] }>()

const query = ref('')
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter((it) =>
    `${it.label} ${it.keywords ?? ''} ${it.group}`.toLowerCase().includes(q),
  )
})

// group preserving first-seen order
const groups = computed(() => {
  const order: string[] = []
  const map = new Map<string, CommandItem[]>()
  for (const it of filtered.value) {
    if (!map.has(it.group)) {
      map.set(it.group, [])
      order.push(it.group)
    }
    map.get(it.group)!.push(it)
  }
  return order.map((g) => ({ group: g, items: map.get(g)! }))
})

// flat list mirrors render order so arrow keys map to a single index
const flat = computed(() => groups.value.flatMap((g) => g.items))

watch(filtered, () => {
  activeIndex.value = 0
})

watch(
  () => props.open,
  async (o) => {
    if (o) {
      query.value = ''
      activeIndex.value = 0
      await nextTick()
      inputEl.value?.focus()
    }
  },
)

function close() {
  emit('update:open', false)
}

function runActive() {
  const item = flat.value[activeIndex.value]
  if (item) {
    item.onSelect()
    close()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, flat.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    runActive()
  }
}

function indexOf(item: CommandItem) {
  return flat.value.indexOf(item)
}
</script>

<template>
  <DialogRoot :open="props.open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="backdrop" />
      <DialogContent
        :class="
          cn(
            'cmdk fixed left-1/2 top-[18%] z-[51] -translate-x-1/2',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
          )
        "
        style="width: min(600px, 92vw)"
        @keydown="onKeydown"
      >
        <VisuallyHidden>
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>
            Search, navigate, and run actions. Use arrow keys to move and Enter to select.
          </DialogDescription>
        </VisuallyHidden>
        <input
          ref="inputEl"
          v-model="query"
          class="cmdk-input"
          :placeholder="props.placeholder ?? 'Search, navigate, act…'"
          aria-label="Command palette"
        />
        <div class="cmdk-list" role="listbox">
          <template v-for="g in groups" :key="g.group">
            <div class="menu-label">{{ g.group }}</div>
            <div
              v-for="item in g.items"
              :key="item.id"
              class="menu-item"
              role="option"
              :data-highlighted="indexOf(item) === activeIndex ? 'true' : undefined"
              :aria-selected="indexOf(item) === activeIndex"
              @mousemove="activeIndex = indexOf(item)"
              @click="item.onSelect(); close()"
            >
              <span>{{ item.label }}</span>
              <span
                v-if="item.meta"
                style="margin-left: auto; font-size: 11px; color: var(--fg-subtle)"
              >
                {{ item.meta }}
              </span>
              <span v-if="item.hint" class="kbd" :style="item.meta ? 'margin-left:8px' : 'margin-left:auto'">
                {{ item.hint }}
              </span>
            </div>
          </template>
          <div
            v-if="flat.length === 0"
            class="menu-item"
            style="color: var(--fg-subtle); pointer-events: none"
          >
            No results
          </div>
        </div>
        <div
          style="
            padding: 8px 16px;
            border-top: 1px solid var(--border);
            font-size: 11px;
            color: var(--fg-subtle);
            display: flex;
            gap: 14px;
            align-items: center;
          "
        >
          <span style="display: inline-flex; gap: 4px; align-items: center">
            <span class="kbd">↑</span><span class="kbd">↓</span> navigate
          </span>
          <span style="display: inline-flex; gap: 4px; align-items: center">
            <span class="kbd">↵</span> select
          </span>
          <span style="display: inline-flex; gap: 4px; align-items: center; margin-left: auto">
            <span class="kbd">esc</span> close
          </span>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
