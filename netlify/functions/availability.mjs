// GET /api/availability  (via the /api/* redirect in public/_redirects)
//
// Live "spots left" data: aggregates the bookings on the Google Calendar
// and returns the availability map the useAvailability hook consumes.
//
// The CDN absorbs the traffic, so the origin is hit about once every 30s per
// CDN node. That window used to be 60s + 300s stale-while-revalidate, sized
// around Airtable's monthly API-call cap; Google Calendar's quota is ~1M
// requests/day, so the cache exists purely for latency now and can be
// tightened. Worst-case staleness drops from 360s to 90s, which is 4x less
// room for two people to book the same last seat.

import { parseServiceAccount } from './_lib/google-auth.mjs'
import { fetchAvailability } from './_lib/gcal.mjs'

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const sa = parseServiceAccount(process.env.GOOGLE_SA_KEY_B64 || '')
    const calendarId = process.env.GOOGLE_CALENDAR_ID
    if (!sa || !calendarId) throw new Error('Google Calendar not configured')

    const map = await fetchAvailability({ sa, calendarId })
    return Response.json(map, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    // Fail open with an empty map (the client then shows full availability)
    // and cache the failure briefly so an outage doesn't trigger a request
    // storm. Manual/OTA bookings are baked into the bundle and still apply
    // client-side, so seats sold elsewhere are never resold on our side.
    console.error('availability:', err.message)
    return Response.json({}, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=10',
      },
    })
  }
}
