import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import adminServer from './admin-server/index.js'

// The sitemap is written by scripts/sitemap.mjs during the prerender step
// (scripts/prerender.mjs), from the same route list that drives prerendering.
// vite-plugin-sitemap was dropped: it normalized away the trailing slashes
// that Netlify's directory-based prerender output requires.

export default defineConfig({
  plugins: [
    adminServer(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@tiptap/') || id.includes('node_modules/prosemirror-')) return 'vendor-tiptap'
          if (id.includes('node_modules/react-router')) return 'vendor-react'
          if (id.includes('node_modules/react-dom/') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler/')) return 'vendor-react'
          if (id.includes('lucide-react')) return 'vendor-ui'
          if (id.includes('marked') || id.includes('@emailjs') || id.includes('react-helmet-async')) return 'vendor-misc'
        },
      },
    },
  },
})
