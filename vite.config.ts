import type { UserConfig } from 'vite'

export default {
  appType: 'spa',
  server: {
    open: '/index.html'
  },
  build: {
    target: 'esnext',
  }
} satisfies UserConfig