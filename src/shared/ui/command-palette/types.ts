export interface CommandItem {
  id: string
  label: string
  group: string
  hint?: string
  meta?: string
  keywords?: string
  onSelect: () => void
}
