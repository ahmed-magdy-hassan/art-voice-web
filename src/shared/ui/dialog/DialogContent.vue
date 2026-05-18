<script setup lang="ts">
// shadcn-vue style DialogContent (reka-ui primitive + Art-Voice tokens).
import { computed } from 'vue'
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  type DialogContentProps,
  type DialogContentEmits,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = defineProps<DialogContentProps & { class?: string }>()
const emits = defineEmits<DialogContentEmits>()

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="backdrop data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'dialog fixed left-1/2 top-1/2 z-[51] -translate-x-1/2 -translate-y-1/2',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          props.class,
        )
      "
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
