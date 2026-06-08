import { promises as fs } from 'node:fs'
import path from 'node:path'
import multer from 'multer'
import sharp from 'sharp'
import { customAlphabet } from 'nanoid'
import { PATHS } from './storage.js'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
})

function safeSlug(input, fallback = 'image') {
  const s = String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return s || fallback
}

export async function processUpload(file, opts = {}) {
  if (!file) throw new Error('no file uploaded')
  await fs.mkdir(PATHS.uploads, { recursive: true })

  const slug = safeSlug(opts.slug || path.parse(file.originalname).name)
  const id = nanoid()
  const filename = `${slug}-${id}.webp`
  const outPath = path.join(PATHS.uploads, filename)

  const info = await sharp(file.buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath)

  return {
    url: `/uploads/${filename}`,
    width: info.width,
    height: info.height,
    bytes: info.size,
  }
}
