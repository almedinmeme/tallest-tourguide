// Google service-account auth, shared by _lib/gcal.mjs and _lib/gsheet.mjs.
//
// A service-account key does not expire — that is the whole reason bookings
// moved here from Airtable, whose free-plan monthly API-call cap silently
// stopped the data refreshing. There is no refresh token to rotate and no
// OAuth consent screen to re-approve.
//
// No SDK: we sign an RS256 JWT with node:crypto and exchange it for an
// access token, matching how the old _lib/airtable.mjs talked to its API
// (raw fetch, no dependency). googleapis would add ~15 MB to the function
// bundle to do exactly this.
//
// Credentials arrive as arguments, never read from the environment here —
// the same rule the Airtable core followed, so the Netlify Functions and
// the dev mirror in admin-server/dev-api.js can share one implementation.

import { createSign } from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'

// One token covers both APIs. `calendar.events` rather than the broader
// `calendar` scope: we never create, delete or reconfigure calendars.
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ')

// Decodes GOOGLE_SA_KEY_B64 — the whole service-account JSON, base64'd into
// a single line. It has to be one line: scripts/lib/env.mjs parses .env with
// a single-line regex, so a 28-line PEM cannot be represented there, and the
// \n-escaped alternative breaks silently when quoting differs between .env
// and the Netlify UI.
//
// Never throws: callers treat null as "not configured", which drives the
// 503 on /api/submit and the fail-open on /api/availability.
export function parseServiceAccount(b64) {
  if (typeof b64 !== 'string' || !b64.trim()) return null
  try {
    const json = JSON.parse(Buffer.from(b64.trim(), 'base64').toString('utf-8'))
    const { client_email: clientEmail, private_key: privateKey } = json
    if (typeof clientEmail !== 'string' || !clientEmail) return null
    if (typeof privateKey !== 'string' || !privateKey) return null
    return { clientEmail, privateKey }
  } catch {
    return null
  }
}

const base64url = (input) => Buffer.from(input).toString('base64url')

// Module-scope cache. Warm Lambda containers and the long-lived dev server
// both reuse a token for its full hour instead of minting one per request.
// Keyed by client email so a dev/prod credential swap can't serve a stale
// token for the wrong account.
let cached = { key: '', token: '', expiresAt: 0 }

export function clearTokenCache() {
  cached = { key: '', token: '', expiresAt: 0 }
}

export async function getAccessToken(sa) {
  if (!sa) throw new Error('Google service account not configured')

  const now = Date.now()
  // 60s of slack so a token can't expire mid-flight on a slow request.
  if (cached.key === sa.clientEmail && cached.expiresAt - 60_000 > now) {
    return cached.token
  }

  const iat = Math.floor(now / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(JSON.stringify({
    iss: sa.clientEmail,
    scope: SCOPES,
    aud: TOKEN_URL,
    iat,
    exp: iat + 3600,
  }))
  const signature = createSign('RSA-SHA256')
    .update(`${header}.${claims}`)
    .sign(sa.privateKey, 'base64url')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
  })
  if (!res.ok) {
    // Never include the assertion or the key in the message — function logs
    // are readable by anyone with Netlify access and the key never expires.
    throw new Error(`Google token ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  if (!data.access_token) throw new Error('Google token response had no access_token')

  cached = {
    key: sa.clientEmail,
    token: data.access_token,
    expiresAt: now + (Number(data.expires_in) || 3600) * 1000,
  }
  return cached.token
}

// Authorized fetch with the one retry that matters: a 401 means the cached
// token was revoked or the clock skewed, so drop it and mint a fresh one.
// Transient 429/5xx get a single backed-off retry — beyond that the callers
// already fail open (availability) or report the error (submit).
export async function googleFetch(sa, url, options = {}, { retry = true } = {}) {
  const token = await getAccessToken(sa)
  const res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  })
  if (res.ok || !retry) return res

  if (res.status === 401) {
    clearTokenCache()
    return googleFetch(sa, url, options, { retry: false })
  }
  if (res.status === 429 || res.status >= 500) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return googleFetch(sa, url, options, { retry: false })
  }
  return res
}

// Turns a non-2xx Google response into a short, client-safe message.
// Google nests the useful part at error.message; the raw body is a wall of
// JSON that must never reach a visitor.
export async function googleError(res, label) {
  let message = `${label} ${res.status}`
  try {
    const data = await res.json()
    message = data?.error?.message || data?.error_description || message
  } catch { /* keep the generic message */ }
  return message
}
