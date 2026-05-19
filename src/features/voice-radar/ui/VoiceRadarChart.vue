<script setup lang="ts">
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { useVoiceCharacteristics } from '../api/use-voice-characteristics'
import { RADAR_AXES } from '@/shared/api/contracts/voice-characteristics'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{ analysisId: string }>()

const { data, isPending, isError } = useVoiceCharacteristics(computed(() => props.analysisId))

const chartData = computed(() => {
  const d = data.value
  if (!d) return null
  return {
    labels: RADAR_AXES.map((a) => a.charAt(0).toUpperCase() + a.slice(1)),
    datasets: [
      {
        label: 'Your voice',
        data: RADAR_AXES.map((a) => d[a]),
        backgroundColor: 'rgba(var(--accent-rgb, 99, 102, 241), 0.15)',
        borderColor: 'rgba(var(--accent-rgb, 99, 102, 241), 0.9)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(var(--accent-rgb, 99, 102, 241), 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        display: false,
      },
      grid: { color: 'rgba(128,128,128,0.15)' },
      angleLines: { color: 'rgba(128,128,128,0.2)' },
      pointLabels: {
        font: { size: 12 },
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { dataset: { label: string }; parsed: { r: number } }) =>
          `${ctx.dataset.label}: ${ctx.parsed.r}/100`,
      },
    },
  },
}
</script>

<template>
  <div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
    <h3 class="mb-4 text-[14px] font-medium">Voice characteristics</h3>

    <div v-if="isPending" class="flex h-[280px] items-center justify-center">
      <div class="h-[200px] w-[200px] animate-pulse rounded-full bg-[var(--subtle)]" />
    </div>

    <div v-else-if="isError || !chartData" class="flex h-[280px] items-center justify-center text-[13px] text-[var(--fg-subtle)]">
      Unable to load voice characteristics.
    </div>

    <div v-else class="mx-auto" style="max-width: 320px">
      <Radar :data="chartData" :options="chartOptions" />
    </div>

    <!-- Score legend -->
    <div v-if="data" class="mt-4 grid grid-cols-3 gap-2">
      <div
        v-for="axis in RADAR_AXES"
        :key="axis"
        class="flex flex-col items-center rounded-lg bg-[var(--subtle)] px-2 py-2"
      >
        <span class="text-[18px] font-semibold tabular-nums text-[var(--fg)]">{{ data[axis] }}</span>
        <span class="text-[10px] text-[var(--fg-subtle)] capitalize">{{ axis }}</span>
      </div>
    </div>
  </div>
</template>
