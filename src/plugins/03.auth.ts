// KAN-338 — Bootstrap the auth store on app init.
// Runs client-side only; the server renders pages without session state
// (route guards handle the redirect server-side via middleware).
import { useAuth } from '@/entities/user'

export default defineNuxtPlugin(async () => {
  if (import.meta.server) return
  const auth = useAuth()
  if (!auth.initialised) {
    await auth.fetch()
  }
})
