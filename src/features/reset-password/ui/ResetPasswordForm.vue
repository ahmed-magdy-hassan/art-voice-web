<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { resetPasswordFormSchema } from '../lib/schema'
import { useResetPassword } from '../api/use-reset-password'

const props = defineProps<{ token: string }>()
const emit = defineEmits<{ success: [] }>()

const { handleSubmit, defineField, errors, setFieldValue } = useForm({
  validationSchema: toTypedSchema(resetPasswordFormSchema),
})
// Seed token from props (read from query param in the page).
setFieldValue('token', props.token)
const [newPassword, newPasswordAttrs] = defineField('newPassword')
const [confirmPassword, confirmAttrs] = defineField('confirmPassword')

const remoteError = ref<string | null>(null)
const resetPassword = useResetPassword()

const onSubmit = handleSubmit(async (values) => {
  remoteError.value = null
  try {
    await resetPassword.mutateAsync({
      token: values.token,
      newPassword: values.newPassword,
    })
    emit('success')
  } catch (err: unknown) {
    const status = (err as { statusMessage?: string }).statusMessage
    remoteError.value =
      status === 'password_reset_failed'
        ? 'The reset link is invalid or expired. Request a new one.'
        : 'Could not reset your password right now. Please try again.'
  }
})
</script>

<template>
  <form class="auth-form" data-testid="reset-password-form" @submit="onSubmit">
    <label class="auth-field">
      <span>New password</span>
      <input
        type="password"
        v-model="newPassword"
        v-bind="newPasswordAttrs"
        autocomplete="new-password"
        data-testid="new-password-input"
        required
      />
      <span v-if="errors.newPassword" class="auth-error" data-testid="new-password-error">{{ errors.newPassword }}</span>
    </label>
    <label class="auth-field">
      <span>Confirm new password</span>
      <input
        type="password"
        v-model="confirmPassword"
        v-bind="confirmAttrs"
        autocomplete="new-password"
        data-testid="confirm-password-input"
        required
      />
      <span v-if="errors.confirmPassword" class="auth-error" data-testid="confirm-password-error">{{ errors.confirmPassword }}</span>
    </label>

    <p v-if="remoteError" class="auth-remote-error" role="alert" data-testid="auth-error">{{ remoteError }}</p>

    <button
      type="submit"
      class="btn btn-primary"
      :disabled="resetPassword.isPending.value"
      data-testid="reset-password-submit"
    >
      <span v-if="resetPassword.isPending.value">Saving…</span>
      <span v-else>Reset password</span>
    </button>
  </form>
</template>
