import express from 'express'
import { execFile } from 'node:child_process'
import { readCollection, writeCollection, nextId, readAvailability, writeAvailability } from './storage.js'
import { upload, processUpload } from './upload.js'
import { renameUpload } from './rename.js'
import { loadEnv, googleCredentials } from '../scripts/lib/env.mjs'
import { fetchBookings } from '../netlify/functions/_lib/gcal.mjs'

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
  router.use('/reviews', buildCollectionRouter('reviews'))

  // Read-only: the Google reviews written by scripts/sync-google-reviews.mjs.
  // The admin can hide individual ones (settings.hiddenGoogleReviewIds) but
  // never edit the text — it belongs to whoever wrote it.
  router.get('/google-reviews', asyncHandler(async (_req, res) => {
    const data = await readCollection('googleReviews')
    res.json(Array.isArray(data) ? { reviews: [] } : data)
  }))

  // Read-only view of the bookings on the Google Calendar.
  //
  // Google Calendar shows you your day; it does not show you "Mostar, 14 Aug,
  // English — 14 of 16 seats, 2 of them from Viator". That merge of calendar
  // bookings with the OTA seats in manual-bookings.json exists nowhere else,
  // and it's the number that answers "can I take this group?".
  //
  // Read-only on purpose: this server only runs locally, whereas the phone in
  // your pocket already has a perfectly good delete button. Rows link out to
  // the event instead.
  router.get('/bookings', asyncHandler(async (_req, res) => {
    const { sa, calendarId } = googleCredentials(loadEnv())
    if (!sa || !calendarId) {
      return res.status(503).json({
        error: 'Google Calendar not configured — add GOOGLE_SA_KEY_B64 and GOOGLE_CALENDAR_ID to .env.',
      })
    }
    const days = Math.min(Number(_req.query.days) || 180, 550)
    res.json({ bookings: await fetchBookings({ sa, calendarId, days }) })
  }))

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

  // Announcement bar is also a singleton — plain read/write of
  // src/data/announcement.json.
  router.get('/announcement', asyncHandler(async (_req, res) => {
    const data = await readCollection('announcement')
    res.json(Array.isArray(data) ? {} : data)
  }))

  router.put('/announcement', asyncHandler(async (req, res) => {
    const body = req.body || {}
    await writeCollection('announcement', body)
    res.json(body)
  }))

  // Availability — journey departure dates + blocked dates, stored in
  // src/data/availability/*.json. These edits are authoritative: nothing
  // regenerates those files, so what's saved here is what ships on the next
  // publish.
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

  router.get('/availability', asyncHandler(async (_req, res) => {
    res.json(await readAvailability())
  }))

  router.put('/availability', asyncHandler(async (req, res) => {
    const { departureDates, blockedDates, manualBookings, weeklyAvailability } = req.body || {}
    if (!departureDates || typeof departureDates !== 'object' || Array.isArray(departureDates)) {
      return res.status(400).json({ error: 'departureDates must be an object of slug → dates' })
    }
    if (!Array.isArray(blockedDates)) {
      return res.status(400).json({ error: 'blockedDates must be an array' })
    }
    if (!Array.isArray(manualBookings)) {
      return res.status(400).json({ error: 'manualBookings must be an array' })
    }
    if (!weeklyAvailability || typeof weeklyAvailability !== 'object' || Array.isArray(weeklyAvailability)) {
      return res.status(400).json({ error: 'weeklyAvailability must be an object of slug → weekday numbers' })
    }

    // Normalize: valid ISO dates only, deduped and sorted; drop empty slugs.
    const cleanDeparture = {}
    for (const [slug, dates] of Object.entries(departureDates)) {
      if (!slug.trim() || !Array.isArray(dates)) continue
      const clean = [...new Set(dates.filter((d) => ISO_DATE.test(d)))].sort()
      if (clean.length) cleanDeparture[slug.trim()] = clean
    }
    const seen = new Set()
    const cleanBlocked = blockedDates
      .map((b) => ({ date: String(b?.date || ''), tourSlug: String(b?.tourSlug || '').trim() }))
      .filter((b) => ISO_DATE.test(b.date))
      .filter((b) => {
        const key = `${b.date}|${b.tourSlug}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a, b) => a.date.localeCompare(b.date))

    // Manual (OTA) bookings: seats sold on external channels that must count
    // against on-site availability. Multiple entries per tour/date/language
    // are allowed — they sum.
    const cleanManual = manualBookings
      .map((b) => ({
        tourSlug: String(b?.tourSlug || '').trim(),
        date: String(b?.date || ''),
        language: String(b?.language || '').trim().toLowerCase(),
        numPeople: Math.floor(Number(b?.numPeople) || 0),
        note: String(b?.note || '').trim().slice(0, 120),
      }))
      .filter((b) => b.tourSlug && ISO_DATE.test(b.date) && b.numPeople >= 1 && b.numPeople <= 99)
      .sort((a, b) => a.date.localeCompare(b.date) || a.tourSlug.localeCompare(b.tourSlug))

    // Weekly recurring schedule: slug → array of allowed weekday numbers
    // (0=Sun…6=Sat, JS Date#getDay convention). A full or empty-after-clean
    // set is dropped — "every day" is the implicit default when a slug has
    // no entry at all, so storing all 7 would be redundant.
    const cleanWeekly = {}
    for (const [slug, days] of Object.entries(weeklyAvailability)) {
      if (!slug.trim() || !Array.isArray(days)) continue
      const clean = [...new Set(days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort()
      if (clean.length < 7) cleanWeekly[slug.trim()] = clean
    }

    const clean = {
      departureDates: cleanDeparture,
      blockedDates: cleanBlocked,
      manualBookings: cleanManual,
      weeklyAvailability: cleanWeekly,
    }
    await writeAvailability(clean)
    res.json(clean)
  }))

  const git = (args) =>
    new Promise((resolve, reject) => {
      execFile('git', args, (err, stdout, stderr) => {
        if (err) {
          const e = new Error((stderr || stdout || err.message).trim())
          e.stdout = stdout
          reject(e)
        } else resolve(stdout)
      })
    })

  // Commit the content paths (and only those) and optionally push, so an
  // editor can go live without leaving the admin. Deliberately scoped with a
  // pathspec: anything staged elsewhere in the repo is left untouched.
  // Netlify auto-builds on push, so push === deploy. Body:
  //   { message?: string, push?: boolean (default true) }
  // With a clean tree and push=true this is a plain deploy of unpushed
  // commits (the "committed but never pushed" trap).
  router.post('/publish', asyncHandler(async (req, res) => {
    const message = String(req.body?.message || '').trim() || 'Content updates from the admin panel'
    const wantPush = req.body?.push !== false

    let committed = false
    try {
      const dirty = (await git(['status', '--porcelain', '--', 'src/data', 'public/uploads'])).trim()
      if (dirty) {
        await git(['add', '--', 'src/data', 'public/uploads'])
        await git(['commit', '-m', message, '--', 'src/data', 'public/uploads'])
        committed = true
      }
    } catch (e) {
      return res.status(400).json({ error: `Commit failed: ${e.message}` })
    }

    if (!wantPush) return res.json({ ok: true, committed, pushed: false })

    try {
      await git(['push', 'origin', 'HEAD'])
      return res.json({ ok: true, committed, pushed: true })
    } catch (e) {
      // The commit is safe locally — report the push separately so the UI
      // can say "committed, deploy failed, retry later" instead of implying
      // the work was lost.
      return res.json({ ok: false, committed, pushed: false, pushError: e.message })
    }
  }))

  // Content edits only exist locally until committed AND pushed — surface
  // uncommitted data/upload files and any local commits the remote doesn't
  // have yet, so editors always see undeployed work.
  router.get('/status', asyncHandler(async (_req, res) => {
    try {
      const stdout = await git(['status', '--porcelain', '--', 'src/data', 'public/uploads'])
      const lines = stdout.split('\n').filter(Boolean)
      // Porcelain lines are "XY path" (renames: "XY old -> new").
      const files = lines.map((l) => l.slice(3).split(' -> ').pop())
      let ahead = 0
      try {
        ahead = parseInt(await git(['rev-list', '--count', '@{upstream}..HEAD']), 10) || 0
      } catch {
        // No upstream configured — nothing to report.
      }
      res.json({ changedFiles: lines.length, files: files.slice(0, 40), ahead })
    } catch {
      res.json({ changedFiles: null })
    }
  }))

  router.use((err, _req, res, _next) => {
    console.error('[admin-server]', err)
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'server error' })
  })

  return router
}
