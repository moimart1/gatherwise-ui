import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import webfontDownload from 'vite-plugin-webfont-dl'
import { defineConfig } from 'vitest/config'
import viteConfig from './common/vite.config'

export default defineConfig({
  ...viteConfig,
  plugins: [
    react(),
    webfontDownload(),
    eslintPlugin({ cache: false }),
    visualizer({ filename: 'test/results/bundle-stats.html' }),
  ],
  server: {
    port: '3001',
  },
})
