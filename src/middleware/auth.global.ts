// KAN-336 / KAN-337 — Global route guard.
// Pages that are public must declare definePageMeta({ auth: 'public' }).
// Pages that are guest-only (redirect authenticated users away) declare definePageMeta({ auth: 'guest' }).
// Everything else is treated as authenticated (auth: 'protected').
import { useAuth } from '@/entities/user'

export default defineNuxtRouteMiddleware(async (to) => {
  // Nitro server routes — let the browser handle them natively, not Vue Router.
  if (to.path.startsWith('/api/')) return

  const auth = useAuth()

  if (!auth.initialised) {
    await auth.fetch()
  }

  const authMeta = to.meta.auth as 'public' | 'guest' | 'protected' | undefined

  // Fully public pages (landing, etc.) — no gate
  if (authMeta === 'public') return

  // Guest-only pages: authenticated users get bounced to dashboard
  if (authMeta === 'guest') {
    if (auth.isAuthenticated) {
      const dest = typeof to.query.redirect === 'string' ? to.query.redirect : '/dashboard'
      return navigateTo(dest)
    }
    return
  }

  // Default: protected — unauthenticated users get bounced to sign-in
  if (!auth.isAuthenticated) {
    return navigateTo({ path: '/sign-in', query: { redirect: to.fullPath } })
  }
})
