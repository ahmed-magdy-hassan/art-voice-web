// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/tailwind.css'],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  runtimeConfig: {
    // server-only
    gatewayInternalUrl: process.env.NUXT_GATEWAY_INTERNAL_URL,
    serviceJwtSecret: process.env.NUXT_SERVICE_JWT_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.art-voice.dev',
      wssBase: process.env.NUXT_PUBLIC_WSS_BASE || 'wss://api.art-voice.dev',
      otelCollectorUrl: process.env.NUXT_PUBLIC_OTEL_COLLECTOR_URL,
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
    },
  },

  app: {
    head: {
      title: 'Art-Voice',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#7c3aed' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  nitro: {
    routeRules: {
      '/healthz': { prerender: false },
      '/readyz': { prerender: false },
      '/metrics': { prerender: false },
    },
  },
})
