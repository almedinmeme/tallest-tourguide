// One-time migration: extract tours and packages from JS source files
// into src/data/{tours,packages}.json, and copy referenced webp assets
// from src/assets/ into public/uploads/ so the site can serve them by URL.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ASSETS = path.join(ROOT, 'src/assets')
const UPLOADS = path.join(ROOT, 'public/uploads')
const TMP_DIR = path.join(ROOT, 'scripts', '.tmp-migrate')

const IMPORT_RE =
  /import\s+(\w+)\s+from\s+['"]\.\.\/assets\/([^'"]+\.(?:webp|jpg|jpeg|png|svg))['"]\s*;?\s*\n?/g

async function ensureDir(d) {
  await fs.mkdir(d, { recursive: true })
}

async function copyAssetsToUploads(filenames) {
  await ensureDir(UPLOADS)
  let copied = 0
  for (const f of filenames) {
    const src = path.join(ASSETS, f)
    const dst = path.join(UPLOADS, f)
    try {
      await fs.copyFile(src, dst)
      copied += 1
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
      console.warn(`  ! missing asset: ${f}`)
    }
  }
  return copied
}

async function extractAndImport({ srcPath, exportName, sliceStart, sliceEnd }) {
  const src = await fs.readFile(srcPath, 'utf-8')

  const importMap = new Map()
  for (const m of src.matchAll(IMPORT_RE)) {
    importMap.set(m[1], m[2])
  }

  const importStubs = [...importMap.entries()]
    .map(([name, file]) => `const ${name} = '/uploads/${file}'`)
    .join('\n')

  let body
  if (sliceStart != null) {
    const lines = src.split('\n')
    body = lines.slice(sliceStart - 1, sliceEnd).join('\n')
  } else {
    body = src.replace(IMPORT_RE, '')
  }

  const moduleSrc = `${importStubs}\n${body}\nexport { ${exportName} }\n`

  await ensureDir(TMP_DIR)
  const tmpFile = path.join(TMP_DIR, `${exportName}-${Date.now()}.mjs`)
  await fs.writeFile(tmpFile, moduleSrc, 'utf-8')

  try {
    const mod = await import(pathToFileURL(tmpFile).href)
    return { data: mod[exportName], importMap }
  } finally {
    await fs.rm(tmpFile, { force: true })
  }
}

function collectReferencedFiles(data) {
  const files = new Set()
  const walk = (v) => {
    if (typeof v === 'string') {
      const m = v.match(/^\/uploads\/(.+)$/)
      if (m) files.add(m[1])
    } else if (Array.isArray(v)) {
      v.forEach(walk)
    } else if (v && typeof v === 'object') {
      Object.values(v).forEach(walk)
    }
  }
  walk(data)
  return [...files]
}

async function migrateTours() {
  console.log('migrating tours…')
  const toursJsonPath = path.join(ROOT, 'src/data/tours.json')
  try {
    await fs.access(toursJsonPath)
    console.log('  · tours.json already exists, skipping (idempotent)')
    return
  } catch {}
  const { data } = await extractAndImport({
    srcPath: path.join(ROOT, 'src/data/tours.js'),
    exportName: 'tours',
  })
  if (!Array.isArray(data)) throw new Error('expected tours array')
  const files = collectReferencedFiles(data)
  const copied = await copyAssetsToUploads(files)
  await fs.writeFile(
    path.join(ROOT, 'src/data/tours.json'),
    JSON.stringify(data, null, 2) + '\n',
    'utf-8',
  )
  console.log(`  ✓ ${data.length} tours, ${copied}/${files.length} images copied`)
}

async function findArrayBounds(srcPath, varName) {
  const src = await fs.readFile(srcPath, 'utf-8')
  const lines = src.split('\n')
  const re = new RegExp(`^const\\s+${varName}\\s*=\\s*\\[`)
  const start = lines.findIndex((l) => re.test(l))
  if (start === -1) throw new Error(`could not find ${varName} in ${srcPath}`)
  let depth = 0
  for (let i = start; i < lines.length; i += 1) {
    for (const ch of lines[i]) {
      if (ch === '[') depth += 1
      else if (ch === ']') {
        depth -= 1
        if (depth === 0) return { start: start + 1, end: i + 1 }
      }
    }
  }
  throw new Error(`unterminated ${varName} array`)
}

async function migratePackages() {
  console.log('migrating packages…')
  // 1. Pull rich detail data from PackageDetail.jsx
  const detailPath = path.join(ROOT, 'src/pages/PackageDetail.jsx')
  const detailBounds = await findArrayBounds(detailPath, 'packages')
  const { data: detail } = await extractAndImport({
    srcPath: detailPath,
    exportName: 'packages',
    sliceStart: detailBounds.start,
    sliceEnd: detailBounds.end,
  })
  if (!Array.isArray(detail)) throw new Error('expected detail packages array')

  // 2. Pull listing-card data from Packages.jsx
  const listPath = path.join(ROOT, 'src/pages/Packages.jsx')
  const listBounds = await findArrayBounds(listPath, 'standardPackages')
  const { data: list } = await extractAndImport({
    srcPath: listPath,
    exportName: 'standardPackages',
    sliceStart: listBounds.start,
    sliceEnd: listBounds.end,
  })
  if (!Array.isArray(list)) throw new Error('expected standardPackages array')

  // 3. Merge by slug. Detail wins where keys overlap, except keep listing-only
  //    presentation fields (badge/badgeColor/locations/countries/countryList/etc.)
  const bySlug = new Map(detail.map((p) => [p.slug, { ...p }]))
  for (const lp of list) {
    const existing = bySlug.get(lp.slug) || {}
    bySlug.set(lp.slug, { ...lp, ...existing })
  }
  const merged = [...bySlug.values()]

  const files = collectReferencedFiles(merged)
  const copied = await copyAssetsToUploads(files)
  await fs.writeFile(
    path.join(ROOT, 'src/data/packages.json'),
    JSON.stringify(merged, null, 2) + '\n',
    'utf-8',
  )
  console.log(`  ✓ ${merged.length} packages, ${copied}/${files.length} images copied`)
}

async function main() {
  await ensureDir(UPLOADS)
  await migrateTours()
  await migratePackages()
  await fs.rm(TMP_DIR, { recursive: true, force: true })
  console.log('done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
