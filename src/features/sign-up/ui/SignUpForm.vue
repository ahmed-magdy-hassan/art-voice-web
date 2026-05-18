<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff, Check } from 'lucide-vue-next'
import { signUpFormSchema, passwordStrength, strengthLabels, strengthTones } from '../lib/schema'
import { useSignUp } from '../api/use-sign-up'

const emit = defineEmits<{ success: [{ userId: string; tenantId: string }] }>()

const { handleSubmit, defineField, values, errors, setFieldValue } = useForm({
  validationSchema: toTypedSchema(signUpFormSchema),
})

const [email, emailAttrs]               = defineField('email')
const [password, passwordAttrs]         = defineField('password')
const [confirmPassword, confirmAttrs]   = defineField('confirmPassword')
const [orgName, orgAttrs]               = defineField('orgName')
const [gender]                          = defineField('gender')

const remoteError    = ref<string | null>(null)
const showPassword   = ref(false)
const showConfirm    = ref(false)
const signUp         = useSignUp()

// ── Password strength ──────────────────────────────────────────────────
const strength      = computed(() => passwordStrength(values.password ?? ''))
const strengthLabel = computed(() => strengthLabels[strength.value])
const strengthTone  = computed(() => strengthTones[strength.value])

// ── intl-tel-input ─────────────────────────────────────────────────────
const phoneInputEl = ref<HTMLInputElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let iti: any = null

onMounted(async () => {
  if (!phoneInputEl.value) return
  const { default: intlTelInput } = await import('intl-tel-input')
  iti = intlTelInput(phoneInputEl.value, {
    initialCountry: 'us',
    loadUtils: () => import('intl-tel-input/utils'),
    separateDialCode: true,
  })
  phoneInputEl.value.addEventListener('input', () => {
    if (iti) setFieldValue('phone', iti.getNumber())
  })
  phoneInputEl.value.addEventListener('countrychange', () => {
    if (iti) setFieldValue('phone', iti.getNumber())
  })
})

onBeforeUnmount(() => { iti?.destroy() })

// ── Gender options ─────────────────────────────────────────────────────
const genderOptions = [
  { value: 'male',              label: 'Male',              icon: 'male' },
  { value: 'female',            label: 'Female',            icon: 'female' },
  { value: 'non_binary',        label: 'Non-binary',        icon: 'non_binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: 'prefer_not_to_say' },
] as const

// ── Submit ─────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async (form) => {
  remoteError.value = null
  try {
    const result = await signUp.mutateAsync({
      email: form.email,
      password: form.password,
      orgName: form.orgName?.trim() || undefined,
    })
    emit('success', { userId: result.userId, tenantId: result.tenantId })
  } catch (err: unknown) {
    const status = (err as { statusMessage?: string }).statusMessage
    remoteError.value =
      status === 'registration_failed'
        ? "We couldn't complete sign-up. If you already have an account, sign in instead."
        : 'Sign-up is temporarily unavailable.'
  }
})
</script>

