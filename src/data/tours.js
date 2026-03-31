// src/data/tours.js
// This is the single source of truth for all tour data in your app.
// By centralising it here, you stop maintaining the same data
// in two separate files (Tours.jsx and TourDetail.jsx) —
// a problem we flagged earlier and are now fixing properly.
//
// Each tour imports its hero image directly. Vite handles the rest —
// optimising, hashing, and serving the files correctly in both
// development and production.
//
// When you add a new tour, you add one object here and the change
// flows through automatically to every page that uses this data.
import tourDetail1 from '../assets/tour-detail-1-hero.webp'
import tourDetail2 from '../assets/tour-detail-2-hero.webp'
import tourDetail3 from '../assets/tour-detail-3-hero.webp'
import tourDetail4 from '../assets/tour-detail-4-hero.webp'
import tourDetail5 from '../assets/tour-detail-5-hero.webp'
import tourDetail6 from '../assets/tour-detail-6-hero.webp'

import tour1 from '../assets/tour-1-hero.webp'
import tour2 from '../assets/tour-2-hero.webp'
import tour3 from '../assets/tour-3-hero.webp'
import tour4 from '../assets/tour-4-hero.webp'
import tour5 from '../assets/tour-5-hero.webp'
import tour6 from '../assets/tour-6-hero.webp'

