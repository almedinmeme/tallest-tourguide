// Img — site <img> wrapper for Core Web Vitals.
//
// - Emits srcset/sizes for /uploads/ images so phones stop downloading the
//   2400px originals. Variants (480/960/1600w) are generated into dist/ at
//   build time by scripts/generate-image-variants.mjs; srcset is emitted only
//   in production builds because the variants don't exist on the dev server.
// - Passes width/height through so the browser can reserve space (CLS).
// - `eager` marks LCP images (heroes): eager + high fetchpriority. Everything
//   else lazy-loads by default.

const VARIANT_WIDTHS = [480, 960, 1600]
const DEFAULT_SIZES = '100vw'

function variantSrcset(src) {
  if (!import.meta.env.PROD) return undefined
  if (!src?.startsWith('/uploads/') || !src.endsWith('.webp')) return undefined
  const stem = src.slice(0, -'.webp'.length)
  return VARIANT_WIDTHS.map((w) => `${stem}-${w}w.webp ${w}w`).join(', ') + `, ${src} 2400w`
}

function Img({ src, alt = '', sizes = DEFAULT_SIZES, eager = false, width, height, style, ...rest }) {
  const srcSet = variantSrcset(src)
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding={eager ? 'sync' : 'async'}
      style={style}
      {...rest}
    />
  )
}

export default Img
