<script setup lang="ts">
import SummaryCard from './SummaryCard.vue'
import { useDashboardSummary } from '../api/use-summary'

const { data, isLoading, isError } = useDashboardSummary()
</script>

<template>
  <section class="dashboard-summary">
    <div v-if="isError" class="dashboard-summary-empty">
      Couldn't load your dashboard summary. <button class="link" type="button" @click="$router.go(0)">Retry</button>
    </div>

    <div v-else-if="data?.isNewUser" class="dashboard-summary-onboarding">
      <h2>Welcome to Art-Voice</h2>
      <p>Upload your first call to see your dashboard come alive.</p>
      <NuxtLink to="/upload" class="btn btn-primary">Upload audio</NuxtLink>
    </div>

    <div v-else class="dashboard-summary-grid">
      <template v-if="isLoading">
        <SummaryCard
          v-for="i in 4"
          :key="i"
          :card="{ key: 'score', label: '…', value: 0, trend: [] }"
          loading
        />
      </template>
      <template v-else>
        <SummaryCard v-for="c in data?.cards ?? []" :key="c.key" :card="c" />
      </template>
    </div>
  </section>
</template>
