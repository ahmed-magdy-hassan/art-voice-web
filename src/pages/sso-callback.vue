<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// auth: 'public' because the SSO callback has no session yet; it creates one
definePageMeta({ layout: false, auth: 'public' })

const route = useRoute()
const router = useRouter()

// IdPs redirect here with ?code=...&state=...
// We POST to the BFF which exchanges the code and sets cookies, then redirect.
onMounted(async () => {
  const code = typeof route.query.code === 'string' ? route.query.code : null
  const state = typeof route.query.state === 'string' ? route.query.state : null
  // Google/OIDC RFC 9207 issuer param — must be forwarded for validation.
  const iss = typeof route.query.iss === 'string' ? route.query.iss : null
  // Provider is encoded in state as "provider:hex" — no query param needed.
  const provider = state ? state.split(':')[0] : null

  if (!code || !state || !provider) {
    await router.replace('/sign-in')
    return
  }

  try {
    const res = await $fetch('/api/auth/sso-callback', {
      method: 'POST',
      body: { provider, code, state, iss },
    }) as Record<string, unknown>

    if (res.mfaRequired) {
      await router.replace({ path: '/mfa-challenge', query: { challengeId: res.challengeId as string } })
    } else {
      // Hard navigation so the app re-initialises auth state from the
      // freshly-set httpOnly access_token cookie (SPA state is stale here).
      window.location.href = '/dashboard'
    }
  } catch {
    await router.replace('/sign-in?error=sso_failed')
  }
})
</script>

<template>
  <div class="auth-page">
    <main class="auth-card">
      <p>Completing sign-in…</p>
    </main>
  </div>
</template>
