<script setup lang="ts">
// shadcn-vue style DropdownMenuContent (reka-ui primitive + design tokens).
import { computed, useAttrs } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  type DropdownMenuContentProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

// The portal means fallthrough attrs (data-testid, aria-*) don't auto-inherit
// onto the rendered content element — forward them explicitly.
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()

const props = withDefaults(
  defineProps<DropdownMenuContentProps & { class?: string }>(),
  { sideOffset: 6, align: 'start' },
)

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      v-bind="{ ...forwarded, ...attrs }"
      :class="
        cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          props.class,
        )
      "
      style="
        background: var(--canvas);
        border-color: var(--border);
        color: var(--fg);
      "
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
