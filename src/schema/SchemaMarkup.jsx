// SchemaMarkup.jsx
// Schema.org structured data for Tallest Tourguide.
// Tells Google exactly what type of business this is,
// what each tour offers, and how to display it in search.
//
// Three components used across the site:
//   LocalBusinessSchema  → App.jsx (once, site-wide)
//   TourActivitySchema   → TourDetail.jsx (per tour)
//   BreadcrumbSchema     → TourDetail.jsx (per tour)
//   FAQSchema            → TourDetail.jsx (per tour, auto-skips if no faqs)
//
// All use react-helmet-async (already installed in your project).

import { Helmet } from 'react-helmet-async'

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
    url: 'https://tallesttourguide.com',
    logo: 'https://tallesttourguide.com/logo.svg',
    image: 'https://tallesttourguide.com/og-image.jpg',
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
    url: `https://tallesttourguide.com/tours/${tour.slug}`,
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
      url: `https://tallesttourguide.com/tours/${tour.slug}`,
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Tallest Tourguide',
      url: 'https://tallesttourguide.com',
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

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

// ----------------------------------------------------------
// 3. BREADCRUMB SCHEMA
//    Adds the breadcrumb trail in Google search results:
//    tallesttourguide.com > Tours > Sarajevo Grand Walking Tour
//    Used in TourDetail.jsx — one per tour page.
//
//    Props: tour — the full tour object from tours.js
// ----------------------------------------------------------
export function BreadcrumbSchema({ tour }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tallesttourguide.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tours',
        item: 'https://tallesttourguide.com/tours',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tour.title,
        item: `https://tallesttourguide.com/tours/${tour.slug}`,
      },
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