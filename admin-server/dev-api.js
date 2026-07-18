// Dev-only /api/availability + /api/submit, mirroring the production
// Netlify Functions so plain `npm run dev` works without `netlify dev`.
// Both transports are thin wrappers over the same core module
// (netlify/functions/_lib/airtable.mjs) so behavior can't drift.
//
// The Airtable token comes from .env (AIRTABLE_TOKEN / AIRTABLE_BASE_ID) via
// the scripts env loader — Vite only exposes VITE_-prefixed vars, and these
// must never get that prefix (they'd end up in the public bundle).
import express from 'express'
import { loadEnv, airtableCredentials } from '../scripts/lib/env.mjs'
import {
  fetchAvailability,
  submitRecord,
  validateSubmitBody,
  MAX_BODY_BYTES,
} from '../netlify/functions/_lib/airtable.mjs'

export default function devApiPlugin() {
  return {
    name: 'tallest-dev-api',
    apply: 'serve',
    configureServer(server) {
      const { token, baseId } = airtableCredentials(loadEnv())
      if (!token || !baseId) {
        console.warn(
          '[dev-api] AIRTABLE_TOKEN / AIRTABLE_BASE_ID missing from .env — ' +
            '/api/availability returns {} and /api/submit returns 503.'
        )
      }

      const app = express()
      app.use(express.json({ limit: MAX_BODY_BYTES }))

      app.get('/availability', async (_req, res) => {
        if (!token || !baseId) return res.json({})
        try {
          res.json(await fetchAvailability({ token, baseId }))
        } catch (err) {
          // Fail open like production: empty map = full availability shown.
          console.warn('[dev-api] availability:', err.message)
          res.json({})
        }
      })

      app.post('/submit', async (req, res) => {
        const body = req.body
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
          return res.json({ ok: true }) // honeypot tripped — silently drop
        }
        let table, fields
        try {
          ;({ table, fields } = validateSubmitBody(body))
        } catch (err) {
          return res.status(400).json({ error: err.message })
        }
        if (!token || !baseId) {
          return res.status(503).json({ error: 'Airtable not configured (AIRTABLE_TOKEN in .env)' })
        }
        const result = await submitRecord({ token, baseId, table, fields })
        if (!result.ok) return res.status(result.status).json({ error: result.error })
        res.json({ ok: true })
      })

      // Mounted under /api AFTER the admin plugin, so /api/admin/* keeps
      // being handled there and everything else falls through to Vite.
      server.middlewares.use('/api', app)
    },
  }
}
