// Rename a previously-uploaded file under public/uploads/.
// Strictly validates both URLs to keep this scoped to local uploads only —
// no path traversal, no clobbering existing files, no extension swap.

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { PATHS } from './storage.js'

const FILENAME_RE = /^[a-zA-Z0-9._-]+\.(webp|jpg|jpeg|png|gif|avif|svg)$/

function parseUploadUrl(url) {
  if (typeof url !== 'string') return null
  const m = url.match(/^\/uploads\/([^/?#]+)$/)
  if (!m) return null
  const filename = m[1]
  if (!FILENAME_RE.test(filename)) return null
  return filename
}

export async function renameUpload({ from, to }) {
  const fromName = parseUploadUrl(from)
  const toName = parseUploadUrl(to)

  if (!fromName) {
    const err = new Error('from must be a local /uploads/<filename> path')
    err.status = 400
    throw err
  }
  if (!toName) {
    const err = new Error('to must be a local /uploads/<filename> path with a safe filename')
    err.status = 400
    throw err
  }
  if (fromName === toName) {
    return { url: `/uploads/${toName}`, unchanged: true }
  }

  // Refuse extension changes — we don't transcode here.
  const fromExt = path.extname(fromName).toLowerCase()
  const toExt = path.extname(toName).toLowerCase()
  if (fromExt !== toExt) {
    const err = new Error(`extension must stay the same (got ${fromExt} → ${toExt})`)
    err.status = 400
    throw err
  }

  const fromPath = path.join(PATHS.uploads, fromName)
  const toPath = path.join(PATHS.uploads, toName)

  // Defense in depth: both must resolve inside PATHS.uploads.
  if (!fromPath.startsWith(PATHS.uploads + path.sep) || !toPath.startsWith(PATHS.uploads + path.sep)) {
    const err = new Error('resolved path escapes uploads directory')
    err.status = 400
    throw err
  }

  try {
    await fs.access(fromPath)
  } catch {
    const err = new Error(`source file not found: ${fromName}`)
    err.status = 404
    throw err
  }

  // Refuse overwrite.
  try {
    await fs.access(toPath)
    const err = new Error(`a file named ${toName} already exists`)
    err.status = 409
    throw err
  } catch (e) {
    if (e.status) throw e
    // ENOENT means the target is free — good, continue.
  }

  await fs.rename(fromPath, toPath)
  return { url: `/uploads/${toName}` }
}
