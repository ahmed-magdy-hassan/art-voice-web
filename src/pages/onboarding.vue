<script setup lang="ts">
definePageMeta({ auth: 'protected', layout: false })
import { OnboardingWizard } from '@/features/onboarding'
</script>

<template>
  <OnboardingWizard />
</template>
