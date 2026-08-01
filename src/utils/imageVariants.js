// imageVariants.js
// Naming/URL logic for the responsive image variants scripts/generate-image-
// variants.mjs writes into dist/uploads/ at build time (480/960/1600w). Lives
// separately from Img.jsx (rather than exported alongside the component) so
// that file can stay component-only for Fast Refresh, and so anything that
// needs a single concrete variant URL — e.g. a <link rel="preload"> href,
// which can't take a srcset — uses the same naming convention as the srcset
// itself instead of re-deriving it.

const VARIANT_WIDTHS = [480, 960, 1600]

export function isVariantEligible(src) {
  return Boolean(src?.startsWith('/uploads/') && src.endsWith('.webp'))
}

// ("/uploads/foo.webp", 960) → "/uploads/foo-960w.webp"
export function variantUrl(src, width) {
  return `${src.slice(0, -'.webp'.length)}-${width}w.webp`
}

export function variantSrcset(src) {
  if (!import.meta.env.PROD || !isVariantEligible(src)) return undefined
  return VARIANT_WIDTHS.map((w) => `${variantUrl(src, w)} ${w}w`).join(', ') + `, ${src} 2400w`
}