const tours = [
  {
    id: 1,
    title: 'Sarajevo War & Peace Tour',
    detailHero: tourDetail1,
    price: 29,
    rating: 4.9,
    reviews: 212,
    duration: '3 hours',
    groupSize: 8,
    badge: 'Bestseller',
    hero: tour1,       // The imported image is now just a variable
    description: 'Walk through the streets that witnessed the longest siege of a capital city in modern warfare. Your guide lived through it. This is not a history lesson — it is a personal story.',
    highlights: [
  'Highlight one — description of what visitors see.',
  'Highlight two — description.',
  'Highlight three — description.',
],
excludes: [
  'Food and drinks',
  'Gratuities',
  'Personal expenses',
],
    includes: [
      'Local guide',
      'Small group max 8',
      'Walking tour',
      'Free cancellation 24h',
    ],
    meetingPoint: 'Latin Bridge, Obala Kulina bana, Sarajevo',
  },
  {
    id: 2,
    title: 'Mostar & Old Bridge Day Trip',
    detailHero: tourDetail2,
    price: 49,
    rating: 4.8,
    reviews: 98,
    duration: '8 hours',
    groupSize: 6,
    badge: 'Popular',
    hero: tour2,
    description: 'A full day trip to one of the most beautiful towns in the Balkans. Cross the iconic Stari Most, explore the old bazaar, and eat the best ćevapi of your trip.',
    highlights: [
  'Highlight one — description of what visitors see.',
  'Highlight two — description.',
  'Highlight three — description.',
],
excludes: [
  'Food and drinks',
  'Gratuities',
  'Personal expenses',
],
    includes: [
      'Transport from Sarajevo',
      'Local guide',
      'Lunch',
      'Free cancellation 48h',
    ],
    meetingPoint: 'Hotel Europe, Sarajevo city centre',
  },
  {
  id: 3,
  title: 'Sarajevo Walking Tour: Old Town & The Sarajevo Story',
  price: 22,
  rating: 5.0,
  reviews: 45,
  duration: '2 hours',
  groupSize: 8,
  badge: 'New',
  hero: tour3,
  detailHero: tourDetail3,
  description: 'Sarajevo is one of Europe\'s most layered cities — and most visitors have no idea what they\'re walking into. This two-hour tour is designed for curious travelers who want more than landmarks. You\'ll move through the Jewish Quarter, Orthodox and Catholic heritage, Ottoman bazaars, and Austro-Hungarian boulevards, often within a single city block. Nowhere else in Europe does that happen.\n\nStarting at the Latin Bridge — where a single moment in 1914 changed the world — you\'ll wind through Baščaršija\'s Coppersmith Street, step inside the Gazi Husrev-Bey Mosque complex and its covered Bezistan market, pass the grand City Hall and Hotel Europe, and end with a city that feels genuinely discovered, not just visited. Small group, local guide, no rushed stops.',
  highlights: [
    'Latin Bridge & Assassination Site — Stand where Archduke Franz Ferdinand was shot in 1914, the spark that ignited World War I.',
    'Baščaršija Old Bazaar — Sarajevo\'s beating heart since the 15th century. Cobblestones, coffee, and crafts still alive today.',
    'Coppersmith Street (Kazandžiluk) — Hammered copper souvenirs made by hand, a trade unchanged for over 500 years.',
    'Gazi Husrev-Bey Mosque — The finest Ottoman mosque in the Balkans, built in 1531 and still in daily use.',
    'Gazi Husrev-Bey Bezistan — A covered 16th-century market where silk and spice routes once crossed.',
    'Old Orthodox Church — One of the oldest in the region, quietly holding centuries of Sarajevo\'s Serbian heritage.',
    'Jewish Quarter — A rare testament to Sephardic history in the heart of the Balkans, layered with resilience.',
    'Sarajevo Cathedral — The largest cathedral in Bosnia, a graceful anchor of Catholic presence in the city.',
    'Hotel Europe — A grand Austro-Hungarian landmark that once hosted emperors and still commands the skyline.',
    'City Hall (Vijećnica) — A stunning neo-Moorish building, rebuilt after wartime destruction, now a symbol of recovery.',
  ],
  includes: [
    'Local guide',
    'Small group max 8',
    'Walking tour',
    'Free cancellation 24h',
  ],
  excludes: [
    'Food and drinks',
    'Entrance fees to religious sites',
    'Gratuities',
    'Personal expenses',
  ],
  faqs: [
    {
      question: 'Is this tour suitable for people who don\'t know much about Sarajevo\'s history?',
      answer: 'Absolutely. The tour is built around discovery — no prior knowledge needed. Your guide connects the dots between cultures, eras, and stories as you walk.',
    },
    {
      question: 'How much walking is involved? Is it suitable for all fitness levels?',
      answer: 'The route is mostly flat through the old town, covering roughly 2–3 km at a relaxed pace. Comfortable shoes are recommended; no steep terrain.',
    },
    {
      question: 'Are entrance fees to mosques or other sites included?',
      answer: 'The tour includes access to outdoor areas and select interiors. Some religious sites may request a small voluntary donation — your guide will let you know in advance.',
    },
  ],
  meetingPoint: 'Latin Bridge, Obala Kulina bana, Sarajevo',
},
  {
    id: 4,
    title: 'Jewish Heritage of Sarajevo',
    detailHero: tourDetail4,
    price: 25,
    rating: 4.9,
    reviews: 67,
    duration: '2 hours',
    groupSize: 8,
    badge: null,
    hero: tour4,
    description: 'Sarajevo is one of the few European cities where a synagogue, mosque, Catholic and Orthodox church all stand within the same city block. This tour explains why.',
   highlights: [
  'Highlight one — description of what visitors see.',
  'Highlight two — description.',
  'Highlight three — description.',
],
excludes: [
  'Food and drinks',
  'Gratuities',
  'Personal expenses',
],
    includes: [
      'Guide',
      'Museum entry fees',
      'Small group max 8',
      'Free cancellation 24h',
    ],
    meetingPoint: 'Sebilj Fountain, Baščaršija, Sarajevo',
  },
  {
    id: 5,
    title: 'Sarajevo Food Tour',
    detailHero: tourDetail5,
    price: 35,
    rating: 4.9,
    reviews: 89,
    duration: '3 hours',
    groupSize: 6,
    badge: 'Popular',
    hero: tour5,
    description: 'Bosnian food is one of the great undiscovered cuisines of Europe. Six stops, twelve tastings, and one very satisfied stomach.',
    highlights: [
  'Highlight one — description of what visitors see.',
  'Highlight two — description.',
  'Highlight three — description.',
],
excludes: [
  'Food and drinks',
  'Gratuities',
  'Personal expenses',
],
    includes: [
      'All food tastings',
      'Guide',
      'Small group max 6',
      'Free cancellation 24h',
    ],
    meetingPoint: 'Sebilj Fountain, Baščaršija, Sarajevo',
  },
  {
    id: 6,
    title: 'Yellow Fortress Sunset Walk',
    detailHero: tourDetail6,
    id: 6,
    title: 'Yellow Fortress Sunset Walk',
    price: 18,
    rating: 4.8,
    reviews: 134,
    duration: '1.5 hours',
    groupSize: 10,
    badge: null,
    hero: tour6,
    description: 'The best view of Sarajevo costs nothing — except knowing where to go. End your day watching the city light up from the fortress that has overlooked it for centuries.',
    highlights: [
  'Highlight one — description of what visitors see.',
  'Highlight two — description.',
  'Highlight three — description.',
],
excludes: [
  'Food and drinks',
  'Gratuities',
  'Personal expenses',
],
    includes: [
      'Guide',
      'Small group max 10',
      'Free cancellation 24h',
    ],
    meetingPoint: 'Sebilj Fountain, Baščaršija, Sarajevo',
  },
]

export default tours