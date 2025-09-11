/// <reference types="vitest/config" />
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

const __dirname = join(dirname(fileURLToPath(import.meta.url)))
const joinTo = (...paths: string[]) => resolve(__dirname, ...paths)

export default defineConfig(async () => ({
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './app.ts',
      exportName: 'ollamaApi',
      initAppOnBoot: false,
      reloadAppOnFileChange: false,
      tsCompiler: 'esbuild',
      swcOptions: {}
    })
  ],
  clearScreen: false,
  server: {
    port: 3100,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': joinTo()
    }
  },
  build: {},
  test: {}
}))
