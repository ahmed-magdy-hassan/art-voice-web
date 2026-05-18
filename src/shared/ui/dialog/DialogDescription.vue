<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from 'reka-ui'
import { cn } from '@/shared/lib/cn'
const props = defineProps<DialogDescriptionProps & { class?: string }>()
</script>

<template>
  <DialogDescription
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('m-0', props.class)"
    style="
      font-size: var(--text-base);
      color: var(--fg-muted);
      line-height: 1.55;
      margin-top: var(--s-2);
    "
  >
    <slot />
  </DialogDescription>
</template>
