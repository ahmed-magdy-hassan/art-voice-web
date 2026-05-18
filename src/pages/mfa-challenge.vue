<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MfaChallengeForm } from '@/features/mfa-challenge'

// auth: 'public' because the user is mid-login; no session cookie exists yet
definePageMeta({ layout: false, auth: 'public' })

const router = useRouter()
const route = useRoute()

const challengeId = computed(() => {
  const id = route.query.challengeId
  return typeof id === 'string' ? id : ''
})

function onSuccess(result: { userId: string; tenantId: string }) {
  void result
  router.replace('/')
}
</script>

<template>
  <div class="auth-page">
    <main class="auth-card">
      <h1 class="auth-title">Two-factor authentication</h1>
      <template v-if="challengeId">
        <MfaChallengeForm :challenge-id="challengeId" @success="onSuccess" />
      </template>
      <template v-else>
        <p class="auth-remote-error">Missing challenge. Please <NuxtLink to="/sign-in">sign in again</NuxtLink>.</p>
      </template>
    </main>
  </div>
</template>
