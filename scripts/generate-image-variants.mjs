// Generates responsive variants (480/960/1600w webp) for every image in
// dist/uploads/ so src/components/Img.jsx can emit srcset in production.
//
// Runs as part of `npm run build`, AFTER `vite build` (which copies
// public/uploads → dist/uploads) and BEFORE the prerender. Variants live only
// in dist/ — the repo keeps just the originals.
//
// withoutEnlargement means a variant of a small original is written at the
// original size — slightly redundant, but it guarantees every srcset URL
// exists, which is what keeps the <img> from breaking.

import { readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'dist/uploads')
const WIDTHS = [480, 960, 1600]
const VARIANT_RE = /-(?:480|960|1600)w\.webp$/

async function main() {
  if (!existsSync(DIR)) {
    console.log('[variants] dist/uploads not found — run vite build first.')
    return
  }

  const files = (await readdir(DIR)).filter(
    (f) => f.endsWith('.webp') && !VARIANT_RE.test(f),
  )

  let written = 0
  let skipped = 0
  for (const file of files) {
    const src = path.join(DIR, file)
    const stem = file.slice(0, -'.webp'.length)
    for (const width of WIDTHS) {
      const out = path.join(DIR, `${stem}-${width}w.webp`)
      if (existsSync(out)) {
        const [a, b] = await Promise.all([stat(out), stat(src)])
        if (a.mtimeMs >= b.mtimeMs) {
          skipped += 1
          continue
        }
      }
      await sharp(src)
        .resize(width, width * 2, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(out)
      written += 1
    }
  }
  console.log(`[variants] ${files.length} originals → wrote ${written} variants${skipped ? `, ${skipped} up-to-date` : ''}.`)
}

main().catch((e) => {
  console.error('[variants] error:', e)
  process.exit(1)
})
