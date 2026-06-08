import express from 'express'
import { readCollection, writeCollection, nextId } from './storage.js'
import { upload, processUpload } from './upload.js'
import { renameUpload } from './rename.js'

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

function buildCollectionRouter(name) {
  const r = express.Router()

  r.get('/', asyncHandler(async (_req, res) => {
    res.json(await readCollection(name))
  }))

  r.get('/:id', asyncHandler(async (req, res) => {
    const items = await readCollection(name)
    const item = items.find((i) => String(i.id) === String(req.params.id))
    if (!item) return res.status(404).json({ error: 'not found' })
    res.json(item)
  }))

  r.post('/', asyncHandler(async (req, res) => {
    const items = await readCollection(name)
    const body = req.body || {}
    const item = { ...body, id: nextId(items) }
    items.push(item)
    await writeCollection(name, items)
    res.status(201).json(item)
  }))

  r.put('/:id', asyncHandler(async (req, res) => {
    const items = await readCollection(name)
    const idx = items.findIndex((i) => String(i.id) === String(req.params.id))
    if (idx === -1) return res.status(404).json({ error: 'not found' })
    const body = req.body || {}
    const merged = { ...body, id: items[idx].id }
    items[idx] = merged
    await writeCollection(name, items)
    res.json(merged)
  }))

  r.delete('/:id', asyncHandler(async (req, res) => {
    const items = await readCollection(name)
    const next = items.filter((i) => String(i.id) !== String(req.params.id))
    if (next.length === items.length) return res.status(404).json({ error: 'not found' })
    await writeCollection(name, next)
    res.status(204).end()
  }))

  return r
}

export function buildAdminRouter() {
  const router = express.Router()
  router.use(express.json({ limit: '10mb' }))

  router.use('/tours', buildCollectionRouter('tours'))
  router.use('/packages', buildCollectionRouter('packages'))
  router.use('/destinations', buildCollectionRouter('destinations'))
  router.use('/accommodations', buildCollectionRouter('accommodations'))
  router.use('/pages', buildCollectionRouter('pages'))

  router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
    const result = await processUpload(req.file, { slug: req.body?.slug })
    res.json(result)
  }))

  router.post('/rename', asyncHandler(async (req, res) => {
    const result = await renameUpload(req.body || {})
    res.json(result)
  }))

  router.use((err, _req, res, _next) => {
    console.error('[admin-server]', err)
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'server error' })
  })

  return router
}
