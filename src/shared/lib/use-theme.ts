import { ref } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'art-voice-theme'
const theme = ref<Theme>('light')
let hydrated = false

function applyTheme(value: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = value
  document.documentElement.classList.toggle('dark', value === 'dark')
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, value)
  }
}

function setTheme(next: Theme) {
  theme.value = next
  // Apply side effects synchronously here rather than via a component-scoped
  // watchEffect: a watcher registered in one component's setup is disposed
  // when that component unmounts (e.g. navigating away from the landing page),
  // which previously left toggle() mutating state with no DOM effect.
  applyTheme(next)
}

export function useTheme() {
  if (!hydrated && typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
    const initial: Theme =
      stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    theme.value = initial
    applyTheme(initial)
    hydrated = true
  }

  function toggle() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }
  function set(next: Theme) {
    setTheme(next)
  }

  return { theme, toggle, set }
}
