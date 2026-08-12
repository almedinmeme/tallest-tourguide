// Precomputed data for the header navigation: the experience-led Day Tours
// mega-menu rail (mirrors the /tours category filters) and the Journeys
// mega-menu rail (all journeys, plus the destinations they run through).
// Everything derives from the JSON collections so the menus always match
// /tours, /multi-day-tours and /destinations.

// The slim build-time index, not the full collections: this module is pulled
// in by the always-mounted Navbar, so a static import of tours.json /
// packages.json here lands all 277KB of them in the eager chunk on every
// route. See scripts/vite-plugin-catalog-index.js for what the index carries.
import { tourIndex as tours, journeyIndex as packages } from 'virtual:catalog-index'
import { sortedDestinations } from './destinations'
import { TOUR_CATEGORY_LABELS, tourCategories } from './tourCategories'

// "4-Days Complete Sarajevo Experience: Let us show you our home" → "Complete Sarajevo Experience"
function cleanPackageLabel(p) {
  return (p.name || p.title || '').split(':')[0].replace(/^\d+[-\s]?Days?\s+/i, '').trim()
}

// priceWithout is the canonical "from" price; the legacy price field on some
// packages is stale (e.g. bosnia-deep-dive 759 vs 480).
function journeyPrice(p) {
  return p.priceWithout ?? p.price
}

// Meta strings are built at module load, so they can't know the visitor's
// currency — they carry no price. Links expose a raw EUR `price` instead and
// the rendering component formats it via useCurrency().
function journeyMeta(p) {
  return `${(p.duration || '').toLowerCase()}`
}

// Menus show only the part before the subtitle separator (":" or "|"),
// e.g. "Srebrenica Day Trip from Sarajevo | Genocide Memorial…" → first half.
const tourLink = (t) => ({
  slug: t.slug,
  title: t.title.split(/[:|]/)[0].trim(),
  href: `/tours/${t.slug}`,
  meta: `${t.duration}`,
  price: t.price,
  hero: t.hero,
})

const journeyLink = (p) => ({
  slug: p.slug,
  title: cleanPackageLabel(p),
  href: `/multi-day-tours/${p.slug}`,
  meta: journeyMeta(p),
  price: journeyPrice(p),
  hero: p.heroImage,
})

// ---------------------------------------------------------------------------
// Day Tours rail — one row per experience category. Ids, labels and order come
// from tourCategories.js; multi-category membership comes from each tour's
// `extraCategories` (admin: Basics → "Also show in").

// Menu-only extras per category: a one-line blurb and a hand-picked photo
// (falls back to the first tour's hero).
const CATEGORY_META = {
  'day-trips':    { blurb: 'Full days out from Sarajevo — Mostar, Srebrenica, Jajce & more', image: '/uploads/mostar-day-trip-from-sarajevo-6qc2ulct.webp' },
  'city-walks':   { blurb: 'Sarajevo on foot, from Baščaršija to Austro-Hungarian avenues', image: '/uploads/tour-1-hero.webp' },
  'history':      { blurb: 'The siege, the war, and how Bosnia remembers', image: '/uploads/srebrenica-7.webp' },
  'food-culture': { blurb: 'Cooking classes and home-hosted dinners', image: '/uploads/cooking-4-class.webp' },
  'adventure':    { blurb: 'Highland villages, mountain trails and fresh air', image: '/uploads/lukomir-1.webp' },
}

function categoryPlace([id, label]) {
  const { blurb, image } = CATEGORY_META[id] || {}
  const dayTours = tours.filter((t) => tourCategories(t).includes(id)).map(tourLink)
  return {
    id,
    label,
    blurb,
    href: `/tours?category=${id}`,
    exploreHref: `/tours?category=${id}`,
    exploreLabel: `All ${label.toLowerCase()}`,
    image: image || dayTours[0]?.hero || null,
    dayTours,
    journeys: [],
  }
}

export const DAY_TOURS_RAIL = [
  { group: 'By experience', items: Object.entries(TOUR_CATEGORY_LABELS).map(categoryPlace) },
]
export const DAY_TOURS_DEFAULT_ID = 'day-trips'

// ---------------------------------------------------------------------------
// Journeys rail — start-here entries, then one row per destination.

// Package itinerary city strings are free-form ("Konjic & Jablanica",
// "Čapljina / Neum / Pelješac"), so match by substring.
const journeysThroughCities = (cities) =>
  packages
    .filter((p) =>
      (p.days || []).some((d) =>
        cities.some((c) => (d.city || '').toLowerCase().includes(c.toLowerCase()))
      )
    )
    .map(journeyLink)

