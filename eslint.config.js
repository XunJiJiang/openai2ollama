import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pluginVitest from '@vitest/eslint-plugin'
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
const __dirname = dirname(fileURLToPath(import.meta.url))
const joinTo = (...paths) => resolve(__dirname, ...paths)
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,jsx}']
  },

  eslint.configs.recommended,
  tseslint.configs.recommended,

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-electron/**',
      '**/dist-ssr/**',
      '**/src-tauri/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/build/**',
      '**/release/**',
      '**/resources/**'
    ]
  },

  {
    name: 'app/alias',
    settings: {
      'import/resolver': {
        vite: {
          viteConfig: {
            resolve: {
              alias: {
                '@': joinTo()
              }
            }
          }
        }
      }
    }
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  eslintConfigPrettier
)
