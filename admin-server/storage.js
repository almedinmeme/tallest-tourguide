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
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  await fs.rename(tmp, filePath)
}

export function nextId(items) {
  if (!items.length) return 1
  return Math.max(...items.map((i) => Number(i.id) || 0)) + 1
}
