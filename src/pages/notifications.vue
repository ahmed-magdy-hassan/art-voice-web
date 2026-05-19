<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { NotificationsPage } from '@/widgets/notifications-page'
</script>

<template>
  <AppShell title="Notifications">
    <NotificationsPage />
  </AppShell>
</template>
