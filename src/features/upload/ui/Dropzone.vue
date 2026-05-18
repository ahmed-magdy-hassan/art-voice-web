<script setup lang="ts">
import { ref } from 'vue'
import { useChunkedUpload } from '../api/use-upload'

const { progress, start } = useChunkedUpload()
const dragging = ref(false)
const lastError = ref<string | null>(null)

async function pick(files: FileList | null | undefined) {
  if (!files || files.length === 0) return
  const file = files[0]
  lastError.value = null
  try {
    await start(file)
  } catch (err) {
    lastError.value = err instanceof Error ? err.message : 'Upload failed'
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  pick(e.dataTransfer?.files)
}
</script>

<template>
  <section
    class="dropzone"
    :data-dragging="dragging"
    @dragenter.prevent="dragging = true"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop="onDrop"
  >
    <label class="dropzone-label">
      <input
        type="file"
        accept="audio/*"
        class="sr-only"
        @change="(e) => pick((e.target as HTMLInputElement).files)"
      />
      <span>Drag audio here or click to choose a file</span>
    </label>

    <div v-if="progress.status !== 'idle'" class="dropzone-progress" aria-live="polite">
      <div class="progress"><div class="progress-fill" :style="{ width: progress.percent + '%' }" /></div>
      <small>
        {{ progress.completedParts }} / {{ progress.totalParts }} parts ·
        {{ progress.percent }}% · {{ progress.status }}
      </small>
    </div>

    <p v-if="lastError" class="dropzone-error" role="alert">{{ lastError }}</p>
  </section>
</template>
