import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Necesario para que funcione en Docker
    watch: {
      usePolling: true, // Necesario para hot-reload en Docker
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
})
