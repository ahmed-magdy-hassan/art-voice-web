<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Billing">
    <PageStub
      eyebrow="Billing"
      title="Plans, invoices, seats"
      description="Plan cards with deliberate hierarchy. Invoices in a dense table. No gamified upsell."
    />
  </AppShell>
</template>
