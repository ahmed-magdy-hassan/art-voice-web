// KAN-336/337 — Extend Nuxt's PageMeta with the auth property used by auth.global.ts.
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    auth?: 'public' | 'guest' | 'protected'
  }
}
