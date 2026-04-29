import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // In production, use VITE_BASE_PATH (GitHub Pages repo name, e.g. /PassTheSalt/)
  // In development, use '/'
  const basePath = mode === 'production' ? (process.env.VITE_BASE_PATH || '/') : '/'
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8080'

  return {
    plugins: [react(), tailwindcss()],
    base: basePath,
    define: {
      __BACKEND_URL__: JSON.stringify(backendUrl),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})

