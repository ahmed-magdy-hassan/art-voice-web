<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'reka-ui'
import { cn } from '@/shared/lib/cn'
const props = defineProps<DialogTitleProps & { class?: string }>()
</script>

<template>
  <DialogTitle
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('m-0', props.class)"
    style="
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      line-height: 1.2;
      letter-spacing: var(--track-snug);
      color: var(--fg);
    "
  >
    <slot />
  </DialogTitle>
</template>
