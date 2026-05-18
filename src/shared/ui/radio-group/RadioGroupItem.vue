<script setup lang="ts">
// RadioGroupItem — reka-ui primitive styled as design-system .radio.
import { computed } from 'vue'
import {
  RadioGroupItem,
  RadioGroupIndicator,
  type RadioGroupItemProps,
  useForwardProps,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = defineProps<RadioGroupItemProps & { class?: string }>()

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <RadioGroupItem v-bind="forwarded" :class="cn('radio', props.class)">
    <RadioGroupIndicator class="flex items-center justify-center">
      <span
        style="
          display: block;
          width: 6px;
          height: 6px;
          border-radius: var(--r-full);
          background: var(--accent-fg);
        "
      />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>

<style scoped>
.radio {
  appearance: none;
}
.radio[data-state='checked'] {
  background: var(--accent);
  border-color: var(--accent);
}
</style>
