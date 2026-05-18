<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { confirmTotpSchema } from '../lib/schema'
import { useTotpEnroll, useTotpConfirm } from '../api/use-mfa-enroll'

const emit = defineEmits<{
  enrolled: [{ recoveryCodes: string[] }]
}>()

type Step = 'idle' | 'scan' | 'confirm' | 'done'
const step = ref<Step>('idle')
const factorId = ref('')
const secretBase32 = ref('')
const otpauthUri = ref('')
const recoveryCodes = ref<string[]>([])
const remoteError = ref<string | null>(null)
const copied = ref(false)

const totpEnroll = useTotpEnroll()
const totpConfirm = useTotpConfirm()

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(confirmTotpSchema),
})
const [code, codeAttrs] = defineField('code')

async function startEnroll() {
  remoteError.value = null
  try {
    const result = await totpEnroll.mutateAsync()
    factorId.value = result.factorId
    secretBase32.value = result.secretBase32
    otpauthUri.value = result.otpauthUri
    step.value = 'scan'
  } catch {
    remoteError.value = 'Could not start enrollment. Please try again.'
  }
}

const onConfirm = handleSubmit(async (values) => {
  remoteError.value = null
  try {
    const result = await totpConfirm.mutateAsync({
      factorId: factorId.value,
      code: values.code,
    })
    recoveryCodes.value = result.recoveryCodes
    step.value = 'done'
    emit('enrolled', { recoveryCodes: result.recoveryCodes })
  } catch (err: unknown) {
    const message = (err as { statusMessage?: string }).statusMessage
    remoteError.value =
      message === 'mfa_code_invalid'
        ? 'Code is incorrect. Check your authenticator app and try again.'
        : 'Confirmation failed. Please try again.'
  }
})

async function copySecret() {
  await navigator.clipboard.writeText(secretBase32.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="mfa-wizard">
    <!-- Step 0: idle — prompt to start -->
    <div v-if="step === 'idle'" data-testid="mfa-enroll-step-idle">
      <p>Add an authenticator app for two-factor authentication.</p>
      <p v-if="remoteError" class="auth-remote-error" data-testid="mfa-enroll-error">{{ remoteError }}</p>
      <button
        class="btn btn-primary"
        data-testid="mfa-enroll-start"
        :disabled="totpEnroll.isPending.value"
        @click="startEnroll"
      >
        <span v-if="totpEnroll.isPending.value">Starting…</span>
        <span v-else>Set up authenticator</span>
      </button>
    </div>

    <!-- Step 1: scan QR / copy secret -->
    <div v-else-if="step === 'scan'" data-testid="mfa-enroll-step-scan">
      <h2 class="mfa-step-title">Scan QR code</h2>
      <p>Open your authenticator app and scan this QR code, or enter the secret manually.</p>

      <!-- QR rendered client-side from otpauthUri -->
      <div class="mfa-qr-placeholder" aria-label="QR code placeholder">
        <p class="mfa-qr-note">QR code for: {{ secretBase32 }}</p>
      </div>

      <div class="mfa-secret-row">
        <code class="mfa-secret" data-testid="mfa-enroll-secret">{{ secretBase32 }}</code>
        <button type="button" class="btn btn-sm" @click="copySecret">
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <button class="btn btn-primary" data-testid="mfa-enroll-scan-next" @click="step = 'confirm'">Next</button>
    </div>

    <!-- Step 2: confirm with first TOTP code -->
    <div v-else-if="step === 'confirm'" data-testid="mfa-enroll-step-confirm">
      <h2 class="mfa-step-title">Verify your code</h2>
      <form class="auth-form" data-testid="mfa-enroll-confirm-form" @submit="onConfirm">
        <label class="auth-field">
          <span>6-digit code</span>
          <input
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            v-model="code"
            v-bind="codeAttrs"
            placeholder="000000"
            maxlength="6"
            required
            data-testid="mfa-enroll-code-input"
          />
          <span v-if="errors.code" class="auth-error" data-testid="mfa-enroll-code-error">{{ errors.code }}</span>
        </label>

        <p v-if="remoteError" class="auth-remote-error" role="alert" data-testid="mfa-enroll-error">{{ remoteError }}</p>

        <button
          type="submit"
          class="btn btn-primary"
          data-testid="mfa-enroll-confirm-submit"
          :disabled="totpConfirm.isPending.value"
        >
          <span v-if="totpConfirm.isPending.value">Confirming…</span>
          <span v-else>Confirm</span>
        </button>
        <button type="button" class="btn btn-ghost" @click="step = 'scan'">Back</button>
      </form>
    </div>

    <!-- Step 3: done — show recovery codes -->
    <div v-else-if="step === 'done'" data-testid="mfa-enroll-step-done">
      <h2 class="mfa-step-title">Save your recovery codes</h2>
      <p>
        Store these codes somewhere safe. Each can be used once to sign in if you lose
        access to your authenticator app.
      </p>
      <ul class="mfa-recovery-list" data-testid="mfa-recovery-list">
        <li v-for="rc in recoveryCodes" :key="rc" class="mfa-recovery-code" data-testid="mfa-recovery-code">
          <code>{{ rc }}</code>
        </li>
      </ul>
      <p class="mfa-warning" data-testid="mfa-recovery-warning">You will not be able to see these codes again.</p>
    </div>
  </div>
</template>
