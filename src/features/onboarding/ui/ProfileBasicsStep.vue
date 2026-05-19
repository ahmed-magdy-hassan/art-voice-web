<script setup lang="ts">
import { useVoiceProfile, useUpdateVoiceProfile } from '@/features/voice-profile/api/use-voice-profile'
import Select from '@/shared/ui/select/Select.vue'

const emit = defineEmits<{ done: [] }>()

const { data: profile, isPending } = useVoiceProfile()
const { mutate: updateProfile, isPending: saving, error } = useUpdateVoiceProfile()

const displayName = ref('')
const role = ref('')
const language = ref('')

watch(
  profile,
  (p) => {
    if (!p) return
    displayName.value = p.displayName ?? ''
    role.value = p.role ?? ''
    language.value = p.language ?? ''
  },
  { immediate: true },
)

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
]

const isValid = computed(() => displayName.value.trim().length > 0)

function save() {
  if (!isValid.value) return
  updateProfile(
    {
      displayName: displayName.value.trim() || null,
      role: role.value.trim() || null,
      language: language.value || null,
    },
    { onSuccess: () => emit('done') },
  )
}
</script>

<template>
  <div v-if="isPending" class="space-y-3">
    <div class="h-10 animate-pulse rounded-lg bg-[var(--subtle)]" />
    <div class="h-10 animate-pulse rounded-lg bg-[var(--subtle)]" />
    <div class="h-10 animate-pulse rounded-lg bg-[var(--subtle)]" />
  </div>

  <form v-else class="space-y-4" @submit.prevent="save">
    <div class="field">
      <label class="field-label" for="ob-display-name">Display name <span class="text-red-500">*</span></label>
      <input
        id="ob-display-name"
        v-model="displayName"
        class="input"
        type="text"
        maxlength="100"
        placeholder="e.g. Sarah Chen"
        autocomplete="name"
      />
    </div>

    <div class="field">
      <label class="field-label" for="ob-role">Your role</label>
      <input
        id="ob-role"
        v-model="role"
        class="input"
        type="text"
        maxlength="100"
        placeholder="e.g. Sales Manager, Coach, Presenter"
        autocomplete="organization-title"
      />
    </div>

    <Select
      v-model="language"
      label="Language you coach in"
      placeholder="Pick a language…"
      :options="LANGUAGE_OPTIONS"
    />

    <p v-if="error" class="text-[12px] text-red-500">
      Failed to save — please try again.
    </p>

    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="!isValid || saving"
    >
      {{ saving ? 'Saving…' : 'Save & continue' }}
    </button>
  </form>
</template>
