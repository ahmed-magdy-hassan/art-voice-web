<script setup lang="ts">
interface Props {
  status: 'live' | 'queued' | 'ended'
}
defineProps<Props>()
</script>

<template>
  <span :class="['status-pill', status]">
    <span class="dot" />
    <slot>{{ status }}</slot>
  </span>
</template>
