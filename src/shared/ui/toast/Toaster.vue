<script setup lang="ts">
// Toaster — mounts once (e.g. in app.vue). Renders queued toasts via the
// reka-ui Toast primitive styled as the design-system .toast.
import {
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
} from 'reka-ui'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-vue-next'
import { useToast } from './use-toast'

const { toasts, dismiss } = useToast()

const iconFor = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertTriangle,
} as const
</script>

<template>
  <ToastProvider>
    <ToastRoot
      v-for="t in toasts"
      :key="t.id"
      :open="true"
      class="toast data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      @update:open="(v: boolean) => { if (!v) dismiss(t.id) }"
    >
      <component
        :is="iconFor[t.tone ?? 'info']"
        :size="16"
        :style="{ color: `var(--${t.tone ?? 'info'})`, flexShrink: 0 }"
      />
      <div style="flex: 1">
        <ToastTitle style="font-size: var(--text-base); font-weight: var(--w-medium)">
          {{ t.title }}
        </ToastTitle>
        <ToastDescription
          v-if="t.description"
          style="font-size: var(--text-sm); color: var(--fg-subtle)"
        >
          {{ t.description }}
        </ToastDescription>
      </div>
      <ToastAction
        v-if="t.action"
        :alt-text="t.action.label"
        class="btn btn-ghost btn-sm"
        @click="t.action.onClick"
      >
        {{ t.action.label }}
      </ToastAction>
      <ToastClose class="btn-icon btn-icon-sm" aria-label="Dismiss">
        <X :size="12" />
      </ToastClose>
    </ToastRoot>
    <ToastViewport
      class="fixed bottom-0 right-0 z-[60] flex flex-col gap-2 p-4 outline-none"
      style="width: 400px; max-width: 100vw"
    />
  </ToastProvider>
</template>
