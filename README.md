# art-voice-web

Art-Voice customer dashboard.

**Stack:** Nuxt 3 · Feature-Sliced + Domain-Driven Frontend · Nitro BFF · TanStack Query (server state) · Pinia (UI state only) · shadcn-vue + Tailwind · Zod · OpenFeature.
**Architecture standard:** see top-level CLAUDE.md → "Nuxt Architecture Standard".

## Layout

```
src/
├── app.vue                      # Nuxt root component
├── app/providers/               # FSD app layer — query client, feature-flag init
├── layouts/                     # Nuxt layouts
├── pages/                       # Nuxt file-based routing (thin pages)
├── widgets/                     # composite UI blocks
├── features/                    # user-facing use cases (sign-up, upload, …)
├── entities/                    # domain entities (user, analysis, organization)
├── shared/
│   ├── ui/                      # shadcn-vue primitives (Button, …)
│   ├── api/                     # browser-side BFF client + Zod contracts
│   ├── lib/                     # cn(), useFlag(), small utils
│   ├── config/  types/
├── plugins/                     # Nuxt plugin entry points that bootstrap providers
├── server/                      # Nitro BFF
│   ├── routes/                  # root paths (/healthz, /readyz)
│   ├── api/                     # /api/** — typed upstream proxies
│   └── utils/                   # businessFetch(), session helpers
└── assets/css/tailwind.css      # tokens (HSL CSS variables)
```

## Rules (enforced by ESLint + review)

1. Pages are thin — one widget or one feature, no logic.
2. ALL upstream HTTP goes through Nitro (`server/api/**` or `server/routes/**`). The browser never touches a backend service.
3. Server state → TanStack Query. UI state → Pinia. Never mix.
4. Every boundary has a Zod schema — request body, upstream response, form input.
5. Feature flags go through OpenFeature only (`useFlag('key')`).
6. shadcn-vue primitives live only in `shared/ui`; other layers compose, never re-implement.
7. No cross-feature imports — lift to `entities` or `shared`.

## Local development

The top-level `art-voice/docker-compose.yml` brings up the full stack:

```bash
cd ..
cp .env.compose.example .env.compose
docker compose --env-file .env.compose up -d --build
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3001 |
| Web BFF chain probe | http://localhost:3001/api/health |
| Business service | http://localhost:3000 |
| MailHog UI | http://localhost:8025 |

### Without Docker

```bash
npm install
BUSINESS_URL=http://localhost:3000 npm run dev
```

`npm run dev` serves the app on `:3000`. Adjust the port via `PORT=3001 npm run dev` if business is already on 3000.
