<script setup lang="ts">
// Date picker — reka-ui DatePicker primitive. Trigger styled as the
// design-system .select-trigger; calendar popover styled with tokens.
import {
  DatePickerRoot,
  DatePickerField,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerArrow,
  DatePickerCalendar,
  DatePickerHeader,
  DatePickerPrev,
  DatePickerNext,
  DatePickerHeading,
  DatePickerGrid,
  DatePickerGridHead,
  DatePickerGridBody,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerCell,
  DatePickerCellTrigger,
} from 'reka-ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { DateValue } from '@internationalized/date'

const props = defineProps<{
  modelValue?: DateValue
  label?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [DateValue | undefined] }>()
</script>

<template>
  <div class="field">
    <label v-if="props.label" class="field-label">{{ props.label }}</label>
    <DatePickerRoot
      :model-value="props.modelValue"
      @update:model-value="emit('update:modelValue', $event as DateValue | undefined)"
    >
      <div class="select-trigger" style="justify-content: space-between; gap: 8px">
        <DatePickerField
          v-slot="{ segments }"
          style="display: flex; align-items: center; gap: 1px; flex: 1"
        >
          <CalendarIcon
            :size="14"
            style="color: var(--fg-subtle); margin-right: 6px"
          />
          <template v-for="item in segments" :key="item.part">
            <DatePickerInput
              v-if="item.part === 'literal'"
              :part="item.part"
              style="color: var(--fg-subtle)"
            >
              {{ item.value }}
            </DatePickerInput>
            <DatePickerInput
              v-else
              :part="item.part"
              class="rounded-sm px-0.5 data-[placeholder]:text-[var(--fg-faint)] focus:outline-none focus:bg-[var(--accent-subtle)]"
            >
              {{ item.value }}
            </DatePickerInput>
          </template>
        </DatePickerField>
        <DatePickerTrigger class="btn-icon btn-icon-sm" aria-label="Open calendar">
          <ChevronRight :size="14" style="transform: rotate(90deg)" />
        </DatePickerTrigger>
      </div>

      <DatePickerContent
        :side-offset="6"
        class="popover z-50 data-[state=open]:animate-in data-[state=closed]:animate-out"
        style="padding: var(--s-4)"
      >
        <DatePickerArrow style="fill: var(--raised)" />
        <DatePickerCalendar v-slot="{ weekDays, grid }">
          <DatePickerHeader
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: var(--s-3);
            "
          >
            <DatePickerPrev class="btn-icon btn-icon-sm">
              <ChevronLeft :size="14" />
            </DatePickerPrev>
            <DatePickerHeading
              style="font-size: var(--text-base); font-weight: var(--w-medium)"
            />
            <DatePickerNext class="btn-icon btn-icon-sm">
              <ChevronRight :size="14" />
            </DatePickerNext>
          </DatePickerHeader>
          <DatePickerGrid
            v-for="month in grid"
            :key="month.value.toString()"
            style="border-collapse: collapse"
          >
            <DatePickerGridHead>
              <DatePickerGridRow style="display: flex; margin-bottom: 4px">
                <DatePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  style="
                    width: 32px;
                    font-size: 11px;
                    color: var(--fg-subtle);
                    text-align: center;
                  "
                >
                  {{ day }}
                </DatePickerHeadCell>
              </DatePickerGridRow>
            </DatePickerGridHead>
            <DatePickerGridBody>
              <DatePickerGridRow
                v-for="(weekDates, i) in month.rows"
                :key="`week-${i}`"
                style="display: flex"
              >
                <DatePickerCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                >
                  <DatePickerCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="dp-cell"
                  />
                </DatePickerCell>
              </DatePickerGridRow>
            </DatePickerGridBody>
          </DatePickerGrid>
        </DatePickerCalendar>
      </DatePickerContent>
    </DatePickerRoot>
  </div>
</template>

<style scoped>
.dp-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: var(--text-sm);
  border-radius: var(--r-2);
  color: var(--fg);
  cursor: pointer;
}
.dp-cell:hover {
  background: var(--subtle);
}
.dp-cell[data-selected] {
  background: var(--accent);
  color: var(--accent-fg);
}
.dp-cell[data-outside-view] {
  color: var(--fg-faint);
}
.dp-cell[data-disabled] {
  opacity: 0.4;
  pointer-events: none;
}
.dp-cell[data-today]:not([data-selected]) {
  box-shadow: inset 0 0 0 1px var(--accent-border);
}
</style>
