<script setup lang="ts">
import { ref } from 'vue'
import { SignUpForm } from '@/features/sign-up'
import { useTheme } from '@/shared/lib/use-theme'
import { Check, Sun, Moon, Mail } from 'lucide-vue-next'

definePageMeta({ layout: 'guest', auth: 'guest' })

const { theme, toggle } = useTheme()
const submitted = ref(false)
const submittedEmail = ref('')

function onSuccess(_payload: { userId: string; tenantId: string; email?: string }) {
  submittedEmail.value = _payload.email ?? ''
  submitted.value = true
}

const features = [
  'Free to start — no credit card required',
  'Live transcription under 200ms latency',
  'AI coach insights after every session',
]
</script>

<template>
  <div class="auth-split" :data-theme="theme">
    <!-- LEFT — editorial brand panel -->
    <aside class="auth-panel">
      <div class="auth-panel-logo">
        <span class="auth-mark">av</span>
        <span class="auth-brandname">Art<em>·</em>Voice</span>
      </div>

      <div class="auth-panel-body">
        <div class="t-caps" style="color: var(--accent); margin-bottom: 14px">Studio & Editorial</div>
        <h1 class="auth-panel-headline">
          A studio for your <em>working</em> voice.
        </h1>
        <p class="auth-panel-sub">
          Live transcription, real-time coaching, and consent-first voice cloning — built for sales, CX, and ops teams.
        </p>
        <ul class="auth-panel-features">
          <li v-for="f in features" :key="f">
            <Check :size="14" class="auth-check-icon" />
            {{ f }}
          </li>
        </ul>
      </div>

      <div class="auth-panel-foot">
        <span class="t-mono">SOC 2 · GDPR · revocable consent</span><br />
        © 2026 Art-Voice Studios
      </div>
    </aside>

    <!-- RIGHT — form / success -->
    <main class="auth-form-col auth-form-col--scroll">
      <button
        type="button"
        class="auth-theme-btn"
        :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
        @click="toggle"
      >
        <Sun v-if="theme === 'dark'" :size="14" />
        <Moon v-else :size="14" />
      </button>

      <div class="auth-form-inner">
        <!-- FORM STATE -->
        <template v-if="!submitted">
          <div class="t-caps" style="margin-bottom: 6px">Create your workspace</div>
          <h2 class="auth-form-title">Start for free.</h2>
          <p class="auth-form-sub">
            Already have an account?
            <NuxtLink to="/sign-in" class="auth-link" data-testid="sign-in-link">Sign in</NuxtLink>
          </p>

          <SignUpForm @success="onSuccess" />

          <p class="auth-legal">
            By creating an account you agree to the
            <a href="#" class="auth-legal-link">Terms</a> and
            <a href="#" class="auth-legal-link">Privacy</a> policy.
          </p>
        </template>

        <!-- SUCCESS STATE -->
        <template v-else>
          <div class="auth-success-icon">
            <Mail :size="22" />
          </div>
          <h2 class="auth-form-title" style="margin-top: 20px" data-testid="sign-up-success">Check your inbox.</h2>
          <p class="auth-form-sub" style="margin-top: 8px; max-width: 36ch">
            We sent a verification link{{ submittedEmail ? ` to ${submittedEmail}` : '' }}.
            Click it to finish setting up your account.
          </p>
          <div class="auth-success-hint">
            Didn't get it? Check your spam folder, or
            <NuxtLink to="/sign-in" class="auth-link">sign in again</NuxtLink>
            to resend.
          </div>
        </template>
      </div>
    </main>
  </div>
</template>
