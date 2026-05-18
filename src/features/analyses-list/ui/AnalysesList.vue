<script setup lang="ts">
import { ref } from 'vue'
import { useAnalysesList } from '../api/use-analyses'
import { DEFAULT_FILTERS, withFilter } from '../lib/filters'
import type { AnalysisListQuery } from '@/shared/api/contracts/analyses'

const filters = ref<AnalysisListQuery>({ ...DEFAULT_FILTERS })
const query = useAnalysesList(filters)

function set<K extends keyof AnalysisListQuery>(k: K, v: AnalysisListQuery[K] | undefined) {
  filters.value = withFilter(filters.value, k, v)
}
</script>

<template>
  <section class="analyses-list">
    <header class="analyses-list-head">
      <h2>Analyses</h2>
      <div class="analyses-filters">
        <select :value="filters.type" @change="set('type', ($event.target as HTMLSelectElement).value as AnalysisListQuery['type'] || undefined)">
          <option value="">All types</option>
          <option value="call">Calls</option>
          <option value="training">Training</option>
          <option value="live">Live</option>
        </select>
        <select :value="filters.sort" @change="set('sort', ($event.target as HTMLSelectElement).value as AnalysisListQuery['sort'])">
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="score_desc">Top score</option>
          <option value="score_asc">Low score</option>
        </select>
      </div>
    </header>

    <div v-if="query.data.value?.pages?.[0]?.items?.length === 0" class="analyses-empty">
      No analyses yet. <NuxtLink to="/upload">Upload your first call.</NuxtLink>
    </div>

    <ul v-else class="analyses-rows">
      <template v-for="(page, pi) in query.data.value?.pages ?? []" :key="pi">
        <li v-for="row in page.items" :key="row.id" class="analyses-row">
          <NuxtLink :to="`/analyses/${row.id}`" class="analyses-row-title">{{ row.title }}</NuxtLink>
          <span class="analyses-row-type">{{ row.type }}</span>
          <span class="analyses-row-score">{{ row.score === null ? '—' : row.score }}</span>
        </li>
      </template>
    </ul>

    <button
      v-if="query.hasNextPage.value"
      type="button"
      class="btn btn-secondary"
      :disabled="query.isFetchingNextPage.value"
      @click="query.fetchNextPage()"
    >
      <span v-if="query.isFetchingNextPage.value">Loading…</span>
      <span v-else>Load more</span>
    </button>
  </section>
</template>
