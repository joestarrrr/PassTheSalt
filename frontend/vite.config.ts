import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const basePath = mode === 'production' ? (env.VITE_BASE_PATH || '/') : '/'
  const backendUrl =
    mode === 'production'
      ? (env.VITE_BACKEND_URL || 'https://passthesalt-production.up.railway.app')
      : (env.VITE_BACKEND_URL || '')

  return {
    plugins: [react(), tailwindcss()],
    base: basePath,
    define: {
      __BACKEND_URL__: JSON.stringify(backendUrl),
    },
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})

