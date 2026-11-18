export default [
  { ignores: ['dist/**', 'node_modules/**', '.astro/**', 'playwright-report/**', 'test-results/**', '.npm-cache/**'] },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: { AbortSignal: 'readonly', URL: 'readonly', console: 'readonly', fetch: 'readonly', process: 'readonly', setTimeout: 'readonly' } }, rules: { 'no-undef': 'error' } },
];
