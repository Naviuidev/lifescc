import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || (mode === 'production' ? '/test/' : '/')

  return {
    base,
    plugins: [react()],
    server: {
      proxy: {
        [`${base.replace(/\/$/, '')}/api`]: {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${base.replace(/\/$/, '')}`), ''),
        },
        [`${base.replace(/\/$/, '')}/uploads`]: {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${base.replace(/\/$/, '')}`), ''),
        },
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
        },
      },
    },
  }
})
