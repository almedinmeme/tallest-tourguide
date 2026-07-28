// Minimal .env loader shared by build scripts and the dev API plugin.
// Real environment variables (e.g. Netlify build env) always win over .env.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseServiceAccount } from '../../netlify/functions/_lib/google-auth.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export function loadEnv(rootDir = ROOT) {
  const env = { ...process.env }
  try {
    for (const line of readFileSync(path.join(rootDir, '.env'), 'utf-8').split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      // .trim() is load-bearing, not tidiness: the (.*) above is greedy, so
      // \s*$ never gets to match and trailing spaces end up inside the value.
      // A calendar id pasted with a stray space then 404s with no clue why.
      if (m && !(m[1] in env)) env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '').trim()
    }
  } catch {
    // no .env — rely on process.env
  }
  return env
}

// Google credentials for the booking store: the calendar that holds seats
// and the sheet that ledgers every submission. One service account covers
// both.
//
// The key is base64'd into a single variable because the parser above is
// single-line: a PEM is 28 lines and simply cannot be expressed in .env.
// Decoding lives in the functions lib so there is one implementation — note
// the import direction (scripts → netlify/functions/_lib) is deliberate and
// must not be reversed, since this file reads .env off disk and that means
// nothing inside a Lambda.
export function googleCredentials(env = loadEnv()) {
  return {
    sa: parseServiceAccount(env.GOOGLE_SA_KEY_B64 || ''),
    calendarId: env.GOOGLE_CALENDAR_ID || '',
    sheetId: env.GOOGLE_SHEET_ID || '',
  }
}
