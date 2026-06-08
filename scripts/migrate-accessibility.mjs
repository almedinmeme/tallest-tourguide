// One-shot migration. Converts every tour/package's flat `accessibility`
// object (or missing one) into the new unified shape used by
// AccessibilityEditor + AccessibilitySection.

import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')

const SUITABILITY_KEYS = [
  'wheelchair', 'stroller', 'smallChildren', 'children',
  'pregnancy', 'seniors', 'pets',
]

function emptyAccessibility() {
  return {
    walkingDistanceKm: null,
    drivingDistanceKm: null,
    walkingDurationMin: null,
    drivingDurationMin: null,
    durationMin: null, // total tour duration incl. stops
    elevationGainM: null,
    effortLevel: null, // 'low' | 'moderate' | 'high' | 'extreme'
    suitability: Object.fromEntries(SUITABILITY_KEYS.map((k) => [k, null])),
    requirements: [],
    terrain: '',
    notes: '',
  }
}

function migrateOne(entry) {
  const old = entry.accessibility || {}
  const next = emptyAccessibility()

  // Preserve terrain/notes verbatim.
  if (typeof old.terrain === 'string') next.terrain = old.terrain
  if (typeof old.notes === 'string') next.notes = old.notes

  // The old `walking` field was a free-form distance description. If terrain is
  // empty, promote it there; otherwise prepend to notes so we don't lose it.
  if (typeof old.walking === 'string' && old.walking.trim()) {
    if (!next.terrain) {
      next.terrain = old.walking
    } else {
      next.notes = next.notes
        ? `Walking: ${old.walking}\n${next.notes}`
        : `Walking: ${old.walking}`
    }
  }

  // Boolean wheelchair flag → suitability matrix entry.
  if (typeof old.wheelchairFriendly === 'boolean') {
    next.suitability.wheelchair = old.wheelchairFriendly ? 'yes' : 'no'
  }

  // Already-migrated entries (re-running the script is safe).
  if (typeof old.walkingDistanceKm === 'number') next.walkingDistanceKm = old.walkingDistanceKm
  if (typeof old.drivingDistanceKm === 'number') next.drivingDistanceKm = old.drivingDistanceKm
  if (typeof old.walkingDurationMin === 'number') next.walkingDurationMin = old.walkingDurationMin
  if (typeof old.drivingDurationMin === 'number') next.drivingDurationMin = old.drivingDurationMin
  if (typeof old.durationMin === 'number') next.durationMin = old.durationMin
  if (typeof old.elevationGainM === 'number') next.elevationGainM = old.elevationGainM
  if (typeof old.effortLevel === 'string') next.effortLevel = old.effortLevel
  if (old.suitability && typeof old.suitability === 'object') {
    for (const k of SUITABILITY_KEYS) {
      if (old.suitability[k] === 'yes' || old.suitability[k] === 'partial' || old.suitability[k] === 'no') {
        next.suitability[k] = old.suitability[k]
      }
    }
  }
  if (Array.isArray(old.requirements)) next.requirements = old.requirements

  return { ...entry, accessibility: next }
}

async function migrateFile(file) {
  const full = path.join(ROOT, file)
  const data = JSON.parse(await fs.readFile(full, 'utf8'))
  const next = data.map(migrateOne)
  await fs.writeFile(full, JSON.stringify(next, null, 2) + '\n', 'utf8')
  console.log(`  ✓ ${file}: ${next.length} entries`)
}

console.log('migrating accessibility…')
await migrateFile('src/data/tours.json')
await migrateFile('src/data/packages.json')
console.log('done.')
