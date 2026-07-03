// One-time migration: Airtable `Blog` table → src/data/journal.json.
//
// Moves the journal into the local JSON CMS so posts are enumerable at build
// time (prerender + sitemap) like tours and destinations. Airtable keeps
// bookings/reviews/availability — only journal content moves.
//
// What it does per published post:
//   - preserves the slug exactly (URL continuity — no redirect churn)
//   - converts the markdown content sections to HTML once (marked), so the
//     admin TipTap editor can edit them like every other collection
//   - downloads remote images (Airtable attachment URLs EXPIRE) through the
//     same sharp pipeline as admin uploads → public/uploads/*.webp
//
// Idempotent: re-running overwrites journal.json and re-uses downloaded
// images that already exist. Usage:  node scripts/migrate-journal.mjs

import { readFileSync, existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const UPLOADS = path.join(ROOT, 'public/uploads')
const OUT = path.join(ROOT, 'src/data/journal.json')

function loadEnv() {
  const env = { ...process.env }
  try {
    for (const line of readFileSync(path.join(ROOT, '.env'), 'utf-8').split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  } catch {
    // no .env — rely on process.env
  }
  return env
}

async function fetchAllRecords(token, baseId) {
  const records = []
  let offset
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/Blog`)
    url.searchParams.set('filterByFormula', '{Published}=1')
    url.searchParams.set('sort[0][field]', 'PublishedDate')
    url.searchParams.set('sort[0][direction]', 'desc')
    if (offset) url.searchParams.set('offset', offset)
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`)
    const data = await res.json()
    records.push(...(data.records || []))
    offset = data.offset
  } while (offset)
  return records
}

// Same conventions as admin-server/upload.js: max 2400px, webp q82.
async function localizeImage(src, slug, field) {
  if (!src) return ''
  if (src.startsWith('/')) return src // already a local path
  const local = src.match(/^https?:\/\/(?:www\.)?tallesttourguide\.com(\/.+)$/)
  if (local) return local[1]

  const filename = `journal-${slug}-${field}.webp`
  const outPath = path.join(UPLOADS, filename)
  if (existsSync(outPath)) return `/uploads/${filename}`

  const res = await fetch(src)
  if (!res.ok) throw new Error(`download failed (${res.status})`)
  const buf = Buffer.from(await res.arrayBuffer())
  await sharp(buf)
    .rotate()
    .resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath)
  return `/uploads/${filename}`
}

// Content sections are markdown in Airtable (the site rendered them with
// marked at runtime). Convert once so the stored form is HTML like every
// other rich-text field in the CMS.
function toHtml(md) {
  if (!md || !md.trim()) return ''
  return marked.parse(md).trim()
}

async function main() {
  const env = loadEnv()
  const token = env.AIRTABLE_TOKEN || env.VITE_AIRTABLE_TOKEN
  const baseId = env.AIRTABLE_BASE_ID || env.VITE_AIRTABLE_BASE_ID
  if (!token || !baseId) {
    console.error('[migrate-journal] Missing VITE_AIRTABLE_TOKEN / VITE_AIRTABLE_BASE_ID')
    process.exit(1)
  }

  await mkdir(UPLOADS, { recursive: true })
  const records = await fetchAllRecords(token, baseId)
  console.log(`[migrate-journal] fetched ${records.length} published posts`)

  const warnings = []
  const posts = []
  let id = 1

  for (const r of records) {
    const f = r.fields
    const slug = f.Slug || ''
    if (!slug) {
      warnings.push(`record ${r.id} ("${f.Title || 'untitled'}") has no slug — skipped`)
      continue
    }

    const img = async (value, field) => {
      try {
        return await localizeImage(value || '', slug, field)
      } catch (e) {
        warnings.push(`${slug}: image ${field} kept as remote URL (${e.message})`)
        return value || ''
      }
    }

    posts.push({
      id: id++,
      slug,
      published: true,
      title: f.Title || '',
      excerpt: f.Excerpt || '',
      category: f.Category || '',
      publishedDate: f.PublishedDate || '',
      heroImage: await img(f.HeroImage, 'hero'),
      content: toHtml(f.Content),
      inlineImage1: await img(f.InlineImage1, 'inline1'),
      inlineImage1Caption: f.InlineImage1Caption || '',
      content2: toHtml(f.Content2),
      inlineImage2: await img(f.InlineImage2, 'inline2'),
      inlineImage2Caption: f.InlineImage2Caption || '',
      content3: toHtml(f.Content3),
      inlineImage3: await img(f.InlineImage3, 'inline3'),
      inlineImage3Caption: f.InlineImage3Caption || '',
      content4: toHtml(f.Content4),
      inlineImage4: await img(f.InlineImage4, 'inline4'),
      inlineImage4Caption: f.InlineImage4Caption || '',
      content5: toHtml(f.Content5),
      relatedTourSlug: f.RelatedTourSlug || '',
      relatedPackageSlug: f.RelatedPackageSlug || '',
      inlineCardSlug: f.InlineCardSlug || '',
      inlineCardType: f.InlineCardType || 'tour',
    })
    console.log(`  ✓ ${slug}`)
  }

  await writeFile(OUT, JSON.stringify(posts, null, 2) + '\n', 'utf-8')
  console.log(`\n[migrate-journal] wrote ${posts.length} posts to src/data/journal.json`)
  if (warnings.length) {
    console.warn(`[migrate-journal] ${warnings.length} warning(s):`)
    for (const w of warnings) console.warn(`  ⚠ ${w}`)
  }
}

main().catch((e) => {
  console.error('[migrate-journal] error:', e)
  process.exit(1)
})
