<script setup lang="ts">
useHead({ title: 'Dashboard — Art-Voice' })
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-2xl font-semibold">Welcome back</h1>
      <p class="text-muted-foreground">Track your voice, improve your skills and unlock your full potential.</p>
    </header>
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-lg border border-border p-4">
        <div class="text-sm text-muted-foreground">Overall Voice Score</div>
        <div class="text-3xl font-bold mt-1">—</div>
      </div>
      <div class="rounded-lg border border-border p-4">
        <div class="text-sm text-muted-foreground">Analyses Completed</div>
        <div class="text-3xl font-bold mt-1">—</div>
      </div>
      <div class="rounded-lg border border-border p-4">
        <div class="text-sm text-muted-foreground">Training Streak</div>
        <div class="text-3xl font-bold mt-1">—</div>
      </div>
      <div class="rounded-lg border border-border p-4">
        <div class="text-sm text-muted-foreground">Total Listening Time</div>
        <div class="text-3xl font-bold mt-1">—</div>
      </div>
    </section>
  </div>
</template>
