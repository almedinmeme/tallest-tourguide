// Img — site <img> wrapper for Core Web Vitals.
//
// - Emits srcset/sizes for /uploads/ images so phones stop downloading the
//   2400px originals. Variants (480/960/1600w) are generated into dist/ at
//   build time by scripts/generate-image-variants.mjs; srcset is emitted only
//   in production builds because the variants don't exist on the dev server.
//   Naming logic lives in ../utils/imageVariants.js, shared with anything
//   that needs a single concrete variant URL (e.g. a preload <link>).
// - Passes width/height through so the browser can reserve space (CLS).
// - `eager` marks LCP images (heroes): eager + high fetchpriority. Everything
//   else lazy-loads by default.

import { variantSrcset } from '../utils/imageVariants'

const DEFAULT_SIZES = '100vw'

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
