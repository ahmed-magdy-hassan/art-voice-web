<script setup lang="ts">
import { SignInForm } from '@/features/sign-in'
import { WebAuthnSignInButton } from '@/features/webauthn'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/shared/lib/use-theme'
import { Check, Sun, Moon } from 'lucide-vue-next'

definePageMeta({ layout: 'guest', auth: 'guest' })

const router = useRouter()
const route = useRoute()
const { theme, toggle } = useTheme()

function onSuccess() {
  const back = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  router.replace(back)
}

const features = [
  'Live transcript with confidence, latency, and speaker diarization',
  "Coaching that names what to do, not what's wrong",
  'Consent-first voice cloning — revocable, expirable, audited',
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
        <div class="t-caps" style="color: var(--accent); margin-bottom: 14px">For voice professionals</div>
        <h1 class="auth-panel-headline">
          The studio for your <em>working</em> voice.
        </h1>
        <p class="auth-panel-sub">
          Train, analyse, and refine. Coach insights in real time, weekly reports you can act on, and a private studio for your own voice clones.
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

    <!-- RIGHT — form -->
    <main class="auth-form-col">
      <!-- Theme toggle -->
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
        <div class="t-caps" style="margin-bottom: 6px">Sign in to Art-Voice</div>
        <h2 class="auth-form-title">Welcome back.</h2>
        <p class="auth-form-sub">
          New here?
          <NuxtLink to="/sign-up" class="auth-link">Create an account</NuxtLink>
        </p>

        <!-- SSO buttons -->
        <div class="auth-sso-stack">
          <a href="/api/auth/sso-authorize?provider=google" class="btn btn-secondary auth-sso-btn" data-testid="sso-google">
            <!-- Google G -->
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path fill="#4285F4" d="M13.7 7.16c0-.48-.04-.94-.12-1.39H7v2.63h3.76a3.22 3.22 0 0 1-1.4 2.11v1.75h2.26c1.32-1.22 2.08-3.01 2.08-5.1z"/>
              <path fill="#34A853" d="M7 14c1.89 0 3.48-.63 4.64-1.7l-2.26-1.75c-.63.42-1.43.66-2.38.66-1.83 0-3.39-1.23-3.94-2.9H.72v1.81C1.87 12.39 4.23 14 7 14z"/>
              <path fill="#FBBC05" d="M3.06 8.31a4.21 4.21 0 0 1 0-2.62V3.88H.72A7 7 0 0 0 0 7c0 1.13.27 2.2.72 3.12l2.34-1.81z"/>
              <path fill="#EA4335" d="M7 2.78c1.03 0 1.96.35 2.69 1.05l2.02-2.02C10.48.7 8.89 0 7 0 4.23 0 1.87 1.61.72 3.88l2.34 1.81c.55-1.67 2.11-2.91 3.94-2.91z"/>
            </svg>
            Continue with Google
          </a>
          <a href="/api/auth/sso-authorize?provider=microsoft" class="btn btn-secondary auth-sso-btn" data-testid="sso-microsoft">
            <!-- Microsoft squares -->
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <rect x="0" y="0" width="6.5" height="6.5" fill="#F25022"/>
              <rect x="7.5" y="0" width="6.5" height="6.5" fill="#7FBA00"/>
              <rect x="0" y="7.5" width="6.5" height="6.5" fill="#00A4EF"/>
              <rect x="7.5" y="7.5" width="6.5" height="6.5" fill="#FFB900"/>
            </svg>
            Continue with Microsoft
          </a>
          <a href="/api/auth/sso-authorize?provider=okta" class="btn btn-secondary auth-sso-btn" data-testid="sso-okta">
            <!-- Okta circle -->
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="7" cy="7" r="6.2" fill="none" stroke="#007DC1" stroke-width="2.4"/>
            </svg>
            Continue with Okta
          </a>
        </div>

        <div class="auth-divider">
          <span class="t-mono" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em">or with email</span>
        </div>

        <SignInForm @success="onSuccess" />

        <!-- Passkey shortcut -->
        <div class="auth-passkey-bar">
          <WebAuthnSignInButton @success="onSuccess" @error="() => {}" />
        </div>

        <p class="auth-legal">
          By signing in you agree to the
          <a href="#" class="auth-legal-link">Terms</a> and
          <a href="#" class="auth-legal-link">Privacy</a> policy.
        </p>
      </div>
    </main>
  </div>
</template>