<template>
  <div class="signup-form-root">
    <!-- SSO buttons -->
    <div class="auth-sso-stack">
      <a href="/api/auth/sso-authorize?provider=google" class="btn btn-secondary auth-sso-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path fill="#4285F4" d="M13.7 7.16c0-.48-.04-.94-.12-1.39H7v2.63h3.76a3.22 3.22 0 0 1-1.4 2.11v1.75h2.26c1.32-1.22 2.08-3.01 2.08-5.1z"/>
          <path fill="#34A853" d="M7 14c1.89 0 3.48-.63 4.64-1.7l-2.26-1.75c-.63.42-1.43.66-2.38.66-1.83 0-3.39-1.23-3.94-2.9H.72v1.81C1.87 12.39 4.23 14 7 14z"/>
          <path fill="#FBBC05" d="M3.06 8.31a4.21 4.21 0 0 1 0-2.62V3.88H.72A7 7 0 0 0 0 7c0 1.13.27 2.2.72 3.12l2.34-1.81z"/>
          <path fill="#EA4335" d="M7 2.78c1.03 0 1.96.35 2.69 1.05l2.02-2.02C10.48.7 8.89 0 7 0 4.23 0 1.87 1.61.72 3.88l2.34 1.81c.55-1.67 2.11-2.91 3.94-2.91z"/>
        </svg>
        Continue with Google
      </a>
      <a href="/api/auth/sso-authorize?provider=microsoft" class="btn btn-secondary auth-sso-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="0" y="0" width="6.5" height="6.5" fill="#F25022"/>
          <rect x="7.5" y="0" width="6.5" height="6.5" fill="#7FBA00"/>
          <rect x="0" y="7.5" width="6.5" height="6.5" fill="#00A4EF"/>
          <rect x="7.5" y="7.5" width="6.5" height="6.5" fill="#FFB900"/>
        </svg>
        Continue with Microsoft
      </a>
      <a href="/api/auth/sso-authorize?provider=okta" class="btn btn-secondary auth-sso-btn">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="7" cy="7" r="6.2" fill="none" stroke="#007DC1" stroke-width="2.4"/>
        </svg>
        Continue with Okta
      </a>
    </div>

    <div class="auth-divider">
      <span class="t-mono" style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em">or with email</span>
    </div>

    <!-- Email / password fields -->
    <form class="auth-fields" data-testid="sign-up-form" @submit.prevent="onSubmit">

      <!-- ── Account ── -->
      <div class="field-section">
        <p class="field-section-label">Account</p>

        <!-- Email -->
        <div class="field">
          <label class="field-label" for="signup-email">Work email</label>
          <input
            id="signup-email"
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

        <!-- Password -->
        <div class="field">
          <label class="field-label" for="signup-password">Password</label>
          <div class="input-group">
            <input
              id="signup-password"
              v-model="password"
              v-bind="passwordAttrs"
              class="input input-lg has-trailing"
              :class="{ 'is-invalid': errors.password }"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
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

          <!-- Strength meter -->
          <div v-if="values.password" class="pw-meter" :data-tone="strengthTone" aria-live="polite" aria-atomic="true">
            <div class="pw-meter-bars">
              <div
                v-for="i in 4"
                :key="i"
                class="pw-meter-bar"
                :class="{ active: i <= strength }"
              />
            </div>
            <span class="pw-meter-label">{{ strengthLabel }}</span>
          </div>
          <span v-if="errors.password" class="field-error" data-testid="password-input-error">{{ errors.password }}</span>
        </div>

        <!-- Confirm password -->
        <div class="field">
          <label class="field-label" for="signup-confirm">Confirm password</label>
          <div class="input-group">
            <input
              id="signup-confirm"
              v-model="confirmPassword"
              v-bind="confirmAttrs"
              class="input input-lg has-trailing"
              :class="{ 'is-invalid': errors.confirmPassword }"
              :type="showConfirm ? 'text' : 'password'"
              autocomplete="new-password"
              required
            />
            <button
              type="button"
              class="btn-icon btn-icon-sm trailing"
              :aria-label="showConfirm ? 'Hide password' : 'Show password'"
              @click="showConfirm = !showConfirm"
            >
              <EyeOff v-if="showConfirm" :size="12" />
              <Eye v-else :size="12" />
            </button>
            <span
              v-if="values.confirmPassword && !errors.confirmPassword && values.password === values.confirmPassword"
              class="pw-match-check"
              aria-label="Passwords match"
            >
              <Check :size="12" />
            </span>
          </div>
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>
      </div>

      <!-- ── Personal ── -->
      <div class="field-section">
        <p class="field-section-label">Personal <span class="field-section-optional">(optional)</span></p>

        <!-- Gender -->
        <div class="field">
          <span class="field-label" id="gender-label">Gender</span>
          <div class="gender-group" role="radiogroup" aria-labelledby="gender-label">
            <label
              v-for="opt in genderOptions"
              :key="opt.value"
              class="gender-option"
              :class="{ selected: gender === opt.value }"
            >
              <input
                type="radio"
                name="gender"
                :value="opt.value"
                class="sr-only"
                :checked="gender === opt.value"
                @change="setFieldValue('gender', opt.value)"
              />
              <!-- Male icon: single silhouette -->
              <svg v-if="opt.icon === 'male'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="gender-icon">
                <circle cx="12" cy="7" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
              </svg>
              <!-- Female icon: dress/skirt silhouette -->
              <svg v-else-if="opt.icon === 'female'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="gender-icon">
                <circle cx="12" cy="7" r="4"/><path d="M9 13l-3 8h12l-3-8"/>
              </svg>
              <!-- Non-binary icon: two overlapping silhouettes -->
              <svg v-else-if="opt.icon === 'non_binary'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="gender-icon">
                <circle cx="9" cy="7" r="3.5"/><path d="M4 21v-1.5A5.5 5.5 0 0 1 14 21"/><circle cx="17" cy="7" r="3.5" opacity=".5"/><path d="M12 20v-1.5A5.5 5.5 0 0 1 22 21" opacity=".5"/>
              </svg>
              <!-- Prefer not to say: minus/dash -->
              <svg v-else-if="opt.icon === 'prefer_not_to_say'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" class="gender-icon">
                <circle cx="12" cy="7" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/><line x1="9" y1="7" x2="15" y2="7" stroke="var(--surface)" stroke-width="2"/>
              </svg>
              {{ opt.label }}
            </label>
          </div>
        </div>

        <!-- Phone -->
        <div class="field">
          <label class="field-label" for="signup-phone">Phone</label>
          <div class="iti-wrapper">
            <input
              id="signup-phone"
              ref="phoneInputEl"
              class="input input-lg iti-input"
              type="tel"
              autocomplete="tel"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>

      <!-- ── Organization ── -->
      <div class="field-section">
        <p class="field-section-label">Organization <span class="field-section-optional">(optional)</span></p>

        <!-- Workspace name -->
        <div class="field">
          <label class="field-label" for="signup-org">Workspace name</label>
          <input
            id="signup-org"
            v-model="orgName"
            v-bind="orgAttrs"
            class="input input-lg"
            type="text"
            placeholder="Acme Corp"
            autocomplete="organization"
            data-testid="org-name-input"
          />
          <span v-if="errors.orgName" class="field-error">{{ errors.orgName }}</span>
        </div>
      </div>

      <p v-if="remoteError" class="field-error auth-remote-error" role="alert" data-testid="auth-error">{{ remoteError }}</p>

      <button
        type="submit"
        class="btn btn-primary btn-lg auth-submit"
        :disabled="signUp.isPending.value"
        data-testid="sign-up-submit"
      >
        <span v-if="signUp.isPending.value">Creating account…</span>
        <span v-else>Create account</span>
      </button>
    </form>
  </div>
</template>
