<script setup lang="ts">
import { cn } from '@/shared/lib/cn'
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('flex flex-col gap-1', $props.class)">
    <slot />
  </div>
</template>
