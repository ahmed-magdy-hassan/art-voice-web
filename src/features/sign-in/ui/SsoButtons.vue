<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

type Provider = 'google' | 'microsoft'

const providers: Array<{ id: Provider; label: string }> = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'microsoft', label: 'Continue with Microsoft' },
]

function startSso(provider: Provider) {
  // BFF redirects to IdP — navigate the browser there.
  window.location.href = `/api/auth/sso-authorize?provider=${provider}`
}
</script>

<template>
  <div class="sso-buttons">
    <button
      v-for="p in providers"
      :key="p.id"
      type="button"
      class="btn btn-outline sso-btn"
      @click="startSso(p.id)"
    >
      {{ p.label }}
    </button>
  </div>
</template>
