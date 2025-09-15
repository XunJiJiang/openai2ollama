import { defineConfig } from 'vitest/config'

export default defineConfig(async () => ({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
}))
