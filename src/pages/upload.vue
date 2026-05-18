<script setup lang="ts">
import { AppShell } from '@/widgets/app-shell'
import { Dropzone } from '@/features/upload'
</script>

<template>
  <AppShell title="Upload">
    <div class="grid gap-6 px-8 py-6 max-w-[960px] mx-auto w-full">
      <header>
        <div class="t-caps mb-[6px]">New analysis</div>
        <h2
          class="t-display m-0"
          style="font-size: 36px; line-height: 1.05; letter-spacing: -0.02em"
        >
          Drop an audio file to <em class="italic" style="color: var(--accent)">analyze</em>.
        </h2>
        <p class="mt-3 text-[14px] text-fg-muted max-w-[60ch]">
          Chunked, resumable upload. WAV, FLAC, OGG, MP3. We canonicalize to 16&nbsp;kHz mono PCM
          on ingest and emit completion when results are ready.
        </p>
      </header>

      <Dropzone />
    </div>
  </AppShell>
</template>
