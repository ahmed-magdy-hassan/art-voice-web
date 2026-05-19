<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { mfaChallengeFormSchema } from '../lib/schema'
import { useVerifyMfa } from '../api/use-verify-mfa'

const props = defineProps<{ challengeId: string }>()
const emit = defineEmits<{ success: [{ userId: string; tenantId: string }] }>()

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(mfaChallengeFormSchema),
})
const [code, codeAttrs] = defineField('code')
const remoteError = ref<string | null>(null)
const verifyMfa = useVerifyMfa()

const onSubmit = handleSubmit(async (values) => {
  remoteError.value = null
  try {
    const result = await verifyMfa.mutateAsync({
      challengeId: props.challengeId,
      code: values.code,
    })
    emit('success', result)
  } catch (err: unknown) {
    // h3 surfaces the code in both the response statusText (→ ofetch
    // err.statusMessage) and the JSON body (→ err.data.statusMessage). Prefer
    // the body: statusText doesn't always survive proxies/interceptors.
    const e = err as { statusMessage?: string; data?: { statusMessage?: string } }
    const message = e.data?.statusMessage ?? e.statusMessage
    remoteError.value =
      message === 'mfa_code_invalid'
        ? 'Incorrect code. Try again or use a recovery code.'
        : message === 'mfa_challenge_invalid'
          ? 'This challenge has expired. Please sign in again.'
          : 'Verification is temporarily unavailable.'
  }
})
</script>

<template>
  <form class="auth-form" data-testid="mfa-challenge-form" @submit="onSubmit">
    <p class="auth-sub">Enter the 6-digit code from your authenticator app, or a recovery code.</p>

    <label class="auth-field">
      <span>Code</span>
      <input
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        v-model="code"
        v-bind="codeAttrs"
        placeholder="000000"
        maxlength="64"
        data-testid="mfa-code-input"
        required
      />
      <span v-if="errors.code" class="auth-error" data-testid="mfa-code-error">{{ errors.code }}</span>
    </label>

    <p v-if="remoteError" class="auth-remote-error" role="alert" data-testid="auth-error">{{ remoteError }}</p>

    <button
      type="submit"
      class="btn btn-primary"
      :disabled="verifyMfa.isPending.value"
      data-testid="mfa-submit"
    >
      <span v-if="verifyMfa.isPending.value">Verifying…</span>
      <span v-else>Verify</span>
    </button>

    <p class="auth-foot">
      <NuxtLink to="/sign-in">Back to sign in</NuxtLink>
    </p>
  </form>
</template>
