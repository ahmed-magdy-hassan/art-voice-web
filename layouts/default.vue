<template>
  <div class="min-h-screen flex bg-background text-foreground">
    <aside class="w-64 border-r border-border p-4 hidden lg:block">
      <NuxtLink to="/" class="font-bold text-lg">VoiceAI</NuxtLink>
      <nav class="mt-6 space-y-1 text-sm">
        <NuxtLink to="/" class="block px-3 py-2 rounded-md hover:bg-accent">Dashboard</NuxtLink>
        <NuxtLink to="/analyses" class="block px-3 py-2 rounded-md hover:bg-accent">My Analyses</NuxtLink>
        <NuxtLink to="/profile" class="block px-3 py-2 rounded-md hover:bg-accent">Voice Profile</NuxtLink>
        <NuxtLink to="/upload" class="block px-3 py-2 rounded-md hover:bg-accent">Upload / Record</NuxtLink>
        <NuxtLink to="/live" class="block px-3 py-2 rounded-md hover:bg-accent">Live Analysis</NuxtLink>
        <NuxtLink to="/training" class="block px-3 py-2 rounded-md hover:bg-accent">Voice Training</NuxtLink>
        <NuxtLink to="/exercises" class="block px-3 py-2 rounded-md hover:bg-accent">Exercises</NuxtLink>
        <NuxtLink to="/coach" class="block px-3 py-2 rounded-md hover:bg-accent">AI Coach</NuxtLink>
        <NuxtLink to="/reports" class="block px-3 py-2 rounded-md hover:bg-accent">Reports</NuxtLink>
        <NuxtLink to="/cloning" class="block px-3 py-2 rounded-md hover:bg-accent">Voice Cloning</NuxtLink>
        <NuxtLink to="/compare" class="block px-3 py-2 rounded-md hover:bg-accent">Compare Voices</NuxtLink>
        <NuxtLink to="/marketplace" class="block px-3 py-2 rounded-md hover:bg-accent">Marketplace</NuxtLink>
        <NuxtLink to="/community" class="block px-3 py-2 rounded-md hover:bg-accent">Community</NuxtLink>
        <NuxtLink to="/billing" class="block px-3 py-2 rounded-md hover:bg-accent">Billing &amp; Plans</NuxtLink>
        <NuxtLink to="/api-access" class="block px-3 py-2 rounded-md hover:bg-accent">API Access</NuxtLink>
        <NuxtLink to="/settings" class="block px-3 py-2 rounded-md hover:bg-accent">Settings</NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 p-6 overflow-auto">
      <slot />
    </main>
  </div>
</template>
