<script setup lang="ts">
import { cn } from '@/shared/lib/cn'
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('flex justify-end gap-2', $props.class)" style="margin-top: var(--s-5)">
    <slot />
  </div>
</template>
