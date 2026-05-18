<script setup lang="ts">
import { useWebAuthnAuthenticate } from '../api/use-webauthn-authenticate'

const emit = defineEmits<{
  success: [result: Record<string, unknown>]
  error: [message: string]
}>()

const { mutate, isPending } = useWebAuthnAuthenticate()

function signIn() {
  mutate(undefined, {
    onSuccess: (result) => emit('success', result as Record<string, unknown>),
    onError: (err) => emit('error', err instanceof Error ? err.message : 'Passkey sign-in failed'),
  })
}
</script>

<template>
  <button
    type="button"
    :disabled="isPending"
    class="auth-btn auth-btn--secondary"
    @click="signIn"
  >
    <span v-if="isPending">Authenticating…</span>
    <span v-else>Sign in with a passkey</span>
  </button>
</template>
