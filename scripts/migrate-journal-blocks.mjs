// One-time migration: convert journal posts from the fixed body layout
// (content, inlineImage1, content2, …, content5) to the flexible blocks[]
// array rendered by BlogPost.jsx and edited in the admin, and fold the
// post-level inline card (inlineCardSlug/inlineCardType) into a promo block
// at its historical position. Safe to re-run.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/journal.json')
const posts = JSON.parse(fs.readFileSync(file, 'utf8'))

const LEGACY_KEYS = [
  'content',
  ...[2, 3, 4, 5].map((n) => `content${n}`),
  ...[1, 2, 3, 4].flatMap((n) => [`inlineImage${n}`, `inlineImage${n}Caption`]),
]

// Stable per-block ids keep React keys (and the TipTap editors behind them)
// stable while blocks are reordered in the admin.
const newId = () => Math.random().toString(36).slice(2, 8)

// Legacy auto-placement: after the 2nd text block (and its image, if any).
function legacyPromoIndex(blocks) {
  let textSeen = 0
  let at = blocks.length
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'text') {
      textSeen++
      if (textSeen === 2) {
        at = i + 1
        break
      }
    }
  }
  if (at < blocks.length && blocks[at].type === 'image') at++
  return at
}

let migrated = 0
const next = posts.map((post) => {
  let blocks
  if (Array.isArray(post.blocks) && post.blocks.length > 0) {
    blocks = post.blocks.map((b) => (b.id ? b : { id: newId(), ...b }))
  } else {
    blocks = []
    for (let n = 1; n <= 5; n++) {
      const html = post[n === 1 ? 'content' : `content${n}`]
      if (html) blocks.push({ id: newId(), type: 'text', html })
      if (n < 5 && post[`inlineImage${n}`]) {
        blocks.push({ id: newId(), type: 'image', src: post[`inlineImage${n}`], caption: post[`inlineImage${n}Caption`] || '' })
      }
    }
  }

  // Fold the post-level inline card into a promo block.
  if (post.inlineCardSlug) {
    const card = { cardType: post.inlineCardType === 'package' ? 'package' : 'tour', slug: post.inlineCardSlug }
    const marker = blocks.findIndex((b) => b.type === 'promo' && !b.slug)
    if (marker !== -1) blocks[marker] = { ...blocks[marker], ...card }
    else if (!blocks.some((b) => b.type === 'promo' && b.slug === card.slug)) {
      blocks.splice(legacyPromoIndex(blocks), 0, { id: newId(), type: 'promo', ...card })
    }
  }

  const copy = { ...post, blocks }
  for (const key of [...LEGACY_KEYS, 'inlineCardSlug', 'inlineCardType']) delete copy[key]
  if (JSON.stringify(copy) !== JSON.stringify(post)) migrated++
  return copy
})

fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n')
console.log(`migrated ${migrated} of ${posts.length} posts to blocks[]`)
