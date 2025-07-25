import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/zoom-class-builder/',
  server: {
    port: 5173,
    strictPort: true
  }
}) 