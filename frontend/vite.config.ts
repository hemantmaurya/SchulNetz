import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // important for Docker
    port: 5173,
    watch: {
      usePolling: true   // helps hot reload in some Docker setups
    }
  }
})