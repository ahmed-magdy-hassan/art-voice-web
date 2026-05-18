<script setup lang="ts">
import { ForgotPasswordForm } from '@/features/forgot-password'

definePageMeta({ layout: false, auth: 'guest' })
</script>

<template>
  <div class="auth-page">
    <main class="auth-card">
      <h1 class="auth-title">Forgot your password?</h1>
      <p class="auth-sub">
        Enter your email and we'll send you a link to choose a new one.
      </p>
      <ForgotPasswordForm />
      <p class="auth-foot">
        <NuxtLink to="/sign-in">Back to sign in</NuxtLink>
      </p>
    </main>
  </div>
</template>
