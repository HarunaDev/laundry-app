import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Tells Vite to listen on 0.0.0.0
    port: 5173,
    watch: {
      usePolling: true, // Crucial for Colima/Docker to detect file updates instantly
    },
    hmr: {
      clientPort: 4000, // Explicitly points the hot-reload websocket to your Mac's port 4000
    }
  }
})
