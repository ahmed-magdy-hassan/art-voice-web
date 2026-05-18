<script setup lang="ts" generic="T extends string | number">
// Combobox — typeahead search over options. reka-ui Combobox primitive
// styled as design-system .input (with leading search slot) + .menu.
import { ref } from 'vue'
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxPortal,
  ComboboxContent,
  ComboboxViewport,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxEmpty,
} from 'reka-ui'
import { Search, Check } from 'lucide-vue-next'

interface Option {
  value: T
  label: string
}

const props = defineProps<{
  modelValue?: T
  options: Option[]
  placeholder?: string
  label?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [T] }>()

const search = ref('')
</script>

<template>
  <div class="field">
    <label v-if="props.label" class="field-label">{{ props.label }}</label>
    <ComboboxRoot
      :model-value="props.modelValue as string"
      @update:model-value="emit('update:modelValue', $event as T)"
    >
      <ComboboxAnchor>
        <div class="input-group">
          <span class="leading"><Search :size="14" /></span>
          <ComboboxInput
            v-model="search"
            class="input"
            :placeholder="props.placeholder ?? 'Search…'"
          />
        </div>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          class="menu z-50 data-[state=open]:animate-in data-[state=closed]:animate-out"
          position="popper"
          :side-offset="4"
          style="min-width: var(--reka-combobox-trigger-width)"
        >
          <ComboboxViewport>
            <ComboboxEmpty class="menu-item" style="color: var(--fg-subtle)">
              No matches
            </ComboboxEmpty>
            <ComboboxItem
              v-for="opt in props.options"
              :key="String(opt.value)"
              :value="opt.value as string"
              class="menu-item"
            >
              <span>{{ opt.label }}</span>
              <ComboboxItemIndicator style="margin-left: auto">
                <Check :size="14" style="color: var(--accent)" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </div>
</template>
