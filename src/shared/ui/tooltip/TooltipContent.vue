<script setup lang="ts">
// shadcn-vue style TooltipContent (reka-ui primitive + Art-Voice tokens).
import { computed } from 'vue'
import {
  TooltipContent,
  TooltipPortal,
  type TooltipContentProps,
  type TooltipContentEmits,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = withDefaults(
  defineProps<TooltipContentProps & { class?: string }>(),
  { sideOffset: 6 },
)
const emits = defineEmits<TooltipContentEmits>()

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      v-bind="forwarded"
      :class="
        cn(
          'tooltip z-50',
          'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
          props.class,
        )
      "
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
