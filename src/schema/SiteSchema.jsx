// SiteSchema.jsx
// The two schemas that render once on every page, from App.jsx.
//
//   LocalBusinessSchema  → TravelAgency: the Sarajevo storefront, NAP,
//                          opening hours and the combined guest rating
//   OrganizationSchema   → Organization + WebSite: the brand entity
//
// Kept apart from SchemaMarkup.jsx deliberately. App.jsx loads this
// eagerly on every route, and SchemaMarkup.jsx imports featuredReviews.json
// for the per-tour review snippets — merging the two would put ~6 KB of
// review text in the main bundle for visitors who never reach a tour page.
//
// Page-level schemas (tour, package, FAQ, article) live in SchemaMarkup.jsx.

import { Helmet } from 'react-helmet-async'
import { CONTACT_EMAIL, INSTAGRAM_URL, TRIPADVISOR_URL } from '../data/settings'
import { siteUrl, SITE_ORIGIN } from '../utils/seo'
import { overallStats } from '../data/reviewStats'
import { aggregateRating } from './aggregateRating'

// ----------------------------------------------------------
// 1. LOCAL BUSINESS SCHEMA
//    Tells Google: this is a real local business in Sarajevo.
//    Adds your business to Google's knowledge graph.
//    Used in App.jsx — renders once on every page.
// ----------------------------------------------------------
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Tallest Tourguide',
    url: siteUrl('/'),
    logo: `${SITE_ORIGIN}/logo.svg`,
    image: `${SITE_ORIGIN}/og-image.jpg`,
    description:
      'Small group guided tours in Sarajevo and Bosnia. War history, food experiences, Mostar day trips. Local guide with 14 years experience. Genuinely small groups.',
    telephone: '+38762664244',
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hamdije Kreševljakovića 61',
      addressLocality: 'Sarajevo',
      addressRegion: 'Federation of Bosnia and Herzegovina',
      postalCode: '71000',
      addressCountry: 'BA',
    },
    hasMap:
      'https://www.google.com/maps/place/Tallest+Tourguide+%26+Friends/@43.8568344,18.4235815,17z',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.8563,
      longitude: 18.4131,
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      TRIPADVISOR_URL,
      INSTAGRAM_URL,
    ],
    // The combined Google + Tripadvisor score, the same figure the reviews
    // section prints. Weighted by each platform's review count in
    // reviewFeed.js, so it stays honest rather than averaging the averages.
    aggregateRating: aggregateRating(overallStats.rating, overallStats.count),
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

// ----------------------------------------------------------
// 3. ORGANIZATION + WEBSITE SCHEMA
//    The brand-level entity (who publishes this site) and the
//    site itself. Complements LocalBusinessSchema: LocalBusiness
//    covers the Sarajevo storefront, Organization covers the
//    brand Google shows in knowledge panels and news results.
//    Used in App.jsx — renders once on every page.
// ----------------------------------------------------------
export function OrganizationSchema() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'Tallest Tourguide',
    url: siteUrl('/'),
    logo: `${SITE_ORIGIN}/logo.svg`,
    email: CONTACT_EMAIL,
    telephone: '+38762664244',
    sameAs: [
      TRIPADVISOR_URL,
      INSTAGRAM_URL,
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tallest Tourguide',
    url: siteUrl('/'),
    inLanguage: 'en',
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organization)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(website)}
      </script>
    </Helmet>
  )
}

