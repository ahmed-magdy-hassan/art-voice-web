// KAN-336 / KAN-337 / KAN-270 — Global route guard.
// Pages that are public must declare definePageMeta({ auth: 'public' }).
// Pages that are guest-only (redirect authenticated users away) declare definePageMeta({ auth: 'guest' }).
// Pages that skip onboarding check declare definePageMeta({ auth: 'protected', skipOnboarding: true }).
// Everything else is treated as authenticated + onboarding-gated.
import { useAuth } from '@/entities/user'

// Routes that authenticated users can always access regardless of onboarding.
const ONBOARDING_EXEMPT = ['/onboarding', '/sign-out', '/billing']

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

  // KAN-270 — Onboarding gate: redirect to /onboarding if the user hasn't
  // completed it yet, unless the destination is already onboarding-exempt.
  if (ONBOARDING_EXEMPT.some((p) => to.path.startsWith(p))) return
  if ((to.meta as Record<string, unknown>).skipOnboarding) return

  // Cache the result for the lifetime of this page load so we don't make a
  // BFF round-trip on every route change.
  const onboardingChecked = useState<boolean | null>('onboarding:checked', () => null)
  if (onboardingChecked.value === true) return  // already confirmed complete

  try {
    const state = await $fetch('/api/dashboard/onboarding')
    if ((state as { isComplete: boolean }).isComplete === false) {
      return navigateTo('/onboarding')
    }
    onboardingChecked.value = true
  } catch {
    // Network error — let the user through; the onboarding page will
    // re-fetch and redirect if needed.
  }
})
