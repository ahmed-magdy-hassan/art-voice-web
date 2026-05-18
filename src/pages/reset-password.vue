<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ResetPasswordForm } from '@/features/reset-password'

definePageMeta({ layout: false, auth: 'guest' })

const route = useRoute()
const router = useRouter()
const token = computed(() =>
  typeof route.query.token === 'string' ? route.query.token : '',
)
const success = ref(false)

function onSuccess() {
  success.value = true
  // Sign the user out everywhere — they reset their password, so any cached
  // session cookies in this browser are stale. Push them to sign-in.
  setTimeout(() => router.replace('/sign-in'), 2500)
}
</script>

<template>
  <div class="auth-page">
    <main class="auth-card">
      <h1 class="auth-title">Choose a new password</h1>

      <p v-if="!token" class="auth-remote-error" role="alert" data-testid="auth-error">
        Your reset link is missing the token. Request a new one from
        <NuxtLink to="/forgot-password">forgot password</NuxtLink>.
      </p>

      <template v-else-if="!success">
        <p class="auth-sub">Pick something strong — 12 characters or more.</p>
        <ResetPasswordForm :token="token" @success="onSuccess" />
      </template>

      <p v-else class="auth-confirmation" role="status" data-testid="reset-password-success">
        Password updated. Redirecting you to sign in…
      </p>
    </main>
  </div>
</template>
