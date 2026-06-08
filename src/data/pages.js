// Editorial singleton pages (Our Story, Hospitality, Signature, Partners,
// Consult). Single source of truth is src/data/pages.json, edited via the
// local /admin panel under "Pages". Look up a page by its slug.

import pages from './pages.json'

export function getPage(slug) {
  return pages.find((p) => p.slug === slug) || null
}

export { pages }
export default pages
