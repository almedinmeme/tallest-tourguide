import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

export const PATHS = {
  tours: path.join(ROOT, 'src/data/tours.json'),
  packages: path.join(ROOT, 'src/data/packages.json'),
  destinations: path.join(ROOT, 'src/data/destinations.json'),
  accommodations: path.join(ROOT, 'src/data/accommodations.json'),
  pages: path.join(ROOT, 'src/data/pages.json'),
  journal: path.join(ROOT, 'src/data/journal.json'),
  settings: path.join(ROOT, 'src/data/settings.json'),
  uploads: path.join(ROOT, 'public/uploads'),
}

async function ensureFile(filePath) {
  try {
    await fs.access(filePath)
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, '[]', 'utf-8')
  }
}

export async function readCollection(name) {
  const filePath = PATHS[name]
  if (!filePath) throw new Error(`unknown collection: ${name}`)
  await ensureFile(filePath)
  const raw = await fs.readFile(filePath, 'utf-8')
  try {
    return JSON.parse(raw)
  } catch (err) {
    throw new Error(`failed to parse ${filePath}: ${err.message}`)
  }
}

export async function writeCollection(name, data) {
  const filePath = PATHS[name]
  if (!filePath) throw new Error(`unknown collection: ${name}`)
  await writeJsonAtomic(filePath, data)
}

async function writeJsonAtomic(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  await fs.rename(tmp, filePath)
}

// Availability fallback editor — reads/writes the same files the Airtable
// sync (scripts/sync-airtable.mjs) regenerates at build time. Airtable stays
// the source of truth: whenever it's reachable during a build, it overwrites
// these files; admin edits only ship while Airtable is down or over its
// API cap.
const AVAILABILITY_PATHS = {
  departureDates: path.join(ROOT, 'src/data/airtable/departure-dates.json'),
  blockedDates: path.join(ROOT, 'src/data/airtable/blocked-dates.json'),
}

export async function readAvailability() {
  const read = async (filePath, fallback) => {
    try {
      return JSON.parse(await fs.readFile(filePath, 'utf-8'))
    } catch {
      return fallback
    }
  }
  return {
    departureDates: await read(AVAILABILITY_PATHS.departureDates, {}),
    blockedDates: await read(AVAILABILITY_PATHS.blockedDates, []),
  }
}

export async function writeAvailability({ departureDates, blockedDates }) {
  await writeJsonAtomic(AVAILABILITY_PATHS.departureDates, departureDates)
  await writeJsonAtomic(AVAILABILITY_PATHS.blockedDates, blockedDates)
}

export function nextId(items) {
  if (!items.length) return 1
  return Math.max(...items.map((i) => Number(i.id) || 0)) + 1
}
