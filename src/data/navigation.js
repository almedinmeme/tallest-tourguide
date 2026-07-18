// Precomputed data for the header navigation: the place-led mega-menu rail
// (Bosnian cities with day tours, then the wider Balkan destinations) and the
// Journeys menu links. Everything derives from the JSON collections so the
// menus always match /tours, /packages and /destinations.

import tours from './tours'
import packages from './packages'
import { sortedDestinations } from './destinations'

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

const toursForCities = (cities) =>
  tours.filter((t) => cities.includes(t.city)).map(tourLink)

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

const BIH_SLUG = 'bosnia-and-herzegovina'
const bih = sortedDestinations.find((d) => d.slug === BIH_SLUG)
const bihFeaturedImage = (name) =>
  (bih?.featured || []).find((f) => (f.name || '').trim() === name)?.image || null

function cityPlace({ id, label, cities, blurb, image }) {
  const dayTours = toursForCities(cities)
  const journeys = journeysThroughCities(cities)
  return {
    id,
    label,
    blurb,
    href: cities.length === 1 ? `/tours?city=${encodeURIComponent(cities[0])}` : '/tours',
    exploreHref: `/destinations/${BIH_SLUG}`,
    exploreLabel: 'Explore Bosnia & Herzegovina',
    image: image || dayTours[0]?.hero || bih?.hero || null,
    dayTours,
    journeys,
  }
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
    dayTours: tours.filter((t) => (dest.relatedTours || []).includes(t.slug)).map(tourLink),
    journeys,
  }
}

export const NAV_RAIL = [
  {
    group: 'Bosnia & Herzegovina',
    items: [
      cityPlace({ id: 'sarajevo', label: 'Sarajevo', cities: ['Sarajevo'], blurb: 'The capital — where our day tours run', image: bihFeaturedImage('Sarajevo') }),
      cityPlace({ id: 'mostar', label: 'Mostar', cities: ['Mostar'], blurb: 'Old Bridge & Herzegovina', image: bihFeaturedImage('Mostar') }),
      cityPlace({ id: 'srebrenica', label: 'Srebrenica', cities: ['Srebrenica'], blurb: 'Memorial & history' }),
      cityPlace({ id: 'highlands', label: 'Lukomir & Jajce', cities: ['Lukomir', 'Jajce'], blurb: 'Highland villages & waterfalls' }),
    ],
  },
  {
    group: 'Across the Balkans',
    items: sortedDestinations.filter((d) => d.slug !== BIH_SLUG).map(countryPlace),
  },
]

export const NAV_PLACES = NAV_RAIL.flatMap((g) => g.items)
export const DEFAULT_PLACE_ID = 'sarajevo'

// Flat package links for the Journeys dropdown.
export const journeyNavLinks = packages.map((p) => ({
  id: p.slug,
  label: cleanPackageLabel(p),
  meta: journeyMeta(p),
  price: journeyPrice(p),
  href: `/multi-day-tours/${p.slug}`,
}))

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
      { id: 'contact', label: 'Contact', description: 'Email, WhatsApp, or the form', href: '/contact' },
    ],
  },
]

// Flat list kept for active-state checks and the mobile sheet.
export const discoverLinks = discoverGroups.flatMap((g) => g.items)
