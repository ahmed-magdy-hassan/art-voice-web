<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { ref } from 'vue'
import { AppShell } from '@/widgets/app-shell'
import { TotpEnrollWizard } from '@/features/mfa-enroll'
import { WebAuthnRegisterButton } from '@/features/webauthn'

const passkeyUserName = ref('')
const passkeyError = ref<string | null>(null)
const passkeySuccess = ref(false)

function onPasskeySuccess() {
  passkeySuccess.value = true
  passkeyError.value = null
}
function onPasskeyError(msg: string) {
  passkeyError.value = msg
}
</script>

<template>
  <AppShell title="Security">
    <section class="settings-section" data-testid="security-totp-section">
      <h2 class="settings-section-title">Two-factor authentication</h2>
      <p class="settings-section-desc">
        Add an authenticator app to secure your account with a second factor.
      </p>
      <TotpEnrollWizard />
    </section>

    <section class="settings-section" data-testid="security-passkeys-section">
      <h2 class="settings-section-title">Passkeys</h2>
      <p class="settings-section-desc">
        Register a passkey to sign in without a password using Face ID, Touch ID, or a security key.
      </p>
      <div v-if="passkeySuccess" class="settings-success">
        Passkey registered successfully.
      </div>
      <template v-else>
        <input
          v-model="passkeyUserName"
          type="text"
          placeholder="Your display name for this passkey"
          class="auth-input"
          style="margin-bottom: 0.5rem;"
        />
        <WebAuthnRegisterButton
          :user-name="passkeyUserName"
          @success="onPasskeySuccess"
          @error="onPasskeyError"
        />
        <p v-if="passkeyError" class="auth-error">{{ passkeyError }}</p>
      </template>
    </section>
  </AppShell>
</template>
