// Dev-only /api/availability + /api/submit, mirroring the production
// Netlify Functions so plain `npm run dev` works without `netlify dev`.
// Both transports are thin wrappers over the same core modules
// (netlify/functions/_lib/*) so behavior can't drift.
//
// Credentials come from .env via the scripts env loader — Vite only exposes
// VITE_-prefixed vars, and these must never get that prefix (the service
// account key would end up in the public bundle, and it never expires).
//
// IMPORTANT: point GOOGLE_CALENDAR_ID / GOOGLE_SHEET_ID at the throwaway dev
// calendar and sheet. Otherwise every test booking you make while developing
// lands on the real calendar — i.e. on the owner's phone — and holds seats
// that aren't actually sold. See docs/google-calendar-setup.md.
import express from 'express'
import { loadEnv, googleCredentials } from '../scripts/lib/env.mjs'
import { fetchAvailability, validateBooking, MAX_BODY_BYTES } from '../netlify/functions/_lib/gcal.mjs'
import { submitBooking } from '../netlify/functions/_lib/booking.mjs'

export default function devApiPlugin() {
  return {
    name: 'tallest-dev-api',
    apply: 'serve',
    configureServer(server) {
      const { sa, calendarId, sheetId } = googleCredentials(loadEnv())
      if (!sa || !calendarId) {
        console.warn(
          '[dev-api] GOOGLE_SA_KEY_B64 / GOOGLE_CALENDAR_ID missing from .env — ' +
            '/api/availability returns {} and /api/submit returns 503.'
        )
      } else if (!sheetId) {
        console.warn('[dev-api] GOOGLE_SHEET_ID missing — bookings save to the calendar but not the ledger.')
      }

      const app = express()
      app.use(express.json({ limit: MAX_BODY_BYTES }))

      app.get('/availability', async (_req, res) => {
        if (!sa || !calendarId) return res.json({})
        try {
          res.json(await fetchAvailability({ sa, calendarId }))
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
        let booking
        try {
          booking = validateBooking(body?.booking)
        } catch (err) {
          return res.status(400).json({ error: err.message })
        }
        if (!sa || !calendarId) {
          return res.status(503).json({ error: 'Google Calendar not configured (GOOGLE_SA_KEY_B64 in .env)' })
        }
        const result = await submitBooking({ sa, calendarId, sheetId, booking })
        if (!result.ok) return res.status(result.status).json({ error: result.error })
        res.json(result)
      })

      // Mounted under /api AFTER the admin plugin, so /api/admin/* keeps
      // being handled there and everything else falls through to Vite.
      server.middlewares.use('/api', app)
    },
  }
}
