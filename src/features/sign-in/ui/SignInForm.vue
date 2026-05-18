<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff } from 'lucide-vue-next'
import { signInFormSchema } from '../lib/schema'
import { useSignIn } from '../api/use-sign-in'

const emit = defineEmits<{ success: [{ userId: string; tenantId: string }] }>()

const router = useRouter()
const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(signInFormSchema),
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const remoteError = ref<string | null>(null)
const attempts = ref(0)
const showPassword = ref(false)

const signIn = useSignIn()

const onSubmit = handleSubmit(async (values) => {
  remoteError.value = null
  try {
    const result = await signIn.mutateAsync(values)
    if ('mfaRequired' in result && result.mfaRequired) {
      await router.push({ path: '/mfa-challenge', query: { challengeId: result.challengeId } })
      return
    }
    if (!('mfaRequired' in result)) emit('success', result)
  } catch (err: unknown) {
    attempts.value += 1
    const message = (err as { statusMessage?: string }).statusMessage
    remoteError.value =
      message === 'invalid_credentials'
        ? 'We didn\'t recognise that email and password.'
        : 'Sign-in is temporarily unavailable.'
  }
})
</script>

<template>
  <form class="auth-fields" data-testid="sign-in-form" @submit.prevent="onSubmit">
    <div class="field">
      <label class="field-label" for="signin-email">Work email</label>
      <input
        id="signin-email"
        v-model="email"
        v-bind="emailAttrs"
        class="input input-lg"
        :class="{ 'is-invalid': errors.email }"
        type="email"
        placeholder="you@studio.com"
        autocomplete="email"
        data-testid="email-input"
        required
      />
      <span v-if="errors.email" class="field-error" data-testid="email-input-error">{{ errors.email }}</span>
    </div>

    <div class="field">
      <div class="field-label-row">
        <label class="field-label" for="signin-password">Password</label>
        <NuxtLink to="/forgot-password" class="auth-link" style="font-size: 12px" data-testid="forgot-password-link">Forgot password?</NuxtLink>
      </div>
      <div class="input-group">
        <input
          id="signin-password"
          v-model="password"
          v-bind="passwordAttrs"
          class="input input-lg has-trailing"
          :class="{ 'is-invalid': errors.password }"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          data-testid="password-input"
          required
        />
        <button
          type="button"
          class="btn-icon btn-icon-sm trailing"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          @click="showPassword = !showPassword"
        >
          <EyeOff v-if="showPassword" :size="12" />
          <Eye v-else :size="12" />
        </button>
      </div>
      <span v-if="errors.password" class="field-error" data-testid="password-input-error">{{ errors.password }}</span>
    </div>

    <p v-if="remoteError" class="field-error auth-remote-error" role="alert" data-testid="auth-error">{{ remoteError }}</p>
    <p v-if="attempts >= 3" class="auth-retry">
      Still stuck? <NuxtLink to="/forgot-password" class="auth-link">Reset your password.</NuxtLink>
    </p>

    <button
      type="submit"
      class="btn btn-primary btn-lg auth-submit"
      :disabled="signIn.isPending.value"
      data-testid="sign-in-submit"
    >
      <span v-if="signIn.isPending.value">Signing in…</span>
      <span v-else>Sign in</span>
    </button>
  </form>
</template>
