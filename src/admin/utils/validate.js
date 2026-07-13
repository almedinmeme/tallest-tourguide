// Shared validation helpers for the admin editors.

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'dj') // đ doesn't decompose via NFKD
    .replace(/Đ/g, 'dj')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isValidSlug(str) {
  return SLUG_RE.test(String(str || ''))
}

// Empty input means "not set" — null, never a silent 0.
export function toNumberOrNull(v) {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// Returns { [field]: message } — empty object when valid.
// siblings: [{ id, slug, title?, name? }] for uniqueness checks.
export function validateItem(item, { titleField = 'title', titleLabel, siblings = [] } = {}) {
  const errors = {}
  const label = titleLabel || (titleField === 'name' ? 'Name' : 'Title')

  if (!String(item?.[titleField] || '').trim()) {
    errors[titleField] = `${label} is required.`
  }

  const slug = String(item?.slug || '').trim()
  if (!slug) {
    errors.slug = 'Slug is required.'
  } else if (!isValidSlug(slug)) {
    errors.slug = 'Use lowercase letters, numbers and hyphens only (e.g. sarajevo-walking-tour).'
  } else {
    const clash = siblings.find(
      (s) => s.slug === slug && String(s.id) !== String(item?.id ?? ''),
    )
    if (clash) {
      errors.slug = `Already used by “${clash.title || clash.name || clash.slug}”.`
    }
  }

  return errors
}
