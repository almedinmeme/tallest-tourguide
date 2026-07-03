// Canonical URL builder — single source of truth for absolute site URLs.
//
// Netlify serves the prerendered pages as directories, so every route's
// real URL ends in a trailing slash (/tours/x 301s to /tours/x/). Canonicals,
// og:url, sitemap entries and JSON-LD urls must all use that exact form,
// otherwise they point at redirecting URLs and Google gets mixed signals.

export const SITE_ORIGIN = 'https://tallesttourguide.com'

export function siteUrl(path = '/') {
  const clean = String(path).replace(/^\/+|\/+$/g, '')
  return clean ? `${SITE_ORIGIN}/${clean}/` : `${SITE_ORIGIN}/`
}

export default siteUrl
