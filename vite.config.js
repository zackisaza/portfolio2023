import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression({ algorithm: 'brotliCompress' }), viteCompression({ algorithm: 'gzip' })],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'three-vendor'
            if (id.includes('@emailjs')) return 'email-vendor'
            if (id.includes('framer-motion')) return 'motion-vendor'
            return 'vendor'
          }
        },
      },
    },
  },
})
