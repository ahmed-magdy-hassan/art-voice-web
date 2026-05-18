<script setup lang="ts">
// Switch — reka-ui SwitchRoot styled as the design-system .switch.
// The knob is the .switch::after pseudo-element; data-state drives it.
import { computed } from 'vue'
import {
  SwitchRoot,
  type SwitchRootProps,
  type SwitchRootEmits,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = defineProps<SwitchRootProps & { class?: string }>()
const emits = defineEmits<SwitchRootEmits>()

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <SwitchRoot v-bind="forwarded" :class="cn('switch', props.class)" />
</template>
