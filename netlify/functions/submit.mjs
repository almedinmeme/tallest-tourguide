// POST /api/submit  (via the /api/* redirect in public/_redirects)
//
// Single write endpoint for form submissions that land in Airtable
// (Bookings from checkout, Reviews from the review forms). Keeps the
// Airtable token server-side — the client bundle contains no credentials —
// and enforces per-table field allowlists (see _lib/airtable.mjs).
//
// Body: { table: 'Bookings' | 'Reviews', fields: {...}, website?: '' }
// `website` is a honeypot: bots that fill the hidden input get a fake
// success and nothing is written.

import { submitRecord, validateSubmitBody, MAX_BODY_BYTES } from './_lib/airtable.mjs'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ error: 'Payload too large' }, { status: 413 })
    }
    body = JSON.parse(raw)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return Response.json({ ok: true }) // honeypot tripped — silently drop
  }

  let table, fields
  try {
    ;({ table, fields } = validateSubmitBody(body))
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 })
  }

  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  if (!token || !baseId) {
    console.error('submit: Airtable credentials not configured')
    return Response.json({ error: 'Submission storage not configured' }, { status: 503 })
  }

  const result = await submitRecord({ token, baseId, table, fields })
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status })
  }
  return Response.json({ ok: true })
}
