// One-off: dump every Airtable table to a JSON archive before the base goes
// cold, so nothing is lost when the token is revoked.
//
// This is deliberately a dumb full export rather than a migration. Bookings
// live on the Google Calendar now, departure and blocked dates are
// admin-owned JSON, and reviews come from Google plus the curated highlights
// — so there is nothing left to import. What's worth keeping is the history,
// and history is best kept as a file you can grep.
//
//   node scripts/archive-airtable.mjs
//
// Reads AIRTABLE_TOKEN / AIRTABLE_BASE_ID from .env or the environment, and
// writes docs/archive/airtable-export-<date>.json. Delete this script once it
// has run successfully — it is the last thing in the repo that talks to
// Airtable.
//
// ── If every table comes back 429 ──────────────────────────────────────
// PUBLIC_API_BILLING_LIMIT_EXCEEDED means the base's monthly API quota is
// spent, and no amount of retrying will help — this is the exact failure
// that made the site's data go stale and prompted the move to Google. Two
// ways out:
//   1. Wait for the quota to reset at the start of the month, then re-run.
//   2. Export from the Airtable UI instead: each table → ⋯ → "Download CSV".
//      The UI doesn't go through the public API, so the cap doesn't apply.
// Option 2 is the reliable one, and honestly the better archive anyway —
// CSVs open in anything.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from './lib/env.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(ROOT, 'docs/archive')
const API = 'https://api.airtable.com/v0'

// Used if the token lacks schema.bases:read — these are the only tables the
// site ever wrote to or read from.
const FALLBACK_TABLES = ['Bookings', 'Reviews', 'DepartureDates', 'BlockedDates']

async function listTables(token, baseId) {
  const res = await fetch(`${API}/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    console.warn(`[archive] schema read failed (${res.status}) — falling back to the known table names.`)
    return FALLBACK_TABLES
  }
  const data = await res.json()
  return (data.tables || []).map((t) => t.name)
}

async function fetchAll(token, baseId, table) {
  const records = []
  let offset
  do {
    const url = new URL(`${API}/${baseId}/${encodeURIComponent(table)}`)
    if (offset) url.searchParams.set('offset', offset)
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`${table} ${res.status}: ${await res.text()}`)
    const data = await res.json()
    records.push(...(data.records || []))
    offset = data.offset
  } while (offset)
  return records
}

const env = loadEnv()
const token = env.AIRTABLE_TOKEN || env.VITE_AIRTABLE_TOKEN
const baseId = env.AIRTABLE_BASE_ID || env.VITE_AIRTABLE_BASE_ID

if (!token || !baseId) {
  console.error('[archive] Missing AIRTABLE_TOKEN / AIRTABLE_BASE_ID.')
  process.exit(1)
}

const tables = await listTables(token, baseId)
const out = { exportedAt: new Date().toISOString(), baseId, tables: {} }

for (const name of tables) {
  try {
    const records = await fetchAll(token, baseId, name)
    out.tables[name] = records
    console.log(`[archive] ${name}: ${records.length} records`)
  } catch (err) {
    // One unreadable table must not cost us the rest of the export.
    console.warn(`[archive] ${name}: ${err.message}`)
    out.tables[name] = { error: err.message }
  }
}

await mkdir(OUT_DIR, { recursive: true })
const file = path.join(OUT_DIR, `airtable-export-${new Date().toISOString().slice(0, 10)}.json`)
await writeFile(file, JSON.stringify(out, null, 2) + '\n', 'utf-8')
console.log(`[archive] wrote ${path.relative(ROOT, file)}`)
