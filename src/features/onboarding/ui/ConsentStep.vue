<script setup lang="ts">
const emit = defineEmits<{ done: [] }>()
const agreed = ref(false)
</script>

<template>
  <div class="space-y-5">
    <!-- What we collect -->
    <div class="space-y-3 text-[13px] text-[var(--fg-muted)]">
      <p class="font-medium text-[var(--fg)]">What we collect and why</p>
      <ul class="space-y-2 pl-4">
        <li class="list-disc">
          <span class="font-medium text-[var(--fg)]">Voice recordings</span> — analysed to measure clarity, pacing, tone, and other coaching signals.
        </li>
        <li class="list-disc">
          <span class="font-medium text-[var(--fg)]">Speaker embedding</span> — a numeric fingerprint used to personalise your baseline. Never shared.
        </li>
        <li class="list-disc">
          <span class="font-medium text-[var(--fg)]">Usage data</span> — session counts and feature interactions used to improve the product.
        </li>
      </ul>

      <p class="font-medium text-[var(--fg)]">Your rights</p>
      <ul class="space-y-2 pl-4">
        <li class="list-disc">You can delete your recordings and voice fingerprint at any time from Settings.</li>
        <li class="list-disc">We do not sell your data or use it to train third-party models.</li>
        <li class="list-disc">Data is retained for 90 days after account deletion.</li>
      </ul>
    </div>

    <!-- Consent checkbox -->
    <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] p-4">
      <input
        v-model="agreed"
        type="checkbox"
        class="mt-[2px] shrink-0 accent-[var(--accent)]"
      />
      <span class="text-[13px] leading-relaxed text-[var(--fg-muted)]">
        I have read and understood the above. I consent to Art Voice processing my voice recordings to generate personalised coaching feedback.
      </span>
    </label>

    <button
      type="button"
      class="btn btn-primary w-full"
      :disabled="!agreed"
      @click="emit('done')"
    >
      I agree, let's go
    </button>
  </div>
</template>
