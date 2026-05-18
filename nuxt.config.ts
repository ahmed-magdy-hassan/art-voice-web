// Nuxt 3 — Art-Voice web dashboard.
// Architecture: see CLAUDE.md "Nuxt Architecture Standard"
// (Feature-Sliced + DDF + BFF + Pinia + TanStack Query + shadcn-vue + Zod + OpenFeature).
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  ssr: true,

  // Feature-Sliced Design layout under src/.
  srcDir: 'src/',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/tailwind.css', 'intl-tel-input/dist/css/intlTelInput.css'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  runtimeConfig: {
    // server-only — Nitro BFF uses these to talk upstream.
    businessUrl: process.env.BUSINESS_URL || 'http://localhost:3000',
    // KAN-285: realtime token-exchange + WSS are gateway-only surfaces.
    gatewayUrl: process.env.GATEWAY_URL || 'http://localhost:8080',
    serviceJwtSecret: process.env.SERVICE_JWT_SECRET || '',
    public: {
      // Public site URL the BFF uses when generating absolute links.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3001',
      // Browser-facing gateway WSS origin for the live session socket.
      realtimeWsUrl:
        process.env.NUXT_PUBLIC_REALTIME_WS_URL || 'ws://localhost:8080',
      otelCollectorUrl: process.env.NUXT_PUBLIC_OTEL_COLLECTOR_URL || '',
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
    },
  },

  app: {
    head: {
      title: 'Art-Voice',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#FAFAF7' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  nitro: {
    routeRules: {
      // The BFF health endpoints are never prerendered.
      '/healthz': { prerender: false },
      '/readyz': { prerender: false },
      '/api/health': { redirect: '/api/config/upstream-health-check' },
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@tanstack/vue-query'],
    },
  },

  devServer: {
    port: 4000,
  },
})
