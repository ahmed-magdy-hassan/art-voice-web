<script setup lang="ts">
import { useWebAuthnRegister } from '../api/use-webauthn-register'

const props = defineProps<{ userName: string }>()
const emit = defineEmits<{ success: []; error: [message: string] }>()

const { mutate, isPending, isSuccess } = useWebAuthnRegister()

function register() {
  mutate(props.userName, {
    onSuccess: () => emit('success'),
    onError: (err) => emit('error', err instanceof Error ? err.message : 'Registration failed'),
  })
}
</script>

<template>
  <button
    type="button"
    :disabled="isPending || isSuccess"
    class="auth-btn auth-btn--secondary"
    @click="register"
  >
    <span v-if="isPending">Registering…</span>
    <span v-else-if="isSuccess">Passkey registered</span>
    <span v-else>Register a passkey</span>
  </button>
</template>
