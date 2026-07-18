// Minimal .env loader shared by build scripts and the dev API plugin.
// Real environment variables (e.g. Netlify build env) always win over .env.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export function loadEnv(rootDir = ROOT) {
  const env = { ...process.env }
  try {
    for (const line of readFileSync(path.join(rootDir, '.env'), 'utf-8').split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  } catch {
    // no .env — rely on process.env
  }
  return env
}

// Airtable credentials with the legacy VITE_-prefixed names as fallback so
// the transition away from client-side tokens can't break a build.
export function airtableCredentials(env = loadEnv()) {
  return {
    token: env.AIRTABLE_TOKEN || env.VITE_AIRTABLE_TOKEN || '',
    baseId: env.AIRTABLE_BASE_ID || env.VITE_AIRTABLE_BASE_ID || '',
  }
}
