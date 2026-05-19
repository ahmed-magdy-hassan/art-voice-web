<script setup lang="ts">
definePageMeta({ auth: 'protected' })
import { AppShell } from '@/widgets/app-shell'
import { ProfileCompleteness, ProfileEditForm } from '@/features/voice-profile'
import { VoiceSamplesList } from '@/features/voice-samples'
</script>

<template>
  <AppShell title="Voice profile">
    <div class="grid gap-6 px-8 py-6">
      <header>
        <div class="t-caps mb-[6px]">Voice profile</div>
        <h2 class="t-display m-0" style="font-size: 36px; line-height: 1.1">
          Your <em class="italic" style="color: var(--accent)">voice identity</em>
        </h2>
        <p class="mt-2 text-[14px] text-fg-muted">Goals, samples, and profile data used to personalise your coaching.</p>
      </header>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <!-- Left column -->
        <div class="flex flex-col gap-6">
          <ProfileCompleteness />
          <VoiceSamplesList />
        </div>

        <!-- Right column -->
        <ProfileEditForm />
      </div>
    </div>
  </AppShell>
</template>
