import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      manifest: false,
      injectManifest: {
        swSrc: 'src/sw.ts',
        swDest: 'dist/sw.js',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (moduleId) => {
          if (moduleId.includes('node_modules/react') || moduleId.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (moduleId.includes('@/utils')) {
            return 'utils';
          }
          if (moduleId.includes('@/components')) {
            return 'components';
          }
        },
      },
    },
  },
})
