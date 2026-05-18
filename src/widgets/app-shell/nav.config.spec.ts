import { describe, it, expect } from 'vitest'
import { navGroups } from './nav.config'

describe('navGroups (UC-19.2 module catalog)', () => {
  it('declares the modules required by UC-19.2 acceptance criteria', () => {
    const labels = navGroups.flatMap((g) => g.items.map((i) => i.label))
    for (const required of [
      'Dashboard',
      'Analyses',
      'Profile',
      'Upload',
      'Live',
      'Training',
      'Exercises',
      'Coach',
      'Reports',
      'Cloning',
      'Compare',
      'Marketplace',
      'Community',
      'Billing',
      'API',
      'Settings',
    ]) {
      expect(labels, `missing ${required}`).toContain(required)
    }
  })

  it('flags pro-only modules so the shell can render an upgrade badge', () => {
    const items = navGroups.flatMap((g) => g.items)
    const pro = items.filter((i) => i.proOnly).map((i) => i.label)
    expect(pro).toEqual(expect.arrayContaining(['Live', 'Coach', 'Cloning']))
  })

  it('every nav item has a unique route', () => {
    const routes = navGroups.flatMap((g) => g.items.map((i) => i.to))
    expect(new Set(routes).size).toBe(routes.length)
  })
})
