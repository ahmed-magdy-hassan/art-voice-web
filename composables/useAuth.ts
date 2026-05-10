import { computed } from 'vue'
import { useState } from '#app'

export interface SessionUser {
  id: string
  email: string
  tenantId: string
  scopes: string[]
}

export function useAuth() {
  const user = useState<SessionUser | null>('auth.user', () => null)

  const isAuthenticated = computed(() => user.value !== null)

  function hasScope(scope: string): boolean {
    return user.value?.scopes.includes(scope) ?? false
  }

  function setUser(next: SessionUser | null) {
    user.value = next
  }

  return { user, isAuthenticated, hasScope, setUser }
}
