<script setup lang="ts">
// Checkbox — reka-ui CheckboxRoot styled as the design-system .checkbox.
// reka-ui renders a <button>, not a native input, so the checkmark is drawn
// by the CheckboxIndicator child (the token CSS ::after only targets real
// :checked inputs). data-state drives the filled accent background.
import { computed } from 'vue'
import {
  CheckboxRoot,
  CheckboxIndicator,
  type CheckboxRootProps,
  type CheckboxRootEmits,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = defineProps<CheckboxRootProps & { class?: string }>()
const emits = defineEmits<CheckboxRootEmits>()

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <CheckboxRoot v-bind="forwarded" :class="cn('checkbox', props.class)">
    <CheckboxIndicator class="flex items-center justify-center">
      <span
        style="
          display: block;
          width: 9px;
          height: 5px;
          border-left: 1.5px solid var(--accent-fg);
          border-bottom: 1.5px solid var(--accent-fg);
          transform: rotate(-45deg) translate(0.5px, -0.5px);
        "
      />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>

<style scoped>
.checkbox {
  appearance: none;
}
.checkbox[data-state='checked'],
.checkbox[data-state='indeterminate'] {
  background: var(--accent);
  border-color: var(--accent);
}
</style>
