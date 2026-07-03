// SchemaMarkup.jsx
// Schema.org structured data for Tallest Tourguide.
// Tells Google exactly what type of business this is,
// what each tour offers, and how to display it in search.
//
// Components used across the site:
//   LocalBusinessSchema  → App.jsx (once, site-wide)
//   TourActivitySchema   → TourDetail.jsx (TouristAttraction + Product/offers)
//   PackageSchema        → PackageDetail.jsx (TouristTrip + Product/offers)
//   FAQSchema            → TourDetail.jsx (per tour, auto-skips if no faqs)
//   BlogPostingSchema    → BlogPost.jsx (per post)
//
// Product + offers is what Google's price/review rich results actually
// consume — TouristAttraction/TouristTrip alone earn no rich result.
// Breadcrumb JSON-LD lives in src/components/Breadcrumbs.jsx, emitted
// together with the visible trail so the two can never disagree.
//
// All use react-helmet-async (already installed in your project).

import { Helmet } from 'react-helmet-async'
import { siteUrl, SITE_ORIGIN } from '../utils/seo'

// ----------------------------------------------------------
// 1. LOCAL BUSINESS SCHEMA
//    Tells Google: this is a real local business in Sarajevo.
//    Adds your business to Google's knowledge graph.
//    Used in App.jsx — renders once on every page.
// ----------------------------------------------------------
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristInformationCenter',
    name: 'Tallest Tourguide',
    url: siteUrl('/'),
    logo: `${SITE_ORIGIN}/logo.svg`,
    image: `${SITE_ORIGIN}/og-image.jpg`,
    description:
      'Small group guided tours in Sarajevo and Bosnia. War history, food experiences, Mostar day trips. Local guide with 14 years experience. Max 12 guests.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sarajevo',
      addressRegion: 'Federation of Bosnia and Herzegovina',
      addressCountry: 'BA',
    },
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
      'https://www.tripadvisor.com/Attraction_Review-g294450-d14011605-Reviews-Tallest_Tourguide_Tours_and_Excursions-Sarajevo_Sarajevo_Canton_Federation_of_Bo.html',
    ],
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
// 2. TOUR ACTIVITY SCHEMA
//    Tells Google: this URL is a bookable tour.
//    Enables rich results (price, rating, duration) in search.
//    Used in TourDetail.jsx — one per tour page.
//
//    Props: tour — the full tour object from tours.js
// ----------------------------------------------------------
export function TourActivitySchema({ tour }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: tour.title,
    description: tour.description.slice(0, 300),
    url: siteUrl(`/tours/${tour.slug}`),
    touristType: [
      'History Enthusiast',
      'Culture Seeker',
      'Independent Traveler',
    ],
    availableLanguage: (tour.languages || ['english']).map((lang) => ({
      '@type': 'Language',
      name: lang.charAt(0).toUpperCase() + lang.slice(1),
    })),
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: siteUrl(`/tours/${tour.slug}`),
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Tallest Tourguide',
      url: siteUrl('/'),
    },
    location: {
      '@type': 'Place',
      name: tour.meetingPoint || 'Sarajevo, Bosnia and Herzegovina',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sarajevo',
        addressCountry: 'BA',
      },
    },
    maximumAttendeeCapacity: tour.groupSize || 12,
    aggregateRating: tour.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: tour.rating,
          reviewCount: tour.reviews,
          bestRating: '5',
        }
      : undefined,
  }

  // Product + offers earns the price/rating rich result in search;
  // TouristAttraction alone does not.
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.title,
    description: tour.description.slice(0, 300),
    image: [tour.hero, ...(tour.gallery || []).map((g) => g.src || g)].filter(Boolean).slice(0, 5),
    url: siteUrl(`/tours/${tour.slug}`),
    sku: tour.slug,
    brand: { '@type': 'Brand', name: 'Tallest Tourguide' },
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: siteUrl(`/tours/${tour.slug}`),
    },
    aggregateRating: tour.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: tour.rating,
          reviewCount: tour.reviews,
          bestRating: '5',
        }
      : undefined,
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(product)}
      </script>
    </Helmet>
  )
}

// ----------------------------------------------------------
// 4. FAQ SCHEMA
//    Turns your existing tour.faqs array (already in tours.js)
//    into expandable FAQ dropdowns in Google search results.
//    Auto-skips if the tour has no faqs — safe to add everywhere.
//
//    Props: tour — the full tour object from tours.js
// ----------------------------------------------------------
export function FAQSchema({ tour }) {
  if (!tour.faqs || tour.faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tour.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
// 5. PACKAGE SCHEMA
//    TouristTrip (the schema.org type for multi-day tours, with the
//    day-by-day itinerary) + Product (what earns the price/rating
//    rich result). Used in PackageDetail.jsx — one per package page.
// ----------------------------------------------------------
export function PackageSchema({ pkg }) {
  const url = siteUrl(`/packages/${pkg.slug}`)
  const price = pkg.price ?? pkg.priceWithout
  const description = pkg.description || 'A multi-day guided tour package in Bosnia and Herzegovina.'

  const offers = {
    '@type': 'Offer',
    price,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url,
  }

  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: `${pkg.name} — ${pkg.subtitle}`,
    description,
    url,
    touristType: ['History Enthusiast', 'Culture Seeker', 'Independent Traveler'],
    itinerary: pkg.days?.length
      ? {
          '@type': 'ItemList',
          numberOfItems: pkg.days.length,
          itemListElement: pkg.days.map((day, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `Day ${i + 1}: ${day.title}`,
            ...(day.summary ? { description: day.summary } : {}),
          })),
        }
      : undefined,
    offers,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Tallest Tourguide',
      url: siteUrl('/'),
    },
    maximumAttendeeCapacity: pkg.groupSize || 8,
  }

  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${pkg.name} — ${pkg.subtitle}`,
    description,
    image: [pkg.heroImage || pkg.hero].filter(Boolean),
    url,
    sku: pkg.slug,
    brand: { '@type': 'Brand', name: 'Tallest Tourguide' },
    offers,
    aggregateRating: pkg.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: pkg.rating,
          reviewCount: pkg.reviews,
          bestRating: '5',
        }
      : undefined,
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(trip)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(product)}
      </script>
    </Helmet>
  )
}

// ----------------------------------------------------------
// 6. BLOG POSTING SCHEMA
//    Tells Google: this is a blog article with a known author
//    and publication date. Enables article rich snippets.
//    Used in BlogPost.jsx — one per blog post page.
//
//    Props: post — the parsed post object from useBlog
// ----------------------------------------------------------
export function BlogPostingSchema({ post }) {
  if (!post) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.heroImage || `${SITE_ORIGIN}/og-image.jpg`,
    datePublished: post.publishedDate,
    url: siteUrl(`/journal/${post.slug}`),
    author: {
      '@type': 'Person',
      name: 'Almedin Omerović',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tallest Tourguide',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/og-image.jpg`,
      },
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}
