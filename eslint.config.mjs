import withNuxt from './.nuxt/eslint.config.mjs'

// Layered ESLint: the @nuxt/eslint module produces a baseline; we layer FSD
// boundaries on top so cross-layer or sideways imports fail in CI.
export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
