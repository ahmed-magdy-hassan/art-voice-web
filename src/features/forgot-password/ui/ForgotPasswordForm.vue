<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { forgotPasswordFormSchema } from '../lib/schema'
import { useForgotPassword } from '../api/use-forgot-password'

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(forgotPasswordFormSchema),
})
const [email, emailAttrs] = defineField('email')

const submitted = ref(false)
const forgotPassword = useForgotPassword()

const onSubmit = handleSubmit(async (values) => {
  // Always show the same confirmation, regardless of whether the email
  // exists — matches the backend's no-enumeration contract.
  await forgotPassword.mutateAsync(values).catch(() => undefined)
  submitted.value = true
})
</script>

<template>
  <form v-if="!submitted" class="auth-form" data-testid="forgot-password-form" @submit="onSubmit">
    <label class="auth-field">
      <span>Email</span>
      <input
        type="email"
        v-model="email"
        v-bind="emailAttrs"
        autocomplete="email"
        data-testid="email-input"
        required
      />
      <span v-if="errors.email" class="auth-error" data-testid="email-input-error">{{ errors.email }}</span>
    </label>

    <button
      type="submit"
      class="btn btn-primary"
      :disabled="forgotPassword.isPending.value"
      data-testid="forgot-password-submit"
    >
      <span v-if="forgotPassword.isPending.value">Sending…</span>
      <span v-else>Send reset link</span>
    </button>
  </form>

  <p v-else class="auth-confirmation" role="status" data-testid="forgot-password-success">
    If an account exists for that email, we just sent a reset link. Check your
    inbox — the link expires in 30 minutes.
  </p>
</template>
