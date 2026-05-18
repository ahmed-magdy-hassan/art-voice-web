// KAN-338 — Pinia store for the current session identity.
// Pinia owns UI/ephemeral state only; server data lives in TanStack Query.
// This store is the exception: it holds identity that multiple route guards
// and widgets need synchronously, so TanStack Query alone is not sufficient.
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiFetch } from '@/shared/api/client'
import { z } from 'zod'

const SessionSchema = z.object({
  userId: z.string(),
  tenantId: z.string(),
  email: z.string().email(),
})
export type Session = z.infer<typeof SessionSchema>

export const useAuth = defineStore('auth', () => {
  const userId = ref<string | null>(null)
  const tenantId = ref<string | null>(null)
  const email = ref<string | null>(null)
  const initialised = ref(false)

  const isAuthenticated = computed(() => !!userId.value)

  async function fetch() {
    try {
      // During SSR, server-side $fetch does NOT auto-forward the browser's
      // cookies to the internal Nitro route. Without this, /api/auth/me has
      // no access_token cookie on the SSR pass and the session check fails,
      // bouncing authenticated users to /sign-in. Forward the incoming
      // request's Cookie header explicitly.
      const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined
      if (import.meta.server) {
        console.log('[useAuth.fetch] SSR — forwarding cookie header:', !!headers?.cookie)
      }
      const me = await apiFetch('/api/auth/me', {
        schema: SessionSchema,
        ...(headers ? { headers } : {}),
      })
      userId.value = me.userId
      tenantId.value = me.tenantId
      email.value = me.email
    } catch (e) {
      if (import.meta.server) {
        console.log('[useAuth.fetch] session fetch failed:', (e as Error)?.message)
      }
      clear()
    } finally {
      initialised.value = true
    }
  }

  function hydrate(session: Session) {
    userId.value = session.userId
    tenantId.value = session.tenantId
    email.value = session.email
    initialised.value = true
  }

  function clear() {
    userId.value = null
    tenantId.value = null
    email.value = null
    initialised.value = true
  }

  return { userId, tenantId, email, isAuthenticated, initialised, fetch, hydrate, clear }
})
