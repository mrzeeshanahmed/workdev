import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['specs/**/tests/**/*.test.js', 'specs/**/tests/**/*.test.ts']
  }
})
