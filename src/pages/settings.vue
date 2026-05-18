<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Settings">
    <PageStub
      eyebrow="Settings"
      title="Calm, deliberate forms"
      description="Field-led forms with quiet hints and an honest destructive confirm. Plan cards live under Billing."
    />
  </AppShell>
</template>
