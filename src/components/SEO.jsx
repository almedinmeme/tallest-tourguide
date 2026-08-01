// SEO.jsx
// Reusable component that sets page-specific meta tags.
// Drop this at the top of any page component and pass
// the relevant props — title, description, image, url.
//
// Every page gets its own title and description which is
// the single most impactful SEO change you can make.
// Google uses the title and description in search results.
// Open Graph tags control previews on social and messaging apps.

import { Helmet } from 'react-helmet-async'
import { siteUrl, SITE_ORIGIN } from '../utils/seo'

function SEO({
  title,
  description,
  image = `${SITE_ORIGIN}/og-image.jpg`,
  url,
  type = 'website',
  publishedDate,
  // Preload the page's LCP image — { href, srcSet, sizes }. href is a
  // concrete fallback URL (a <link> can't take a bare srcset); srcSet/sizes
  // let the browser pick the right responsive variant, same as the actual
  // <img> will. Only pages with an eager hero image (Home today) pass this.
  preloadImage,
}) {
  const fullTitle = title
    ? `${title} | Tallest Tourguide Sarajevo`
    : 'Tallest Tourguide — Local Tours in Sarajevo, Bosnia'

  // Trailing-slash form — matches the URL Netlify actually serves
  // (directory prerender output), so the canonical never points at a 301.
  const fullUrl = siteUrl(url || '/')

  // og:image must be an absolute URL — social scrapers ignore relative
  // paths, so site-relative uploads (/uploads/...) get the origin prefixed.
  const fullImage = image.startsWith('/') ? `${SITE_ORIGIN}${image}` : image

  return (
    <Helmet>
      {/* Primary meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={preloadImage.href}
          fetchpriority="high"
          {...(preloadImage.srcSet
            ? { imagesrcset: preloadImage.srcSet, imagesizes: preloadImage.sizes || '100vw' }
            : {})}
        />
      )}

      {/* Open Graph — controls social and messaging previews */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Tallest Tourguide" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Geographic meta — helps with local search */}
      <meta name="geo.region" content="BA" />
      <meta name="geo.placename" content="Sarajevo" />

      {/* Article-specific meta */}
      {type === 'article' && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {type === 'article' && (
        <meta property="article:author" content="Almedin Omerović" />
      )}
    </Helmet>
  )
}

export default SEO