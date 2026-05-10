# art-voice-web

Customer-facing web dashboard for Art-Voice.

**Architecture:** §10.1 (public web surface) · talks to svc-gateway (REST + GraphQL) and svc-realtime (WSS / WebRTC).

## Stack

- **Nuxt 3** — Vue 3 + Vite, file-based routing, SSR-capable, hybrid rendering
- **TypeScript** — `strict: true`, no `any` (escape hatches must carry a comment)
- **shadcn-vue** — accessible, copy-pasted component primitives
- **Tailwind CSS** — utility-first styling + design tokens
- **Pinia** — state management
- **VueUse** — composition utilities
- **OpenFeature** — feature flag SDK (talks to `svc-flags`)

## Quick start

```bash
pnpm install
cp .env.example .env       # set NUXT_PUBLIC_API_BASE etc
pnpm dev                   # http://localhost:3000
pnpm typecheck             # strict tsc
pnpm test                  # vitest
pnpm build                 # nuxt build (static + SSR)
```

## Layout

```
art-voice-web/
├─ pages/                  # file-based routes (dashboard, analyses, coach…)
├─ layouts/                # default + auth layouts
├─ components/
│  ├─ ui/                  # shadcn-vue primitives (Button, Card, Tabs…)
│  └─ <module>/            # feature components per module
├─ composables/            # useAuth, useApi, useRealtimeSession, useRecorder…
├─ server/api/             # SSR-only proxy routes (cookie-auth dashboard calls)
├─ types/                  # shared types (generated from OpenAPI / proto)
├─ assets/css/             # tailwind base + tokens
├─ tests/                  # vitest specs
└─ helm/                   # k8s deployment chart
```

## Endpoints

- `/healthz` — Nuxt liveness
- `/readyz` — checks upstream `svc-gateway` reachability
- `/metrics` — Prometheus client metrics for the Nitro server

## Design system

shadcn-vue components live under `components/ui/` and are copy-pasted via the CLI (`pnpm dlx shadcn-vue@latest add button`). Customizations stay in this repo; we don't fork shadcn.

## Modules

Each top-level route in the screenshot is a module. See [REQUIREMENTS_PLAN.md](../REQUIREMENTS_PLAN.md) and Jira epic [KAN-260](https://h-dev.atlassian.net/browse/KAN-260) for the UC catalog (UC-19.1 …).
