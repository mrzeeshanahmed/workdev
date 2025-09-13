import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    fs: {
      // Allow serving files from the specs folder outside of the frontend root
      allow: [path.resolve(__dirname, '..', 'specs')]
    }
  }
})
