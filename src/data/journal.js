// Journal posts — local JSON collection, edited via /admin like tours and
// destinations. Migrated from Airtable (scripts/migrate-journal.mjs) so posts
// are enumerable at build time: they get prerendered HTML and sitemap entries
// instead of being invisible to crawlers behind a runtime fetch.
//
// Post bodies are a blocks[] array (see journalBlocks.js) — text blocks hold
// TipTap HTML; use postBlocks(post) to get the render-ready list.

import journal from './journal.json'

export const posts = journal
  .filter((p) => p.published !== false && p.slug)
  .sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''))

export default posts
