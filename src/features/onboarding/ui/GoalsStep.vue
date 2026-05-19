<script setup lang="ts">
import { useUpdateVoiceProfile } from '@/features/voice-profile/api/use-voice-profile'

const emit = defineEmits<{ done: [] }>()
const { mutate: updateProfile, isPending: saving, error } = useUpdateVoiceProfile()

const GOALS = [
  { key: 'clarity',          label: 'Clarity',           description: 'Speak more clearly and precisely' },
  { key: 'confidence',       label: 'Confidence',        description: 'Sound assured and authoritative' },
  { key: 'pacing',           label: 'Pacing',            description: 'Control your speaking rhythm' },
  { key: 'tone',             label: 'Tone',              description: 'Match tone to context and audience' },
  { key: 'emphasis',         label: 'Emphasis',          description: 'Stress the right words' },
  { key: 'storytelling',     label: 'Storytelling',      description: 'Structure compelling narratives' },
  { key: 'active_listening', label: 'Active listening',  description: 'Engage and respond naturally' },
  { key: 'filler_words',     label: 'Reduce filler words', description: 'Eliminate "um", "uh", "like"' },
]

const selected = ref<string[]>([])

function toggle(key: string) {
  const idx = selected.value.indexOf(key)
  if (idx === -1) selected.value.push(key)
  else selected.value.splice(idx, 1)
}

function save() {
  updateProfile(
    { goals: selected.value },
    { onSuccess: () => emit('done') },
  )
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="goal in GOALS"
        :key="goal.key"
        type="button"
        class="flex flex-col items-start rounded-lg border px-3 py-3 text-left transition-colors"
        :class="
          selected.includes(goal.key)
            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]'
            : 'border-[var(--border)] bg-[var(--subtle)] hover:border-[var(--accent)]'
        "
        @click="toggle(goal.key)"
      >
        <span class="text-[13px] font-medium" :class="selected.includes(goal.key) ? 'text-[var(--accent)]' : 'text-[var(--fg)]'">
          {{ goal.label }}
        </span>
        <span class="text-[11px] text-[var(--fg-subtle)]">{{ goal.description }}</span>
      </button>
    </div>

    <p v-if="error" class="text-[12px] text-red-500">Failed to save goals — please try again.</p>

    <button
      type="button"
      class="btn btn-primary w-full"
      :disabled="selected.length === 0 || saving"
      @click="save"
    >
      {{ saving ? 'Saving…' : 'Set goals' }}
    </button>

    <p v-if="selected.length === 0" class="text-center text-[11px] text-[var(--fg-subtle)]">
      Pick at least one goal to continue
    </p>
  </div>
</template>
