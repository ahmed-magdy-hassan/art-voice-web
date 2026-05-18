<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell, PageStub } from '@/widgets/app-shell'
</script>

<template>
  <AppShell title="Team">
    <PageStub
      eyebrow="Team"
      title="Seats and roles"
      description="Member list with role pills, invite flow, and permission scopes."
    />
  </AppShell>
</template>
