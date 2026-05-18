<script setup lang="ts">
type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'mono'

interface Props {
  tone?: Tone
}
const props = withDefaults(defineProps<Props>(), { tone: 'neutral' })
const cls = `badge badge-${props.tone}`
</script>

<template>
  <span :class="cls"><slot /></span>
</template>
