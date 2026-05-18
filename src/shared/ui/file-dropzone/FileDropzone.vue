<script setup lang="ts">
// File dropzone — drag-and-drop + click-to-browse, per the design system.
// Emits selected files; drag state toggles the .is-dragging accent look.
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import { cn } from '@/shared/lib/cn'

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    title?: string
    hint?: string
    disabled?: boolean
    class?: string
  }>(),
  {
    title: 'Drop audio here',
    hint: 'WAV, MP3, M4A · up to 200 MB',
    multiple: false,
  },
)

const emit = defineEmits<{ files: [File[]] }>()

const dragging = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)
let dragDepth = 0

function emitFiles(list: FileList | null) {
  if (!list || list.length === 0) return
  emit('files', Array.from(list))
}

function onDrop(e: DragEvent) {
  dragging.value = false
  dragDepth = 0
  if (props.disabled) return
  emitFiles(e.dataTransfer?.files ?? null)
}

function onDragEnter() {
  if (props.disabled) return
  dragDepth++
  dragging.value = true
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dragging.value = false
}

function browse() {
  if (!props.disabled) inputEl.value?.click()
}

function onPick(e: Event) {
  emitFiles((e.target as HTMLInputElement).files)
}
</script>

<template>
  <div
    :class="cn('dropzone', dragging && 'is-dragging', props.class)"
    role="button"
    tabindex="0"
    :aria-disabled="props.disabled"
    @click="browse"
    @keydown.enter.prevent="browse"
    @keydown.space.prevent="browse"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <Upload :size="20" :style="{ color: dragging ? 'var(--accent)' : 'var(--fg-subtle)' }" />
    <div class="dropzone-title" style="font-size: 14px; font-weight: 500">
      {{ dragging ? 'Drop to upload' : props.title }}
    </div>
    <div style="font-size: 12px; color: var(--fg-subtle)">{{ props.hint }}</div>
    <button
      type="button"
      class="btn btn-secondary btn-sm"
      style="margin-top: 4px"
      :disabled="props.disabled"
      @click.stop="browse"
    >
      Choose file
    </button>
    <input
      ref="inputEl"
      type="file"
      class="sr-only"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="props.disabled"
      @change="onPick"
    />
  </div>
</template>
