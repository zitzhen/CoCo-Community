import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
  .prepend({
    ignores: [
      'src/**',
      'functions/**',
      'htmlbot/**',
      'public/**',
      'vite.config.js',
    ],
  })
  .append({
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/attributes-order': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/quote-props': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  })
