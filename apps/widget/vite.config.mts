/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxReadySignal } from '@nx/vite/plugins/nx-ready-signal.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/widget',
  server:{
    port: 4200,
    host: 'localhost',
  },
  preview:{
    port: 4300,
    host: 'localhost',
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [nxReadySignal()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: '../../dist/apps/widget',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'widget',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/widget',
      provider: 'v8' as const,
    }
  },
}));
