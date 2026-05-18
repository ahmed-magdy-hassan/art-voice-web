<script setup lang="ts">
import { DropdownMenuLabel } from 'reka-ui'
</script>

<template>
  <DropdownMenuLabel
    class="px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em]"
    style="color: var(--fg-subtle)"
  >
    <slot />
  </DropdownMenuLabel>
</template>
