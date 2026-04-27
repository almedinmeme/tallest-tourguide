import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

const routes = [
  '/',
  '/tours',
  '/packages',
  '/about',
  '/blog',
  '/contact',
  '/personalised',
  '/booking-conditions',
  '/safe-travels',
  '/tours/sarajevo-walking-tour',
  '/tours/mostar-day-trip-from-sarajevo',
  '/tours/lukomir-hike-bosnia',
  '/tours/bosnian-cooking-class-sarajevo',
  '/tours/jajce-travnik-day-trip-sarajevo',
  '/tours/sarajevo-morning-walk-tour',
  '/tours/sarajevo-jewish-heritage-tour',
  '/tours/sarajevo-war-tour',
  '/tours/srebrenica-day-trip-from-sarajevo',
  '/packages/sarajevo-essential',
  '/packages/bosnia-deep-dive',
  '/practical-info',
]

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://tallesttourguide.com',
      dynamicRoutes: routes,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':    ['lucide-react'],
          'vendor-misc':  ['marked', '@emailjs/browser', 'react-helmet-async'],
        },
      },
    },
  },
})
