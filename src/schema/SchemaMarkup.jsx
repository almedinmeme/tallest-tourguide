// SchemaMarkup.jsx
// Page-level schema.org structured data for Tallest Tourguide — the markup
// that describes one particular tour, package, FAQ set or article.
//
// Components:
//   TourActivitySchema   → TourDetail.jsx (TouristAttraction + Product/offers)
//   PackageSchema        → PackageDetail.jsx (TouristTrip + Product/offers)
//   FAQSchema            → TourDetail.jsx (per tour, auto-skips if no faqs)
//   BlogPostingSchema    → BlogPost.jsx (per post)
//
// The site-wide business/brand schema lives in SiteSchema.jsx, kept separate
// because App.jsx loads it on every route and this file pulls in the review
// text. Breadcrumb JSON-LD lives in src/components/Breadcrumbs.jsx, emitted
// together with the visible trail so the two can never disagree.
//
// Product + offers is what Google's price/review rich results actually
// consume — TouristAttraction/TouristTrip alone earn no rich result.
//
// All use react-helmet-async (already installed in your project).

import { Helmet } from 'react-helmet-async'
import { siteUrl, SITE_ORIGIN } from '../utils/seo'
import { publishedFeaturedReviews } from '../data/featuredReviews'
import { aggregateRating } from './aggregateRating'

// Google only grants a review snippet when the structured data matches what a
// visitor can actually read on the page. This reads the same source
// TourReviews.jsx renders from, so the two can't drift.
//
// The reviews pinned to this tour in /admin → Reviews, shaped for schema.org.
// Same explicit tourSlug link the visible section uses — never a name match.
function reviewsForTour(slug) {
  if (!slug) return []
  return publishedFeaturedReviews
    .filter((r) => r.tourSlug === slug && r.text && r.rating)
    .map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
        worstRating: '1',
      },
      author: { '@type': 'Person', name: r.name || 'Guest' },
      reviewBody: r.text,
      // `date` is 'YYYY-MM' in the data; schema.org wants a full date.
      ...(r.date ? { datePublished: /^\d{4}-\d{2}$/.test(r.date) ? `${r.date}-01` : r.date } : {}),
    }))
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
  const rating = aggregateRating(tour.rating, tour.reviews)
  const reviews = reviewsForTour(tour.slug)

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
    aggregateRating: rating,
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
    aggregateRating: rating,
    // The guest reviews actually rendered further down the page. This is
    // what earns the review snippet — an aggregateRating on its own no
    // longer does.
    review: reviews.length ? reviews : undefined,
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
  const url = siteUrl(`/multi-day-tours/${pkg.slug}`)
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
    aggregateRating: aggregateRating(pkg.rating, pkg.reviews),
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
