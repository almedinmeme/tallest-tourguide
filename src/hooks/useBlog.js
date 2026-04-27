// useBlog.js
// Fetches all published blog posts from Airtable.
// Posts are sorted by PublishedDate descending (newest first).
// Results are cached for the lifetime of the page session
// so navigating between blog posts doesn't re-fetch.

import { useState, useEffect } from 'react'

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const TABLE = 'Blog'

let cache = null

export function useBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!TOKEN || !BASE_ID) return

    if (cache) {
      setPosts(cache)
      return
    }

    const controller = new AbortController()

    async function fetchPosts() {
      setLoading(true)
      setError(null)

      const formula = encodeURIComponent(`{Published}=1`)
      const url =
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE}` +
        `?filterByFormula=${formula}` +
        `&sort%5B0%5D%5Bfield%5D=PublishedDate` +
        `&sort%5B0%5D%5Bdirection%5D=desc`

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${TOKEN}` },
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`Airtable error: ${res.status}`)

        const data = await res.json()
        const parsed = (data.records || []).map((r) => ({
          id: r.id,
          title: r.fields.Title || '',
          slug: r.fields.Slug || '',
          excerpt: r.fields.Excerpt || '',
          content: r.fields.Content || '',
          inlineImage1: r.fields.InlineImage1 || '',
          inlineImage1Caption: r.fields.InlineImage1Caption || '',
          content2: r.fields.Content2 || '',
          inlineImage2: r.fields.InlineImage2 || '',
          inlineImage2Caption: r.fields.InlineImage2Caption || '',
          content3: r.fields.Content3 || '',
          inlineImage3: r.fields.InlineImage3 || '',
          inlineImage3Caption: r.fields.InlineImage3Caption || '',
          content4: r.fields.Content4 || '',
          inlineImage4: r.fields.InlineImage4 || '',
          inlineImage4Caption: r.fields.InlineImage4Caption || '',
          content5: r.fields.Content5 || '',
          heroImage: r.fields.HeroImage || '',
          category: r.fields.Category || '',
          publishedDate: r.fields.PublishedDate || '',
          relatedTourSlug: r.fields.RelatedTourSlug || '',
          relatedPackageSlug: r.fields.RelatedPackageSlug || '',
          inlineCardSlug: r.fields.InlineCardSlug || '',
          inlineCardType: r.fields.InlineCardType || 'tour',
        }))

        cache = parsed
        setPosts(parsed)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('useBlog: failed to fetch', err)
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
    return () => controller.abort()
  }, [])

  return { posts, loading, error }
}
