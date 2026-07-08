import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression({ algorithm: 'brotliCompress' }), viteCompression({ algorithm: 'gzip' })],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  define: {
    global: 'globalThis',
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Don't separate React - keep it in the main bundle
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor' // Put React with other vendors
            }
            if (id.includes('three') || id.includes('@react-three')) return 'three-vendor'
            if (id.includes('framer-motion')) return 'motion-vendor'
            return 'vendor'
          }
        },
        // Simplified chunk naming
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js'
      },
    },
  },
  resolve: {
    alias: {
      // Force single instance of React with absolute paths
      'react': resolve('./node_modules/react'),
      'react-dom': resolve('./node_modules/react-dom'),
      'react/jsx-runtime': resolve('./node_modules/react/jsx-runtime')
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'three', '@react-three/fiber', '@react-three/drei'],
    force: true,
    // Exclude problematic packages from pre-bundling
    exclude: []
  }
})
