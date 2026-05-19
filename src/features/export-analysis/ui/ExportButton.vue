<script setup lang="ts">
import { Download, ChevronDown } from 'lucide-vue-next'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/shared/ui'

const props = defineProps<{ analysisId: string }>()

const downloading = ref(false)

async function download(format: 'json' | 'csv') {
  if (downloading.value) return
  downloading.value = true
  try {
    const res = await $fetch(`/api/dashboard/analyses/${props.analysisId}/export?format=${format}`, {
      responseType: 'blob',
    })
    const url = URL.createObjectURL(res as unknown as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-${props.analysisId}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button type="button" class="btn btn-secondary btn-sm flex items-center gap-1.5" :disabled="downloading">
        <Download :size="13" />
        {{ downloading ? 'Downloading…' : 'Export' }}
        <ChevronDown :size="11" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @select="download('json')">Export as JSON</DropdownMenuItem>
      <DropdownMenuItem @select="download('csv')">Export as CSV</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
