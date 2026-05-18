<script setup lang="ts">
interface Props {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
const props = withDefaults(defineProps<Props>(), { size: 'md' })
const sizeCls = props.size === 'sm' ? 'avatar-sm' : props.size === 'lg' ? 'avatar-lg' : ''
</script>

<template>
  <span
    :class="['avatar', sizeCls]"
    :style="color ? { background: color, color: 'white' } : undefined"
  >{{ initials }}</span>
</template>
