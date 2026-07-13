// Slug for a duplicated item: "<slug>-copy", bumping a counter until it's
// unique among the existing slugs.
export function copySlug(slug, existingSlugs) {
  const taken = new Set(existingSlugs)
  let next = `${slug}-copy`
  let n = 2
  while (taken.has(next)) next = `${slug}-copy-${n++}`
  return next
}
