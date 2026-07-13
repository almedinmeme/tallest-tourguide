// Loads tour/package/journal options for relation pickers. Module-level
// promise cache: several pickers on one editor page trigger one fetch per
// collection.
import { useEffect, useState } from 'react'
import * as api from '../api'

const COLLECTIONS = {
  tour: { api: api.tours, publicPath: '/tours' },
  package: { api: api.packages, publicPath: '/packages' },
  journal: { api: api.journal, publicPath: '/journal' },
}

const cache = new Map() // kind -> Promise<option[]>

function toOptions(items) {
  return items
    .filter((item) => item.slug)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      label: (item.title ?? item.name ?? item.slug) + (item.published === false ? ' (draft)' : ''),
      image: item.hero ?? item.heroImage ?? item.image ?? null,
    }))
}

export function loadCollectionOptions(kind) {
  if (!cache.has(kind)) {
    const entry = COLLECTIONS[kind]
    if (!entry) return Promise.reject(new Error(`unknown collection kind: ${kind}`))
    const promise = entry.api.list().then(toOptions)
    promise.catch(() => cache.delete(kind)) // don't cache failures
    cache.set(kind, promise)
  }
  return cache.get(kind)
}

// Call after saving a tour/package so open pickers refetch fresh titles.
export function invalidateOptionsCache(kind) {
  if (kind) cache.delete(kind)
  else cache.clear()
}

export function useCollectionOptions(kind) {
  // State is tagged with the kind it was loaded for, so a kind switch simply
  // ignores stale data instead of resetting state synchronously in the effect.
  const [state, setState] = useState({ kind: null, options: null, error: null })

  useEffect(() => {
    let alive = true
    loadCollectionOptions(kind)
      .then((opts) => alive && setState({ kind, options: opts, error: null }))
      .catch((e) => alive && setState({ kind, options: null, error: e.message }))
    return () => {
      alive = false
    }
  }, [kind])

  const options = state.kind === kind ? state.options : null
  const error = state.kind === kind ? state.error : null
  return { options: options || [], loading: options == null && !error, error }
}
