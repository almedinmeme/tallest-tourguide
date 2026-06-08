import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import adminServer from './admin-server/index.js'
import { getRoutes } from './scripts/routes.mjs'

// Routes are derived from the JSON data files (tours, packages, destinations)
// plus the static/editorial pages — see scripts/routes.mjs. The same list
// feeds the prerender step so the sitemap and static HTML never drift apart.
const routes = getRoutes()

export default defineConfig({
  plugins: [
    adminServer(),
    react(),
    sitemap({
      hostname: 'https://tallesttourguide.com',
      dynamicRoutes: routes,
    }),
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
