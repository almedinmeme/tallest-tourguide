// useBlog.js
// Journal posts from the local JSON collection (src/data/journal.js).
//
// Posts used to come from Airtable at runtime, which meant crawlers saw an
// empty shell (the posts couldn't be prerendered or listed in the sitemap).
// The data now lives in journal.json — edited via /admin — so it's available
// synchronously at build time and render time alike.
//
// Kept as a hook with the same { posts, loading, error } contract so the
// consumers (Blog, BlogPost, Home, Navbar search, mobile nav) didn't change.

import { posts } from '../data/journal'

export function useBlog() {
  return { posts, loading: false, error: null }
}
