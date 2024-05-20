import dns from 'dns'
import { resolve } from 'path'

// You can set dns.setDefaultResultOrder('verbatim') to disable the reordering behavior.
// Vite will then print the address as localhost.
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default {
  resolve: {
    alias: {
      '@gatherwise/common-frontend-libs': resolve(__dirname, '../common'),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      ignoreTryCatch: false,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          deps: ['oidc-client-ts', '@remix-run/router'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'forks', // Avoid hanging processes
    testTimeout: 30 * 1000, // ms
    setupFiles: resolve(__dirname, '../common/test-helpers/vitest.setup.js'),
    env: {
      NODE_ENV: 'test',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'cobertura'],
      clean: false, // avoid to delete mounted volume in CI
      cleanOnRerun: true,
      exclude: [
        'coverage/**',
        'dist/**',
        'scripts/**',
        '**/[.]**',
        'packages/*/test?(s)/**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__x00__*',
        '**/\x00*',
        'cypress/**',
        'test?(s)/**',
        'test?(-*).?(c|m)[jt]s?(x)',
        '**/*{.,-}{test,spec|config}.?(c|m)[jt]s?(x)',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/vitest.{workspace,projects}.[jt]s?(on)',
        '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
      ],
    },
  },
}
