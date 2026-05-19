<script setup lang="ts">
import { useVoiceProfile, useUpdateVoiceProfile } from '../api/use-voice-profile'

const { data, isPending } = useVoiceProfile()
const { mutate: save, isPending: saving } = useUpdateVoiceProfile()

const GOAL_OPTIONS = [
  'Clarity', 'Confidence', 'Pacing', 'Tone', 'Emphasis', 'Storytelling', 'Active listening',
]
const ACCENT_OPTIONS = [
  'General American', 'British RP', 'Australian', 'Irish', 'South African', 'Indian', 'Other',
]

const displayName = ref('')
const role = ref('')
const bio = ref('')
const language = ref('')
const accent = ref('')
const goals = ref<string[]>([])
const dirty = ref(false)

watch(data, (d) => {
  if (!d) return
  displayName.value = d.displayName ?? ''
  role.value = d.role ?? ''
  bio.value = d.bio ?? ''
  language.value = d.language ?? ''
  accent.value = d.accent ?? ''
  goals.value = [...(d.goals ?? [])]
}, { immediate: true })

function toggleGoal(g: string) {
  const idx = goals.value.indexOf(g)
  if (idx === -1) goals.value.push(g)
  else goals.value.splice(idx, 1)
  dirty.value = true
}

function onInput() { dirty.value = true }

function submit() {
  save({
    displayName: displayName.value.trim() || null,
    role: role.value.trim() || null,
    bio: bio.value.trim() || null,
    language: language.value || null,
    accent: accent.value || null,
    goals: goals.value,
  }, { onSuccess: () => { dirty.value = false } })
}
</script>

<template>
  <div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
    <h3 class="mb-5 text-[14px] font-medium">Edit voice profile</h3>

    <div v-if="isPending" class="space-y-4">
      <div v-for="i in 4" :key="i" class="h-10 animate-pulse rounded-lg bg-[var(--subtle)]" />
    </div>

    <form v-else class="space-y-5" @submit.prevent="submit">
      <div class="flex flex-col gap-1">
        <label class="text-[12px] font-medium text-[var(--fg-muted)]">Display name</label>
        <input v-model="displayName" type="text" class="input" placeholder="How should we address you?" @input="onInput" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[12px] font-medium text-[var(--fg-muted)]">Your role</label>
        <input v-model="role" type="text" class="input" placeholder="e.g. Sales Manager, Coach, Presenter" @input="onInput" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[12px] font-medium text-[var(--fg-muted)]">Bio</label>
        <textarea v-model="bio" class="input resize-none" rows="2" placeholder="A short description about you…" @input="onInput" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[12px] font-medium text-[var(--fg-muted)]">Language</label>
        <select v-model="language" class="input" @change="onInput">
          <option value="">Select…</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-[12px] font-medium text-[var(--fg-muted)]">Accent / region</label>
        <select v-model="accent" class="input" @change="onInput">
          <option value="">Select…</option>
          <option v-for="a in ACCENT_OPTIONS" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-[12px] font-medium text-[var(--fg-muted)]">Coaching goals</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="g in GOAL_OPTIONS"
            :key="g"
            type="button"
            class="rounded-full border px-3 py-1 text-[12px] transition-colors"
            :class="
              goals.includes(g)
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--border)] bg-transparent text-[var(--fg-muted)] hover:border-[var(--accent)]'
            "
            @click="toggleGoal(g)"
          >
            {{ g }}
          </button>
        </div>
      </div>

      <div class="flex justify-end pt-1">
        <button type="submit" class="btn btn-primary btn-sm" :disabled="!dirty || saving">
          {{ saving ? 'Saving…' : 'Save changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
