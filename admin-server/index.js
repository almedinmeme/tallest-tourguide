import express from 'express'
import { buildAdminRouter } from './router.js'

export default function adminServerPlugin() {
  return {
    name: 'tallest-admin-server',
    apply: 'serve',
    configureServer(server) {
      // Wrap router in a full Express app so res gets .status()/.json()
      // helpers, then mount with a path prefix so unrelated requests fall
      // through to Vite (HMR, module transforms, public assets).
      const app = express()
      app.use(buildAdminRouter())
      server.middlewares.use('/api/admin', app)
    },
  }
}
