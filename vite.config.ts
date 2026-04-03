import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/chess-react/',
  define: {
    'process.env.NODE_ENV': JSON.stringify('test'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
})
