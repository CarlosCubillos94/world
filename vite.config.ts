import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/world/',
  plugins: [react()],
  server: {
    host: true,
    port: 43173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 43173,
    strictPort: true,
  },
})
