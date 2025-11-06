import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Forward frontend calls like "/api/..." to your backend
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        // Proxy Socket.io websocket connections to backend
        '/socket.io': {
          target: apiTarget,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
