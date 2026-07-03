// RSS feed for The Journal — written to dist/rss.xml during the prerender
// step. Feed readers and Google both use it to discover new posts quickly.

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://tallesttourguide.com'

function escapeXml(str = '') {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function writeRss(distDir) {
  let posts
  try {
    posts = JSON.parse(readFileSync(path.join(ROOT, 'src/data/journal.json'), 'utf-8'))
  } catch {
    return 0
  }

  const items = posts
    .filter((p) => p.published !== false && p.slug)
    .sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''))
    .map((p) => {
      const url = `${ORIGIN}/journal/${p.slug}/`
      const pubDate = p.publishedDate ? new Date(p.publishedDate).toUTCString() : ''
      return [
        '    <item>',
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        p.excerpt ? `      <description>${escapeXml(p.excerpt)}</description>` : null,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
        p.category ? `      <category>${escapeXml(p.category)}</category>` : null,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>The Journal — Tallest Tourguide</title>',
    `    <link>${ORIGIN}/journal/</link>`,
    '    <description>Stories, guides and local knowledge from Sarajevo and the Balkans.</description>',
    '    <language>en</language>',
    `    <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')

  writeFileSync(path.join(distDir, 'rss.xml'), xml, 'utf-8')
  return items.length
}

export default writeRss
