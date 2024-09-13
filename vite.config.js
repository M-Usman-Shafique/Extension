// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'index.html',
        background: 'src/background.jsx',
        content: 'src/content.jsx',
      },
    },
  },
})