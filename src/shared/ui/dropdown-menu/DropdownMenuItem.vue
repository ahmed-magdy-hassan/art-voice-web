<script setup lang="ts">
import { computed } from 'vue'
import {
  DropdownMenuItem,
  type DropdownMenuItemProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = defineProps<
  DropdownMenuItemProps & { class?: string; tone?: 'default' | 'danger' }
>()

const delegated = computed(() => {
  const { class: _c, tone: _t, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :data-tone="props.tone ?? 'default'"
    :class="
      cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-[4px]',
        'px-2 py-1.5 text-[13px] outline-none transition-colors',
        'data-[highlighted]:bg-[var(--subtle)]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[tone=danger]:text-[var(--danger,#dc2626)]',
        props.class,
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
