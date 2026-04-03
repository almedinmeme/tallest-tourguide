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

function SEO({
  title,
  description,
  image = 'https://tallesttourguide.com/og-image.jpg',
  url,
  type = 'website',
}) {
  const fullTitle = title
    ? `${title} | Tallest Tourguide Sarajevo`
    : 'Tallest Tourguide — Local Tours in Sarajevo, Bosnia'

  const fullUrl = url
    ? `https://tallesttourguide.com${url}`
    : 'https://tallesttourguide.com'

  return (
    <Helmet>
      {/* Primary meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph — controls social and messaging previews */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Tallest Tourguide" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geographic meta — helps with local search */}
      <meta name="geo.region" content="BA" />
      <meta name="geo.placename" content="Sarajevo" />
    </Helmet>
  )
}

export default SEO