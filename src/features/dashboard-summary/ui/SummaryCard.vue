<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardCard } from '@/shared/api/contracts/dashboard'
import { formatValue, deltaLabel, deltaTone } from '../lib/format'

const props = defineProps<{ card: DashboardCard; loading?: boolean }>()

const formatted = computed(() => formatValue(props.card))
const delta = computed(() => deltaLabel(props.card))
const tone = computed(() => deltaTone(props.card))
</script>

<template>
  <article class="summary-card" :data-tone="tone">
    <header class="summary-card-head">
      <span class="t-caps">{{ card.label }}</span>
      <span v-if="delta" class="summary-card-delta" :data-tone="tone">{{ delta }}</span>
    </header>
    <div class="summary-card-value">
      <span v-if="loading" class="skeleton">—</span>
      <template v-else>
        <span class="summary-card-num">{{ formatted }}</span>
      </template>
    </div>
    <slot name="trend" />
  </article>
</template>
