// GET /api/availability  (via the /api/* redirect in public/_redirects)
//
// Live "spots left" data: aggregates confirmed future bookings from Airtable
// and returns the availability map the useAvailability hook consumes. The
// CDN caches responses for 60s, so visitor traffic almost never reaches
// Airtable directly — one origin hit per minute per CDN node stays far
// below both the 5 req/s rate limit and the monthly API-call cap.

import { fetchAvailability } from './_lib/airtable.mjs'

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID

  try {
    if (!token || !baseId) throw new Error('Airtable credentials not configured')
    const map = await fetchAvailability({ token, baseId })
    return Response.json(map, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (err) {
    // Fail open with an empty map (the client then shows full availability,
    // matching the old direct-fetch behavior) and cache the failure briefly
    // so an Airtable outage doesn't trigger a request storm.
    console.error('availability:', err.message)
    return Response.json({}, {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=10',
      },
    })
  }
}
