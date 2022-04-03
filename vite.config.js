import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({ cache: false }),
    visualizer({ filename: 'test/results/bundle-stats.html' }),
  ],
  server: {
    port: '3002',
  },
})
