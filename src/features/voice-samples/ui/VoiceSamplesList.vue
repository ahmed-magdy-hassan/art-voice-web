<script setup lang="ts">
import { Mic2, Trash2, RefreshCcw, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useVoiceSamples, useDeleteVoiceSample } from '../api/use-voice-samples'
import { AudioRecorder } from '@/features/record-audio'
import { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui'

const { data, isPending, refetch } = useVoiceSamples()
const { mutate: deleteSample, isPending: deleting } = useDeleteVoiceSample()

const samples = computed(() => data.value?.items ?? [])
const recordingFor = ref<string | null>(null)  // sample id being replaced, or 'new'
const confirmDeleteId = ref<string | null>(null)

function statusIcon(status: string) {
  switch (status) {
    case 'READY': return CheckCircle2
    case 'PROCESSING': return Loader2
    case 'FAILED': return AlertCircle
    default: return Clock
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'READY': return 'text-[var(--accent)]'
    case 'PROCESSING': return 'text-[var(--fg-muted)]'
    case 'FAILED': return 'text-red-500'
    default: return 'text-[var(--fg-subtle)]'
  }
}

function onRecordDone() {
  recordingFor.value = null
  refetch()
}

function confirmDelete(id: string) {
  confirmDeleteId.value = id
}

function executeDelete() {
  if (!confirmDeleteId.value) return
  deleteSample(confirmDeleteId.value, { onSuccess: () => { confirmDeleteId.value = null } })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-[14px] font-medium">Voice samples</h3>
      <button type="button" class="btn btn-primary btn-sm" @click="recordingFor = 'new'">
        <Mic2 :size="12" /> Add recording
      </button>
    </div>

    <!-- New recording inline -->
    <div v-if="recordingFor === 'new'" class="rounded-lg border border-[var(--border)] p-4">
      <AudioRecorder @done="onRecordDone" />
    </div>

    <!-- Loading -->
    <div v-if="isPending" class="space-y-3">
      <div v-for="i in 2" :key="i" class="h-16 animate-pulse rounded-lg bg-[var(--subtle)]" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="samples.length === 0"
      class="rounded-lg border border-dashed border-[var(--border)] p-8 text-center text-[13px] text-[var(--fg-subtle)]"
    >
      No voice samples yet. Add one to build your voice profile.
    </div>

    <!-- List -->
    <ul v-else class="space-y-2">
      <li
        v-for="sample in samples"
        :key="sample.id"
        class="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
      >
        <component
          :is="statusIcon(sample.status)"
          :size="16"
          :class="['shrink-0', statusColor(sample.status), sample.status === 'PROCESSING' ? 'animate-spin' : '']"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-[13px] font-medium">{{ sample.label ?? 'Voice recording' }}</p>
          <p class="text-[11px] text-[var(--fg-subtle)]">
            {{ sample.status.toLowerCase() }}
            <template v-if="sample.durationSeconds"> · {{ sample.durationSeconds }}s</template>
          </p>
        </div>

        <!-- Replace -->
        <button
          type="button"
          class="btn-icon btn-icon-sm"
          aria-label="Replace recording"
          @click="recordingFor = sample.id"
        >
          <RefreshCcw :size="13" />
        </button>

        <!-- Delete -->
        <button
          type="button"
          class="btn-icon btn-icon-sm text-red-500"
          aria-label="Delete recording"
          @click="confirmDelete(sample.id)"
        >
          <Trash2 :size="13" />
        </button>
      </li>
    </ul>

    <!-- Replace recording inline -->
    <div
      v-if="recordingFor && recordingFor !== 'new'"
      class="rounded-lg border border-[var(--border)] p-4"
    >
      <p class="mb-3 text-[12px] text-[var(--fg-muted)]">Recording new sample — this will replace the existing one after upload.</p>
      <AudioRecorder @done="onRecordDone" />
    </div>

    <!-- Delete confirm dialog -->
    <DialogRoot :open="!!confirmDeleteId" @update:open="(v) => { if (!v) confirmDeleteId = null }">
      <DialogContent>
        <DialogTitle>Delete sample?</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="btn btn-secondary btn-sm" @click="confirmDeleteId = null">Cancel</button>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            :disabled="deleting"
            @click="executeDelete"
          >
            {{ deleting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </DialogContent>
    </DialogRoot>
  </div>
</template>
