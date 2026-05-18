<script setup lang="ts">
// shadcn-vue style PopoverContent (reka-ui primitive + Art-Voice tokens).
import { computed } from 'vue'
import {
  PopoverContent,
  PopoverPortal,
  type PopoverContentProps,
  type PopoverContentEmits,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = withDefaults(
  defineProps<PopoverContentProps & { class?: string }>(),
  { sideOffset: 6, align: 'start' },
)
const emits = defineEmits<PopoverContentEmits>()

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="forwarded"
      :class="
        cn(
          'popover z-50 outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          props.class,
        )
      "
      :style="{ padding: 'var(--s-4)' }"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
