// Thin fetch wrappers around /api/admin endpoints exposed by admin-server.
// All methods throw on non-2xx so caller can use try/catch.

const BASE = '/api/admin'

async function jsonFetch(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ''}`)
  }
  if (res.status === 204) return null
  return res.json()
}

function makeCollection(name) {
  return {
    list: () => jsonFetch(`${BASE}/${name}`),
    get: (id) => jsonFetch(`${BASE}/${name}/${id}`),
    create: (body) => jsonFetch(`${BASE}/${name}`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) =>
      jsonFetch(`${BASE}/${name}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => jsonFetch(`${BASE}/${name}/${id}`, { method: 'DELETE' }),
  }
}

export const tours = makeCollection('tours')
export const packages = makeCollection('packages')
export const destinations = makeCollection('destinations')
export const accommodations = makeCollection('accommodations')
export const pages = makeCollection('pages')

export async function uploadImage(file, slug) {
  const fd = new FormData()
  fd.append('file', file)
  if (slug) fd.append('slug', slug)
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: fd })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`upload failed: ${res.status}${text ? ` ${text}` : ''}`)
  }
  return res.json()
}

export async function renameImage(from, to) {
  const res = await fetch(`${BASE}/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || `rename failed: ${res.status}`)
  }
  return data
}
