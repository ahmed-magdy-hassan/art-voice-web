import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

import Alert from './alert/Alert.vue'
import Banner from './alert/Banner.vue'
import Badge from './Badge.vue'
import Kbd from './Kbd.vue'
import FileDropzone from './file-dropzone/FileDropzone.vue'
import CommandPalette from './command-palette/CommandPalette.vue'
import type { CommandItem } from './command-palette/types'
import { useToast } from './toast/use-toast'
import {
  DialogRoot,
  DialogTrigger,
} from './dialog'
import DialogContent from './dialog/DialogContent.vue'

// reka-ui Teleport targets need a body in happy-dom; jsdom-style is fine.

describe('Alert / Banner / Badge / Kbd', () => {
  it('renders semantic Alert with tone class and title', () => {
    const w = mount(Alert, {
      props: { tone: 'danger', title: "Couldn't reach the audio source" },
      slots: { default: () => 'Check your microphone permission.' },
    })
    expect(w.classes()).toContain('alert')
    expect(w.classes()).toContain('alert-danger')
    expect(w.text()).toContain("Couldn't reach the audio source")
    expect(w.text()).toContain('Check your microphone permission.')
    expect(w.attributes('role')).toBe('alert')
  })

  it('renders Banner with tone class', () => {
    const w = mount(Banner, {
      props: { tone: 'warning' },
      slots: { default: () => 'Free tier — 3 of 5 hours used.' },
    })
    expect(w.classes()).toContain('banner')
    expect(w.classes()).toContain('banner-warning')
    expect(w.text()).toContain('Free tier')
  })

  it('Badge applies semantic tone and Kbd renders slot', () => {
    const b = mount(Badge, { props: { tone: 'success' }, slots: { default: () => 'Success' } })
    expect(b.classes()).toEqual(['badge', 'badge-success'])
    const k = mount(Kbd, { slots: { default: () => '⌘K' } })
    expect(k.classes()).toContain('kbd')
    expect(k.text()).toBe('⌘K')
  })
})

describe('FileDropzone', () => {
  it('emits files on drop and toggles drag state', async () => {
    const w = mount(FileDropzone, { props: { multiple: true } })
    expect(w.classes()).toContain('dropzone')

    await w.trigger('dragenter')
    expect(w.classes()).toContain('is-dragging')
    expect(w.text()).toContain('Drop to upload')

    const file = new File(['hello'], 'maya-call.wav', { type: 'audio/wav' })
    await w.trigger('drop', { dataTransfer: { files: [file] } })

    expect(w.emitted('files')).toBeTruthy()
    expect(w.emitted('files')![0][0]).toEqual([file])
    expect(w.classes()).not.toContain('is-dragging')
  })

  it('does not emit when disabled', async () => {
    const w = mount(FileDropzone, { props: { disabled: true } })
    await w.trigger('drop', {
      dataTransfer: { files: [new File(['x'], 'a.wav')] },
    })
    expect(w.emitted('files')).toBeFalsy()
  })
})

describe('CommandPalette', () => {
  const items: CommandItem[] = [
    { id: 'a', label: 'Export transcript as .srt', group: 'Actions', onSelect: vi.fn() },
    { id: 'b', label: 'Export audio as .wav', group: 'Actions', onSelect: vi.fn() },
    { id: 'c', label: 'Q4 renewal — Maya', group: 'Recent', keywords: 'call', onSelect: vi.fn() },
  ]

  it('filters items by query and runs onSelect via keyboard', async () => {
    const Host = defineComponent({
      setup() {
        const open = ref(true)
        return () =>
          h(CommandPalette, {
            open: open.value,
            items,
            'onUpdate:open': (v: boolean) => (open.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    await nextTick()

    const input = document.querySelector('.cmdk-input') as HTMLInputElement
    expect(input).toBeTruthy()

    input.value = 'wav'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    const options = document.querySelectorAll('.cmdk-list [role="option"]')
    expect(options.length).toBe(1)
    expect(options[0].textContent).toContain('.wav')

    // Enter selects the highlighted (only) result
    const content = document.querySelector('.cmdk') as HTMLElement
    content.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    )
    await nextTick()
    expect(items[1].onSelect).toHaveBeenCalledOnce()
    w.unmount()
  })

  it('shows "No results" when nothing matches', async () => {
    const w = mount(CommandPalette, {
      props: { open: true, items },
      attachTo: document.body,
    })
    await nextTick()
    const input = document.querySelector('.cmdk-input') as HTMLInputElement
    input.value = 'zzzzz'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    expect(document.querySelector('.cmdk-list')!.textContent).toContain('No results')
    w.unmount()
  })
})

describe('Dialog (reka-ui wiring)', () => {
  it('opens content when the trigger is activated', async () => {
    const Host = defineComponent({
      components: { DialogRoot, DialogTrigger, DialogContent },
      template: `
        <DialogRoot>
          <DialogTrigger data-test="trigger">Open</DialogTrigger>
          <DialogContent><p data-test="body">Delete this recording?</p></DialogContent>
        </DialogRoot>
      `,
    })
    const w = mount(Host, { attachTo: document.body })
    expect(document.querySelector('[data-test="body"]')).toBeNull()

    await w.get('[data-test="trigger"]').trigger('click')
    await nextTick()

    expect(document.querySelector('[data-test="body"]')?.textContent).toContain(
      'Delete this recording?',
    )
    w.unmount()
  })
})

describe('useToast queue', () => {
  it('queues and auto-dismisses a toast', async () => {
    vi.useFakeTimers()
    const { toasts, toast, dismiss } = useToast()
    const before = toasts.value.length
    const id = toast({ title: 'Transcript exported', tone: 'success', duration: 1000 })
    expect(toasts.value.length).toBe(before + 1)
    vi.advanceTimersByTime(1000)
    expect(toasts.value.find((t) => t.id === id)).toBeUndefined()
    // manual dismiss is idempotent
    dismiss(id)
    vi.useRealTimers()
  })
})
