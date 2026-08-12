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
import { TOUR_FREE_CANCEL_HOURS, PACKAGE_FULL_REFUND_DAYS } from '../data/policy'

// Google asks every Offer for a hasMerchantReturnPolicy, and reports its
// absence as "Missing field hasMerchantReturnPolicy (in offers)". The
// vocabulary was written for returning goods, but the customer-facing meaning
// — you can get all your money back, at no cost, within this window — is
// exactly our cancellation policy, so it maps honestly enough to state.
//
// `days` is the closest schema.org gets: it means days from purchase, while
// ours run backwards from the tour date, so we quote the shorter, safer
// number rather than a window we might not honour. returnMethod is left out
// on purpose — its only values are ReturnByMail, ReturnInStore and
// ReturnAtKiosk, and a cancelled booking is none of them. It is a recommended
// field, not a required one.
//
// Numbers come from data/policy.js, the same module the visible cancellation
// copy reads, so the markup can't promise something the page doesn't.
function returnPolicy(days) {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'BA',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: days,
    returnFees: 'https://schema.org/FreeReturn',
  }
}

// 24 hours before the tour — expressed in whole days, which is what
// merchantReturnDays takes.
const TOUR_RETURN_POLICY = returnPolicy(Math.ceil(TOUR_FREE_CANCEL_HOURS / 24))
const PACKAGE_RETURN_POLICY = returnPolicy(PACKAGE_FULL_REFUND_DAYS)

// Google only grants a review snippet when the structured data matches what a
// visitor can actually read on the page. This reads the same source
// TourReviews.jsx renders from, so the two can't drift.
//
// The reviews pinned to this tour or journey in /admin → Reviews, shaped for
// schema.org. Same explicit tourSlug link the visible section uses — never a
// name match. TourReviews.jsx renders from this on both detail pages
// (PackageDetail passes the package slug through the same prop), so anything
// this returns is on the page for the visitor to read.
function reviewsFor(slug) {
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
  const reviews = reviewsFor(tour.slug)

  // One offer object for both nodes below — they described the same booking in
  // two places and had to be kept in step by hand.
  const offers = {
    '@type': 'Offer',
    price: tour.price,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: siteUrl(`/tours/${tour.slug}`),
    hasMerchantReturnPolicy: TOUR_RETURN_POLICY,
  }

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
    offers,
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
    // NO aggregateRating / review here, deliberately. Google's review snippet
    // only accepts a handful of parent types (Product, LocalBusiness,
    // Organization, Event, Recipe, Course, Book, Movie, SoftwareApplication…)
    // and TouristAttraction is not one of them: a rating hung off this node is
    // reported as "Invalid object type for field <parent_node>", a critical
    // error in the Review snippets report. The rating belongs on the Product
    // node below, which is the node that earns the rich result anyway.
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
    offers,
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
    hasMerchantReturnPolicy: PACKAGE_RETURN_POLICY,
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

  // PackageDetail renders <TourReviews tourSlug={pkg.slug} />, so a review
  // pinned to a journey is on the page exactly like a tour's — it just wasn't
  // being marked up, which is a "Missing field review" warning on every
  // journey that has one.
  const reviews = reviewsFor(pkg.slug)

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
    review: reviews.length ? reviews : undefined,
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
