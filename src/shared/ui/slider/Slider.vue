<script setup lang="ts">
// Slider — reka-ui primitive mapped onto the design-system .slider-* parts.
import { computed } from 'vue'
import {
  SliderRoot,
  SliderTrack,
  SliderRange,
  SliderThumb,
  type SliderRootProps,
  type SliderRootEmits,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/shared/lib/cn'

const props = defineProps<SliderRootProps & { class?: string }>()
const emits = defineEmits<SliderRootEmits>()

const delegated = computed(() => {
  const { class: _omit, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)

const thumbs = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue
    : Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [0],
)
</script>

<template>
  <SliderRoot
    v-bind="forwarded"
    :class="cn('relative flex w-full touch-none select-none items-center', props.class)"
  >
    <SliderTrack class="slider-track">
      <SliderRange class="slider-fill" style="position: absolute; height: 100%" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, i) in thumbs"
      :key="i"
      class="slider-thumb slider-thumb--reka block"
    />
  </SliderRoot>
</template>

<style scoped>
/* reka-ui owns thumb positioning; neutralise the standalone-specimen
   centering transform so the knob tracks the value correctly. */
.slider-thumb--reka {
  position: static;
  transform: none;
}
.slider-thumb--reka:hover {
  transform: scale(1.1);
}
</style>