function journeysForDestination(dest) {
  const related = packages.filter((p) => (dest.relatedPackages || []).includes(p.slug)).map(journeyLink)
  const featuredCities = (dest.featured || []).map((f) => (f.name || '').trim()).filter(Boolean)
  const through = journeysThroughCities(featuredCities)
  const seen = new Set(related.map((j) => j.slug))
  return [...related, ...through.filter((j) => !seen.has(j.slug))]
}

// Some destinations have no hero or featured images yet — fall back to the
// hero of a journey that passes through them.
function imageForDestination(dest, journeys) {
  return (
    dest.hero ||
    (dest.featured || []).find((f) => f.image)?.image ||
    journeys[0]?.hero ||
    null
  )
}

function countryPlace(dest) {
  const journeys = journeysForDestination(dest)
  return {
    id: dest.slug,
    label: dest.name,
    blurb: dest.teaser || '',
    href: `/destinations/${dest.slug}`,
    exploreHref: `/destinations/${dest.slug}`,
    exploreLabel: `Explore ${dest.name}`,
    image: imageForDestination(dest, journeys),
    dayTours: [],
    journeys,
  }
}

const allJourneys = packages.map(journeyLink)
const bih = sortedDestinations.find((d) => d.slug === 'bosnia-and-herzegovina')

export const JOURNEYS_RAIL = [
  {
    group: 'Start here',
    items: [
      {
        id: 'all-journeys',
        label: 'All Journeys',
        blurb: 'Multi-day trips across the Balkans, hosted end to end',
        journeysLabel: 'Multi-day journeys',
        href: '/multi-day-tours',
        exploreHref: '/multi-day-tours',
        exploreLabel: 'All journeys',
        image: allJourneys[0]?.hero || null,
        dayTours: [],
        journeys: allJourneys,
      },
      {
        id: 'personalised',
        label: 'Personalised Journey',
        icon: 'sparkles',
        blurb: 'A journey built entirely around you — route, pace and stays',
        href: '/personalised',
        exploreHref: '/personalised',
        exploreLabel: 'Plan a personalised journey',
        image: bih?.hero || null,
        dayTours: [],
        journeys: [],
        // Rendered as quiet rows in the middle column (no tour list to show).
        details: [
          'Tell us who is coming and what you love',
          'We design the route, stays and pace',
          'You get a full plan with a fixed price',
        ],
        cta: { label: 'Start the questionnaire', href: '/personalised' },
      },
    ],
  },
  {
    // Destinations with no journeys yet (currently Slovenia) stay out of the
    // rail until they have something to show.
    group: 'By destination',
    items: sortedDestinations.map(countryPlace).filter((p) => p.journeys.length > 0),
  },
]
export const JOURNEYS_DEFAULT_ID = 'all-journeys'

// Flat item list for a rail — used for active-item lookup in the mega menu
// and the mobile sheet.
export const railPlaces = (rail) => rail.flatMap((g) => g.items)

export const NAV_TRUST = '5.0 ★ rating · Genuinely small groups · Year-round'

// Package entries for the search dropdowns (desktop bar + mobile sheet).
export const searchPackageLinks = [
  ...packages.map((p) => ({ slug: p.slug, name: p.name || p.title, meta: journeyMeta(p), price: journeyPrice(p), href: `/multi-day-tours/${p.slug}` })),
  { slug: 'personalised', name: 'Personalised Tour Package', meta: 'Custom experience', href: '/personalised' },
]

// Brand & service pages under "Discover", split into two small groups so the
// menu reads as curated sections rather than one long catch-all list.
export const discoverGroups = [
  {
    label: 'Our world',
    items: [
      { id: 'our-story', label: 'Our Story', description: 'Why we travel year-round', href: '/about' },
      { id: 'hospitality', label: 'Gostoprimstvo', description: 'The Balkan art of hosting', href: '/hospitality' },
      { id: 'where-we-stay', label: 'Where We Stay', description: 'Our accommodation philosophy', href: '/where-we-stay' },
    ],
  },
  {
    label: 'Plan with us',
    items: [
      { id: 'signature', label: 'Signature Experiences', description: 'Private, expert-led journeys', href: '/signature' },
      { id: 'consult', label: 'Trip Consultation', description: '60-minute planning call', href: '/consult' },
      { id: 'partners', label: 'For Travel Professionals', description: 'Our DMC services', href: '/partners' },
    ],
  },
]

// Contact is pulled out of the groups and rendered as an emphasized CTA row
// at the bottom of the Discover dropdown (and as buttons in the footer and
// mobile sheet) — it was too easy to miss as a plain list item.
export const discoverContact = { id: 'contact', label: 'Contact Us', description: 'Email, WhatsApp, or the form — we reply within a day', href: '/contact' }

// Flat list kept for active-state checks and the mobile sheet.
export const discoverLinks = [...discoverGroups.flatMap((g) => g.items), discoverContact]
