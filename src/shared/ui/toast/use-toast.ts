// Toast queue — a module-level reactive store so any feature can push a
// toast without prop drilling. Mount <Toaster /> once at the app root.
import { ref } from 'vue'

export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  /** ms before auto-dismiss; 0 disables. Default 5000. */
  duration?: number
  action?: { label: string; onClick: () => void }
}

interface ToastItem extends ToastOptions {
  id: number
}

const toasts = ref<ToastItem[]>([])
let seq = 0

function dismiss(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function toast(opts: ToastOptions) {
  const id = ++seq
  toasts.value = [...toasts.value, { id, ...opts }]
  const duration = opts.duration ?? 5000
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }
  return id
}

export function useToast() {
  return { toasts, toast, dismiss }
}
