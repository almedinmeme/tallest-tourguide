import express from 'express'
import { execFile } from 'node:child_process'
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

  // Must be declared before PUT /:id so "order" isn't captured as an id.
  // Body: { ids: [...] } — a permutation of every existing item id; the file
  // is rewritten in that order (array order is what the public site renders).
  r.put('/order', asyncHandler(async (req, res) => {
    const items = await readCollection(name)
    const ids = req.body?.ids
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' })
    }
    const byId = new Map(items.map((i) => [String(i.id), i]))
    const wanted = ids.map(String)
    const isPermutation =
      wanted.length === items.length &&
      new Set(wanted).size === wanted.length &&
      wanted.every((id) => byId.has(id))
    if (!isPermutation) {
      return res.status(400).json({ error: 'ids must be a permutation of existing item ids' })
    }
    const next = wanted.map((id) => byId.get(id))
    await writeCollection(name, next)
    res.json(next)
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
  router.use('/journal', buildCollectionRouter('journal'))

  router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
    const result = await processUpload(req.file, { slug: req.body?.slug })
    res.json(result)
  }))

  router.post('/rename', asyncHandler(async (req, res) => {
    const result = await renameUpload(req.body || {})
    res.json(result)
  }))

  // Settings is a singleton object, not a collection — plain read/write of
  // src/data/settings.json.
  router.get('/settings', asyncHandler(async (_req, res) => {
    const data = await readCollection('settings')
    res.json(Array.isArray(data) ? {} : data)
  }))

  router.put('/settings', asyncHandler(async (req, res) => {
    const body = req.body || {}
    await writeCollection('settings', body)
    res.json(body)
  }))

  // Commit the content paths (and only those) so an editor can publish
  // without leaving the admin. Deliberately scoped with a pathspec: anything
  // the user has staged elsewhere in the repo is left untouched, and there
  // is no push — deploying stays a human step.
  router.post('/publish', asyncHandler(async (req, res) => {
    const message = String(req.body?.message || '').trim() || 'Content updates from the admin panel'
    execFile('git', ['add', '--', 'src/data', 'public/uploads'], (addErr) => {
      if (addErr) return res.status(500).json({ error: addErr.message })
      execFile(
        'git',
        ['commit', '-m', message, '--', 'src/data', 'public/uploads'],
        (err, stdout, stderr) => {
          if (err) return res.status(400).json({ error: (stderr || stdout || err.message).trim() })
          res.json({ ok: true, output: stdout.trim() })
        },
      )
    })
  }))

  // Content edits only exist locally until committed — surface how many
  // data/upload files are uncommitted (and which) so editors know to publish.
  router.get('/status', (_req, res) => {
    execFile(
      'git',
      ['status', '--porcelain', '--', 'src/data', 'public/uploads'],
      (err, stdout) => {
        if (err) return res.json({ changedFiles: null })
        const lines = stdout.split('\n').filter(Boolean)
        // Porcelain lines are "XY path" (renames: "XY old -> new").
        const files = lines.map((l) => l.slice(3).split(' -> ').pop())
        res.json({ changedFiles: lines.length, files: files.slice(0, 40) })
      },
    )
  })

  router.use((err, _req, res, _next) => {
    console.error('[admin-server]', err)
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'server error' })
  })

  return router
}
