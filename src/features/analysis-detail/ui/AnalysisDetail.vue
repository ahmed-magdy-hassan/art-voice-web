<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAnalysisDetail } from '../api/use-analysis-detail'
import { shouldRefreshAudioUrl, annotationsBetween } from '../lib/audio-url'

const props = defineProps<{ id: string }>()
const query = useAnalysisDetail(props.id)

const tab = ref<'transcript' | 'emotion' | 'metrics' | 'diarization'>('transcript')
const audio = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)

const annotationsNow = computed(() =>
  annotationsBetween(query.data.value?.annotations ?? [], currentTime.value - 1, currentTime.value + 1),
)

watch(
  () => query.data.value?.signedAudioExpiresAt,
  (exp) => {
    if (exp && shouldRefreshAudioUrl(exp)) query.refetch()
  },
  { immediate: true },
)

function onTimeUpdate() {
  if (audio.value) currentTime.value = audio.value.currentTime
}
</script>

<template>
  <div v-if="query.isLoading.value" class="analysis-detail-loading">Loading…</div>
  <div v-else-if="query.error.value" class="analysis-detail-error">
    Couldn't load this analysis.
    <button class="link" type="button" @click="query.refetch()">Try again</button>
  </div>
  <article v-else-if="query.data.value" class="analysis-detail">
    <header>
      <h1>{{ query.data.value.title }}</h1>
      <time>{{ query.data.value.createdAt }}</time>
    </header>

    <audio
      ref="audio"
      :src="query.data.value.signedAudioUrl"
      controls
      preload="metadata"
      @timeupdate="onTimeUpdate"
    />

    <nav class="analysis-tabs" role="tablist">
      <button
        v-for="t in ['transcript','emotion','metrics','diarization'] as const"
        :key="t"
        role="tab"
        :aria-selected="tab === t"
        :data-active="tab === t"
        @click="tab = t"
      >{{ t }}</button>
    </nav>

    <section v-if="tab === 'transcript'" class="analysis-pane">
      <p v-for="(t, i) in query.data.value.transcript" :key="i">
        <strong>{{ t.speaker }}:</strong> {{ t.text }}
      </p>
    </section>
    <section v-else-if="tab === 'emotion'" class="analysis-pane">
      <p v-for="(f, i) in query.data.value.emotionTimeline" :key="i">
        {{ f.t.toFixed(1) }}s — {{ f.label }} ({{ (f.score * 100).toFixed(0) }}%)
      </p>
    </section>
    <section v-else-if="tab === 'metrics'" class="analysis-pane">
      <dl>
        <template v-for="m in query.data.value.speechMetrics" :key="m.key">
          <dt>{{ m.label }}</dt>
          <dd>{{ m.value }}{{ m.unit ? ` ${m.unit}` : '' }}</dd>
        </template>
      </dl>
    </section>
    <section v-else class="analysis-pane">
      <p v-for="(t, i) in query.data.value.diarization" :key="i">
        {{ t.speaker }}: {{ t.tStart.toFixed(1) }}–{{ t.tEnd.toFixed(1) }}s
      </p>
    </section>

    <aside v-if="annotationsNow.length" class="analysis-now">
      <strong>Now:</strong>
      <span v-for="(a, i) in annotationsNow" :key="i">{{ a.label }}</span>
    </aside>
  </article>
</template>
