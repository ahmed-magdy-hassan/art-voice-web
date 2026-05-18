<script setup lang="ts" generic="T extends string | number">
// Select — reka-ui Select primitive styled as design-system .select-trigger
// + .menu. Single-value, keyboard-navigable, token-driven.
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from 'reka-ui'
import { ChevronDown, Check } from 'lucide-vue-next'

interface Option {
  value: T
  label: string
}

const props = defineProps<{
  modelValue?: T
  options: Option[]
  placeholder?: string
  label?: string
  disabled?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [T] }>()
</script>

<template>
  <div class="field">
    <label v-if="props.label" class="field-label">{{ props.label }}</label>
    <SelectRoot
      :model-value="props.modelValue as string"
      :disabled="props.disabled"
      @update:model-value="emit('update:modelValue', $event as T)"
    >
      <SelectTrigger
        class="select-trigger"
        style="justify-content: space-between; text-align: left"
      >
        <SelectValue :placeholder="props.placeholder ?? 'Select…'" />
        <ChevronDown :size="14" style="color: var(--fg-subtle)" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          class="menu z-50 data-[state=open]:animate-in data-[state=closed]:animate-out"
          position="popper"
          :side-offset="6"
          style="min-width: var(--reka-select-trigger-width)"
        >
          <SelectViewport>
            <SelectItem
              v-for="opt in props.options"
              :key="String(opt.value)"
              :value="opt.value as string"
              class="menu-item"
            >
              <SelectItemText>{{ opt.label }}</SelectItemText>
              <SelectItemIndicator style="margin-left: auto">
                <Check :size="14" style="color: var(--accent)" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
