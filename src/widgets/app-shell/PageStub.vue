<script setup lang="ts">
interface Props {
  eyebrow: string
  title: string
  description: string
}
defineProps<Props>()
</script>

<template>
  <div class="grid gap-6 px-8 py-10">
    <div>
      <div class="t-caps mb-[6px]">{{ eyebrow }}</div>
      <h2
        class="t-display m-0"
        style="font-size: 48px; line-height: 1.05; letter-spacing: -0.02em"
      >
        <slot name="title"><em class="italic" style="color: var(--accent)">{{ title }}</em></slot>
      </h2>
      <p class="mt-3 max-w-[60ch] text-[15px] leading-[1.6] text-fg-muted">
        {{ description }}
      </p>
    </div>
    <div class="rounded-md border border-dashed border-border bg-subtle/40 p-10">
      <p class="text-[13px] text-fg-subtle">
        This screen is scaffolded as part of the design-system handoff. Implementation lives in
        a follow-up Jira story under the relevant epic.
      </p>
    </div>
  </div>
</template>
