import type { UserConfig } from 'vite'

export default {
  appType: 'spa',
  base: './',
  server: {
    open: '/index.html'
  },
  build: {
    target: 'esnext',
  },
} satisfies UserConfig
