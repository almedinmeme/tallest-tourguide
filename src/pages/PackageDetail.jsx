import SEO from '../components/SEO'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import {
  ChevronDown, ChevronUp,
  CheckCircle, XCircle, MapPin, ShieldCheck,
  Calendar, Star, Sunset, History, Coffee,
  Utensils, Home, Footprints,
  Waves, Wine, Shield, Anchor, X,
  Compass, Clock, Users, AlertTriangle,
  BedDouble, Plus, Car,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import useWindowWidth from '../hooks/useWindowWidth'
import { useAvailability } from '../hooks/useAvailability'
import { usePackageDates } from '../hooks/usePackageDates'
import { useAllReviews } from '../hooks/useAllReviews'
import package1Hero from '../assets/package-1-hero.webp'
import package2Hero from '../assets/package-2-hero.webp'
import package3Hero from '../assets/package-3-hero.webp'
import package4Hero from '../assets/package-4-hero.webp'
import package5Hero from '../assets/package-5-hero.webp'
import package6Hero from '../assets/package-6-hero.webp'
import package7Hero from '../assets/package-7-hero.webp'
import Gallery from '../components/Gallery'
import TourReviews from '../components/TourReviews'
const RouteMap = lazy(() => import('../components/RouteMap'))
import { PackageSchema, PackageBreadcrumbSchema } from '../schema/SchemaMarkup'

function formatSelectedDate(dateStr) {
  if (!dateStr) return 'Select a date'
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDepartureDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}

const showMoreBtnStyle = {
  display: 'block',
  margin: '12px auto 0',
  height: '34px',
  padding: '0 18px',
  borderRadius: '100px',
  border: '1.5px solid var(--color-n300)',
  backgroundColor: 'transparent',
  color: 'var(--color-n600)',
  fontFamily: 'var(--font-body)',
  fontWeight: '600',
  fontSize: '13px',
  cursor: 'pointer',
}

const activityIconMap = {
  sunset: Sunset,
  history: History,
  war: Footprints,
  food: Utensils,
  coffee: Coffee,
  family: Home,
  waterfall: Waves,
  wine: Wine,
  bunker: Shield,
  rafting: Anchor,
}

const packages = [
  // ─── SARAJEVO ESSENTIAL ────────────────────────────────────────────────
  {
    id: 1,
    slug: 'sarajevo-essential',
    name: '3-Day Complete Sarajevo Experience: Let us show you our home',
    subtitle: 'Stories, Survival & Soul',
    duration: '3 Days',
    groupSize: 8,
    difficulty: 'Easy',
    priceWithout: 99,
    priceWith: 299,
    rating: 5,
    reviews: 1,
    heroImage: package1Hero,
    about: `Sarajevo is not a city you visit — it is a city that visits you. Over two carefully designed days, you will move through a place where Ottoman bazaars sit beside Austro-Hungarian boulevards, where the scent of Bosnian coffee drifts from doors that have been open for centuries, and where the weight of recent history is carried with remarkable lightness by the people who lived it.

This package is built for the traveller who wants to feel a city rather than photograph it. You will eat with a local family, walk the streets at golden hour, hear the siege explained by someone who remembers it, and leave with the kind of understanding that no guidebook can give you.

Two days. Three tours. One city that will stay with you.`,

    days: [
      {
        id: 1,
        title: 'First Contact',
        city: 'Sarajevo',
        summary: 'Arrival, welcome lunch with a local family, golden hour walk.',
        photo: '/photos/sarajevo-essential-day-1.jpg',
        accommodation: 'Hotel Hecco Deluxe, Baščaršija',
        meals: ['Lunch with local family'],
        includedActivities: ['Private airport transfer', 'Sarajevo Sunset Walking Tour', 'Welcome lunch with a local family'],
        optionalActivities: ['Old town evening walk — ask your guide'],
        morning: 'Arrival to Sarajevo with a private transfer directly to your accommodation. Time to settle in, freshen up, and orient yourself in the city at your own pace.',
        afternoon: 'Your first real introduction to Sarajevo — a welcome lunch or dinner hosted by a local family, followed by the Sarajevo Sunset Walking Tour. There is no better way to meet a city than during the golden hour, when the light turns the old town amber and the call to prayer echoes across the valley.',
        highlights: [
          'Home-hosted meal with a local family',
          'First cultural immersion into Bosnian hospitality',
          'Golden hour walking experience through the old town',
        ],
      },
      {
        id: 2,
        title: 'Feel the Energy, Learn the History, Enjoy the Food',
        city: 'Sarajevo',
        summary: 'Morning coffee ritual, walking tour, siege history, local lunch.',
        photo: '/photos/sarajevo-essential-day-2.jpg',
        accommodation: 'Hotel Hecco Deluxe, Baščaršija',
        meals: ['Breakfast at hotel', 'Lunch at local eatery'],
        includedActivities: ['Bosnian coffee ceremony', 'Between Empires Walking Tour', 'Siege of Sarajevo: Survival & Resistance Tour'],
        optionalActivities: ['Yellow Fortress sunset — 20 min walk from Baščaršija', 'Tunnel of Hope Museum — €10 supplement'],
        morning: 'The day begins the right way — with a Bosnian coffee ceremony. Not a quick espresso, but a ritual with its own rules, its own pace, and its own meaning. Then straight into the Between Empires Walking Tour and the Siege of Sarajevo: Survival and Resistance — two tours that together tell the complete story of this city, from its Ottoman foundation to the war that defined a generation.',
        afternoon: 'Lunch at a local favourite — a place your guide knows rather than a place that knows tourists. The afternoon is yours. Walk, explore, buy copper coffee sets in the bazaar, or simply sit and watch Sarajevo happen around you.',
        highlights: [
          'Bosnian coffee ritual — the correct way',
          'War history told through real personal stories',
          'Authentic local lunch in a neighbourhood eatery',
        ],
      },
      {
        id: 3,
        title: 'Ready to Say "See You Again"?',
        city: 'Sarajevo',
        summary: 'Flexible departure — optional activity based on your schedule.',
        photo: '/photos/sarajevo-essential-day-3.jpg',
        meals: ['Breakfast at hotel'],
        includedActivities: ['Private transfer to airport'],
        optionalActivities: ['Vrelo Bosne park walk — 30 min from city centre', 'Inat Kuća farewell coffee — on your own tab'],
        morning: 'This day belongs to your departure time. Whether you leave in the early morning or the late afternoon, your guide will work around your schedule. If time allows, there is always one more thing worth seeing. Just ask.',
        afternoon: 'Private transfer to the airport or onward destination.',
        highlights: [
          'Flexible schedule built around your departure',
          'Optional add-on activity on request',
          'Private transfer included',
        ],
        note: 'This day revolves around your departure time. Message your guide before arrival to discuss possible activities that fit your schedule.',
      },
    ],

    inclusions: [
      'Private transfer on arrival and departure',
      'Welcome lunch or dinner with a local family',
      'Sarajevo Sunset Walking Tour',
      'Between Empires: Sarajevo Walking Tour',
      'Siege of Sarajevo: Survival & Resistance Tour',
      'Bosnian coffee ceremony',
      'Small group — maximum 8 people',
      'Free cancellation up to 48 hours before',
    ],

    exclusions: [
      'Flights and international transport',
      'Accommodation',
      'Lunch in local eatery — pay as you go, eat like a local',
      'Gratuities — appreciated but never expected',
      'Personal expenses and souvenirs',
    ],

    breakdown: {
      accommodation: ['Hotel Hecco Deluxe, Baščaršija'],
      meals: ['3 meals included'],
      transport: ['Private transfers, arrival & departure'],
      destinations: ['Baščaršija', 'Austro-Hungarian Quarter', 'Latin Bridge'],
      activities: ['Sarajevo Sunset Walk', 'Between Empires Tour', 'Siege of Sarajevo Tour', 'Bosnian Coffee Ceremony'],
      optional: ['Tunnel of Hope — €10', 'Yellow Fortress walk', 'Vrelo Bosne park'],
    },

    activities: [
      {
        icon: 'sunset',
        name: 'Sarajevo Sunset Walking Tour',
        description: 'Meet Sarajevo during the golden hour when the city is at its most beautiful.',
      },
      {
        icon: 'history',
        name: 'Between Empires Walking Tour',
        description: 'Walk through centuries of Ottoman and Austro-Hungarian history in one district.',
      },
      {
        icon: 'war',
        name: 'Siege of Sarajevo Tour',
        description: 'The siege explained through real stories by someone who lived through it.',
      },
      {
        icon: 'food',
        name: 'Sarajevo Food Experience',
        description: 'Authentic local lunch in the kind of restaurant only locals know about.',
      },
      {
        icon: 'coffee',
        name: 'Bosnian Coffee Ceremony',
        description: 'Learn the ritual behind the most important daily tradition in Bosnia.',
      },
      {
        icon: 'family',
        name: 'Home-Hosted Meal',
        description: 'Eat with a local family — the warmest introduction to Bosnian hospitality.',
      },
    ],

    importantInfo: [
      {
        title: 'Things to Consider Before Booking',
        content: 'Free cancellation up to 48 hours before the start date. Cancellations within 48 hours are non-refundable. Send a booking request and you will hear back within 24 hours to confirm availability and arrange all details.',
      },
      {
        title: 'Accommodation',
        content: 'Accommodation is not included in this package. Your guide can recommend hotels in Sarajevo at different price points — just ask when you send your booking request.',
      },
      {
        title: 'What to Wear',
        content: 'Casual comfortable clothing. Avoid shorts and sleeveless shirts as some visits may include places of worship. Comfortable walking shoes are recommended for all days.',
      },
      {
        title: 'Joining Point',
        content: 'To be confirmed via message before your arrival. Your guide will coordinate directly with you and provide all meeting point details in advance.',
      },
      {
        title: 'Visas',
        content: 'Bosnia and Herzegovina is not a member of the European Union. Citizens of most EU, US, UK, and Australian passports do not require a visa for stays up to 90 days. Please check with your local embassy if you are unsure.',
      },
    ],

    dates: [
      { id: 1, date: 'April 12–14, 2026', spots: 6, total: 8 },
      { id: 2, date: 'April 19–21, 2026', spots: 2, total: 8 },
      { id: 3, date: 'May 3–5, 2026', spots: 8, total: 8 },
      { id: 4, date: 'May 10–12, 2026', spots: 5, total: 8 },
      { id: 5, date: 'May 24–26, 2026', spots: 8, total: 8 },
    ],
    mapWaypoints: [
      { lat: 43.8582, lng: 18.4313, label: 'Latin Bridge' },
      { lat: 43.8594, lng: 18.4324, label: 'Baščaršija' },
      { lat: 43.8589, lng: 18.4279, label: 'Gazi Husrev-beg Mosque' },
      { lat: 43.8597, lng: 18.4341, label: 'City Hall' },
      { lat: 43.8613, lng: 18.4272, label: 'Yellow Fortress' },
    ],
    mapProfile: 'foot-walking',
    fitnessNotes: [
      {
        type: 'emotional',
        level: 'Contains emotionally heavy history',
        detail: 'This package includes the Siege of Sarajevo tour, which covers wartime trauma, survival stories, and the human cost of the 1992–1995 siege. The content is handled with care, but it is emotionally demanding by nature. Guests who are sensitive to war and trauma-related content should consider this before booking.',
      },
    ],
    suitability: {
      goodFor: [
        'First-time visitors to Bosnia',
        'History and culture enthusiasts',
        'Travelers who want depth over breadth',
        'Small group fans — maximum 8 people',
        'Those curious about the Bosnian War and the Siege',
      ],
      thinkTwice: [
        'If emotionally heavy wartime content is difficult for you — the Siege tour is central to this package',
        'If two days feels too short to settle in a new city',
        'If you prefer resort-style or beach travel',
      ],
    },
  },
    // ─── BOSNIA DEEP DIVE ───────────────────────────────────────────────
  {
    id: 2,
    slug: 'bosnia-deep-dive',
    name: 'Bosnia Deep Dive',
    gallery: [package2Hero],
    subtitle: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    groupSize: 8,
    difficulty: 'Easy',
    priceWithout: 480,
    priceWith: 850,
    rating: 4.9,
    reviews: 31,
    heroImage: package2Hero,
    about: `Bosnia is not a small country — it is a layered one. Five days is the minimum time needed to begin understanding it properly. This itinerary moves through three distinct worlds: the Ottoman and Austro-Hungarian complexity of Sarajevo, the raw natural beauty of Herzegovina with its waterfalls and ancient villages, and the surreal Yugoslav legacy of a dictator who built a nuclear bunker in a mountain and thought it would save him.

You will swim in a waterfall, raft a river, taste wine in a medieval cellar, and sit in the bunker of a man who ruled 200 million people. You will eat with a local family on your first night and share a farewell dinner with the same guide on your last. What happens in between is Bosnia — complicated, generous, and impossible to forget.

Five days. Four cities. One country that will permanently change your frame of reference.`,

    days: [
      {
        id: 1,
        title: 'First Contact',
        city: 'Sarajevo',
        summary: 'Arrival, welcome lunch with a local family, golden hour walk.',
        photo: '/photos/bosnia-deep-dive-day-1.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Welcome dinner'],
        includedActivities: ['Private arrival transfer', 'Sarajevo Sunset Walking Tour', 'Welcome dinner with local family'],
        optionalActivities: ['Evening Baščaršija stroll'],
        morning: 'Arrival to Sarajevo with a private transfer directly to your accommodation. Time to settle in, freshen up, and get your bearings in a city that immediately feels unlike anywhere else.',
        afternoon: 'Your first real introduction to Sarajevo — a welcome lunch or dinner hosted by a local family, followed by the Sarajevo Sunset Walking Tour. There is no better way to meet a city than during the golden hour, when the light turns the old town amber and the call to prayer drifts across the valley.',
        highlights: [
          'Home-hosted meal with a local family',
          'First cultural immersion into Bosnian hospitality',
          'Golden hour walking experience through the old town',
        ],
      },
      {
        id: 2,
        title: 'Feel the Energy, Learn the History, Enjoy the Food',
        city: 'Sarajevo',
        summary: 'Morning coffee ritual, walking tour, siege history, local lunch.',
        photo: '/photos/bosnia-deep-dive-day-2.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Breakfast', 'Lunch'],
        includedActivities: ['Bosnian coffee ceremony', 'Between Empires Walking Tour', 'Siege of Sarajevo Tour', 'Local neighbourhood lunch'],
        optionalActivities: ['Tunnel of Hope Museum — €15', 'War Childhood Museum'],
        morning: 'The day begins the right way — with a Bosnian coffee ceremony. Then straight into the Between Empires Walking Tour and the Siege of Sarajevo: Survival and Resistance — two tours that together tell the complete story of this city, from its Ottoman foundation to the war that defined a generation.',
        afternoon: 'Lunch at a local favourite — a place your guide knows rather than a place that knows tourists. The afternoon is yours. Walk, explore, buy copper coffee sets in the bazaar, or simply sit and watch Sarajevo happen around you.',
        highlights: [
          'Bosnian coffee ritual — the correct way',
          'War history told through real personal stories',
          'Authentic local lunch in a neighbourhood eatery',
        ],
      },
      {
        id: 3,
        title: 'Real Herzegovina — Waterfalls, Wine and Ancient Villages',
        city: 'Mostar',
        summary: 'Kravice Waterfalls, Počitelj, wine cellars, Stolac, Blagaj, Mostar.',
        photo: '/photos/bosnia-deep-dive-day-3.jpg',
        accommodation: 'Hotel Bristol, Mostar',
        meals: ['Wine cellar lunch'],
        includedActivities: ['Kravice Waterfalls', 'Počitelj fortress village', 'Wine cellar tasting & lunch', 'Blagaj Tekke', 'Mostar orientation walk'],
        optionalActivities: ['Swimming at Kravice (seasonal)'],
        morning: 'Departure from Sarajevo into Herzegovina. The landscape changes within an hour — limestone karst, fig trees, the Mediterranean pushing north. Morning at Kravice Waterfalls, where you can swim in a lake fed by sixteen separate cascades. Then Počitelj — a perfectly preserved Ottoman fortress village that looks like it was painted rather than built.',
        afternoon: 'Visit to a Herzegovina wine cellar for tasting and lunch. Then Stolac — one of the oldest inhabited places in the Balkans — and Blagaj, where a 600-year-old dervish monastery sits at the mouth of a river that emerges fully-formed from a cliff. Arrival in Mostar around 5pm, hotel check-in, and an orientational walk across the Old Bridge with free time to explore.',
        highlights: [
          'Swimming in Kravice Waterfalls',
          'Wine tasting in a Herzegovina cellar',
          'Počitelj, Stolac and Blagaj — three UNESCO-listed sites in one afternoon',
          'First crossing of Stari Most at sunset',
        ],
        note: 'Lunch will be organised within the group by the tour guide and is not included in the package price — you pay directly at the cellar.',
      },
      {
        id: 4,
        title: 'Dictator Tito and Rafting — Wait, What?',
        city: 'Konjic & Jablanica',
        summary: 'Tito\'s Nuclear Bunker, UNESCO Woodcarving Museum, white water rafting.',
        photo: '/photos/bosnia-deep-dive-day-4.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Riverbank lunch', 'Farewell dinner'],
        includedActivities: ["Tito's Nuclear Bunker tour", 'UNESCO Woodcarving Museum', 'Neretva white water rafting', 'Farewell dinner in Sarajevo'],
        optionalActivities: ['Extra time in Konjic old town'],
        morning: 'Drive to Jablanica, where your guide will introduce the story of Josip Broz Tito before you enter Konjic — a town that somehow contains both a UNESCO-protected woodcarving tradition and a Cold War nuclear bunker built for 350 people that was kept completely secret until 1992. The bunker is one of the most genuinely strange places in Europe.',
        afternoon: 'White water rafting on the Neretva River — Bosnia\'s most popular rafting experience, through a canyon that gets progressively more dramatic. Lunch on the riverbank. Then the drive back to Sarajevo and a farewell dinner with your guide — the best ending to five days that went by far too quickly.',
        highlights: [
          'Tito\'s Nuclear Bunker — Cold War history at its most surreal',
          'UNESCO Woodcarving Museum in Konjic',
          'White water rafting on the Neretva River',
          'Farewell dinner in Sarajevo',
        ],
      },
      {
        id: 5,
        title: 'Ready to Say "See You Again"?',
        city: 'Sarajevo',
        summary: 'Flexible departure — optional activity based on your schedule.',
        photo: '/photos/bosnia-deep-dive-day-5.jpg',
        meals: ['Breakfast'],
        includedActivities: ['Private departure transfer'],
        optionalActivities: ['Vrelo Bosne nature walk', 'Copper bazaar shopping'],
        morning: 'This day belongs to your departure time. Whether you leave early or late, your guide will work around your schedule. If time allows, there is always one more thing worth seeing in Sarajevo. Just ask.',
        afternoon: 'Private transfer to the airport or onward destination.',
        highlights: [
          'Flexible schedule built around your departure',
          'Optional add-on activity on request',
          'Private transfer included',
        ],
        note: 'This day revolves around your departure time. Message your guide before arrival to discuss possible activities that fit your schedule.',
      },
    ],

    inclusions: [
      'Private transfer on arrival and departure',
      'Welcome lunch or dinner with a local family',
      'Sarajevo Sunset Walking Tour',
      'Between Empires: Sarajevo Walking Tour',
      'Siege of Sarajevo: Survival & Resistance Tour',
      'Bosnian coffee ceremony',
      'True Herzegovina Day Tour',
      'Entry to Tito\'s Nuclear Bunker',
      'Entry to UNESCO Woodcarving Museum',
      'White water rafting on the Neretva',
      'Farewell dinner in Sarajevo',
      'Private transport throughout',
      'Small group — maximum 8 people',
      'Free cancellation up to 72 hours before',
    ],

    exclusions: [
      'Flights and international transport',
      'Accommodation',
      'Some lunches — pay as you go like a local',
      'Herzegovina wine cellar lunch — paid directly',
      'Gratuities — appreciated but never expected',
      'Personal expenses and souvenirs',
      'Travel insurance',
    ],

    breakdown: {
      accommodation: ['Hotel Hecco Deluxe, Sarajevo (Days 1–2)', 'Hotel Bristol, Mostar (Day 3)', 'Hotel Hecco Deluxe, Sarajevo (Days 4–5)'],
      meals: ['Welcome dinner with local family (Day 1)', 'Breakfast & lunch (Day 2)', 'Wine cellar tasting (Day 3)', 'Riverbank lunch & farewell dinner (Day 4)', 'Breakfast (Day 5)'],
      transport: ['Private vehicle and driver throughout', 'Arrival and departure private transfers'],
      destinations: ['Sarajevo', 'Kravice Waterfalls', 'Počitelj', 'Blagaj', 'Mostar', 'Konjic', 'Jablanica'],
      activities: ['Sarajevo Sunset Walking Tour', 'Welcome dinner with local family', 'Bosnian coffee ceremony', 'Between Empires Walking Tour', 'Siege of Sarajevo Tour', 'Kravice Waterfalls', 'Počitelj fortress village', 'Blagaj Tekke', "Tito's Nuclear Bunker (ARK D-0)", 'UNESCO Woodcarving Museum, Konjic', 'White water rafting on the Neretva', 'Farewell dinner in Sarajevo'],
      optional: ['Swimming at Kravice (seasonal)', 'Tunnel of Hope Museum — €15', 'War Childhood Museum'],
    },

    activities: [
      {
        icon: 'sunset',
        name: 'Sarajevo Sunset Walking Tour',
        description: 'Meet Sarajevo during the golden hour when the city is at its most beautiful.',
      },
      {
        icon: 'history',
        name: 'Between Empires Walking Tour',
        description: 'Walk through centuries of Ottoman and Austro-Hungarian history in one district.',
      },
      {
        icon: 'war',
        name: 'Siege of Sarajevo Tour',
        description: 'The siege explained through real stories by someone who lived through it.',
      },
      {
        icon: 'waterfall',
        name: 'Kravice Waterfalls',
        description: 'Swim in a lake fed by sixteen cascades — Herzegovina\'s most spectacular natural site.',
      },
      {
        icon: 'wine',
        name: 'Herzegovina Wine Cellar',
        description: 'Taste local wines in an ancient cellar in one of Europe\'s lesser-known wine regions.',
      },
      {
        icon: 'bunker',
        name: 'Tito\'s Nuclear Bunker',
        description: 'Cold War paranoia made concrete — a bunker built for 350 people and kept secret for decades.',
      },
      {
        icon: 'rafting',
        name: 'White Water Rafting',
        description: 'The Neretva canyon gets more dramatic with every bend — Bosnia\'s best rafting experience.',
      },
      {
        icon: 'family',
        name: 'Home-Hosted Meals',
        description: 'Welcome dinner with a local family on night one, farewell dinner with your guide on night four.',
      },
    ],

    importantInfo: [
      {
        title: 'Things to Consider Before Booking',
        content: 'Free cancellation up to 72 hours before the start date. Cancellations within 72 hours are non-refundable. Send a booking request and you will hear back within 24 hours to confirm availability and arrange all details.',
      },
      {
        title: 'Accommodation',
        content: 'Accommodation is not included in this package. Your guide can recommend hotels in Sarajevo and Mostar at different price points — just ask when you send your booking request.',
      },
      {
        title: 'What to Wear',
        content: 'Casual comfortable clothing. Avoid shorts and sleeveless shirts for city days as some visits may include places of worship. Bring swimwear for Kravice Waterfalls and the rafting day. A light jacket for evenings — Herzegovina can be warm during the day and cool at night.',
      },
      {
        title: 'Joining Point',
        content: 'To be confirmed via message before your arrival. Your guide will coordinate directly with you and provide all meeting point details in advance.',
      },
      {
        title: 'Visas',
        content: 'Bosnia and Herzegovina is not a member of the European Union. Citizens of most EU, US, UK, and Australian passports do not require a visa for stays up to 90 days. Please check with your local embassy if you are unsure.',
      },
    ],

    dates: [
      { id: 1, date: 'April 14–18, 2026', spots: 6, total: 8 },
      { id: 2, date: 'April 28 – May 2, 2026', spots: 4, total: 8 },
      { id: 3, date: 'May 12–16, 2026', spots: 8, total: 8 },
      { id: 4, date: 'May 26–30, 2026', spots: 2, total: 8 },
      { id: 5, date: 'June 9–13, 2026', spots: 8, total: 8 },
    ],
    mapWaypoints: [
      { lat: 43.8563, lng: 18.4132, label: 'Sarajevo' },
      { lat: 43.6579, lng: 17.9621, label: 'Konjic' },
      { lat: 43.6632, lng: 17.7586, label: 'Jablanica' },
      { lat: 43.1390, lng: 17.6055, label: 'Kravice Waterfalls' },
      { lat: 43.3370, lng: 17.8156, label: 'Mostar' },
    ],
    mapProfile: 'driving-car',
    fitnessNotes: [
      {
        type: 'physical',
        level: 'Moderate physical activity',
        detail: 'Day 4 includes white water rafting on the Neretva River — a physically active experience requiring reasonable fitness, the ability to swim, and comfort in moving water. Guests with back injuries or heart conditions should consult their doctor before booking. The rafting operator provides safety briefings, equipment, and guides throughout.',
      },
      {
        type: 'emotional',
        level: 'Contains emotionally heavy history',
        detail: 'This package includes the Siege of Sarajevo tour, covering wartime trauma, survival stories, and the human cost of the 1992–1995 siege. The content is delivered with full care and respect, but it is emotionally demanding. Guests sensitive to war and trauma-related material should consider this before booking.',
      },
    ],
    suitability: {
      goodFor: [
        'Active travelers comfortable with moderate physical activity',
        'Those wanting a complete Bosnia experience — cities, nature, history',
        'Travelers happy to mix culture with outdoor adventure',
        'Groups wanting a private, flexible itinerary',
        'Anyone curious about the Balkans beyond the tourist trail',
      ],
      thinkTwice: [
        'If rafting or swimming in moving water is not for you — Day 4 includes white water rafting on the Neretva',
        'If you have back injuries or heart conditions — consult your doctor before booking',
        'If emotionally heavy wartime content is difficult — Siege of Sarajevo and Srebrenica are both included',
        'If five days away feels too long to be away from home comforts',
      ],
    },
  },
      // ─── SARAJEVO TO DUBROVNIK ─────────────────────────────────────────────
  {
    id: 3,
    slug: 'sarajevo-to-dubrovnik',
    name: 'Sarajevo to Dubrovnik',
    subtitle: 'Empires, Mountains & the Adriatic Coast',
    duration: '7 Days',
    groupSize: 10,
    difficulty: 'Moderate',
    priceWithout: 890,
    priceWith: 1490,
    rating: 5.0,
    reviews: 0,
    heroImage: package3Hero,
    gallery: [package3Hero],
    about: `This journey connects two of the most dramatic cities in the Balkans — Sarajevo, the city where East met West and history turned on a bullet, and Dubrovnik, the walled pearl of the Adriatic. In between lies a landscape most travellers never see: Herzegovina's limestone gorges, Ottoman bridge towns, the wild Neretva river, and a short but sovereign corridor of Bosnian sea.

The route is not just a transfer — it is a narrative. You will move through layers of Ottoman, Austro-Hungarian, Yugoslav, and Mediterranean history. You will eat burek in a Sarajevo backstreet, swim beneath the old bridge in Mostar at golden hour, taste Herzegovinian wine in a family cellar, and walk the walls of Dubrovnik as the Adriatic turns orange below you.

Seven days. Two countries. One unforgettable arc.`,

    days: [
      {
        id: 1,
        title: 'Arrival in Sarajevo',
        city: 'Sarajevo',
        summary: 'Arrival, orientation walk, and first taste of Bosnian hospitality.',
        photo: '/photos/sarajevo-to-dubrovnik-day-1.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Welcome dinner'],
        includedActivities: ['Private arrival transfer', 'Orientation walk through Baščaršija', 'Welcome dinner at local konoba'],
        optionalActivities: ['Evening free walk in the old town'],
        morning: 'Arrival into Sarajevo by air or road. Private transfer to your accommodation in the old town or immediate surroundings. Settle in, freshen up, and step outside — the city begins at your doorstep. Baščaršija, the Ottoman bazaar quarter, is within walking distance. Let it disorient you gently. That is part of the design.',
        afternoon: 'At 16:00 meet your guide for a 90-minute orientation walk through Baščaršija and across the invisible line where the Ottoman city meets the Austro-Hungarian boulevard. Your guide will explain why this 200-metre stretch is called the \'Jerusalem of Europe\'. Dinner is at a local konoba — slow-roasted lamb under the sač, Bosnian bread, and your first glass of Žilavka white wine. Evening free.',
        highlights: [
          'Arrival private transfer',
          'Orientation walk through Baščaršija',
          'Ottoman-to-Austro-Hungarian city transition point',
          'First Bosnian dinner at a local konoba',
        ],
        note: 'If arriving late, the orientation walk moves to Day 2 morning. Dinner still happens.',
      },
      {
        id: 2,
        title: 'Sarajevo Deep Dive',
        city: 'Sarajevo',
        summary: 'Full day in Sarajevo — history, siege, coffee ritual, and local lunch.',
        photo: '/photos/sarajevo-to-dubrovnik-day-2.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Breakfast', 'Lunch'],
        includedActivities: ['Bosnian coffee ceremony', 'Between Empires Walking Tour', 'Siege of Sarajevo Tour', 'Local neighbourhood lunch'],
        optionalActivities: ['Tunnel of Hope Museum', 'War Childhood Museum', 'Rooftop group dinner'],
        morning: '09:00 Bosnian coffee ceremony at a traditional kafana. Not an espresso. A ritual with its own grammar — the džezva, the sugar, the rahat lokum, the silence. Your guide explains what coffee means socially in Bosnia before you drink it. 09:45 Begin the Between Empires walking tour: Latin Bridge (where Franz Ferdinand was shot), Gazi Husrev-beg Mosque, the Old Orthodox Church, the Sephardic synagogue — four religions within 500 metres. 11:30 Siege of Sarajevo tour begins. The Yellow Bastion. The tunnel museum context. Rose markings in the pavement. Stories told by someone who lived through the 1,425-day siege.',
        afternoon: '13:30 Lunch at a neighbourhood restaurant your guide knows — not a tourist trap. Ćevapi, Bosnian pot dishes, or grilled vegetables depending on season. 15:30 Free afternoon. Options: Tunnel of Hope Museum (30-min drive), the War Childhood Museum, copper shopping in the čaršija, or simply sitting by the Miljacka river. 19:00 Optional group dinner at a rooftop restaurant with a view over the city at dusk.',
        highlights: [
          'Bosnian coffee ceremony',
          'Between Empires walking tour',
          'Siege of Sarajevo interpretation',
          'Local lunch away from tourist circuits',
          'Free afternoon exploration',
        ],
        note: 'The siege content is emotionally heavy. Guests who are sensitive should be prepared. The guide handles it with care — but does not sanitise it.',
      },
      {
        id: 3,
        title: 'Into Herzegovina',
        city: 'Konjic / Jablanica',
        summary: "Drive south through the Neretva canyon, Tito's bunker, and the wartime bridge.",
        photo: '/photos/sarajevo-to-dubrovnik-day-3.jpg',
        accommodation: 'Hotel Bristol, Mostar',
        meals: ['Jablanica lamb lunch'],
        includedActivities: ['Neretva canyon drive', 'Konjic Ottoman bridge', "ARK D-0 bunker tour", 'Jablanica riverside lamb lunch', 'Stari Most sunset walk'],
        optionalActivities: ['Mostar evening old town walk'],
        morning: '09:00 Depart Sarajevo by private minibus. The road south descends almost immediately into the Neretva river gorge — one of the most dramatic drives in the western Balkans. First stop: Konjic. A small Ottoman bridge town with a 17th-century stone arch bridge and a woodcarving tradition still practiced today. Walk the bridge, drink a coffee, watch the river. 45 minutes.',
        afternoon: '11:30 ARK D-0 — Tito\'s nuclear bunker. Carved into the mountain above Konjic between 1953 and 1979, designed to shelter Yugoslav leadership through a nuclear war. It is enormous, surreal, and almost completely unknown to international travellers. Guided tour inside the bunker: 90 minutes. 13:30 Lunch at Jablanica — famous throughout former Yugoslavia for its lamb roasted over open fire beside the river. The restaurant hangs over the Neretva. The lamb takes hours. It is worth it. 15:30 Continue south toward Mostar. Arrive late afternoon. Check in. Walk to the Old Bridge for sunset.',
        highlights: [
          'Neretva canyon drive',
          'Konjic Ottoman bridge',
          "ARK D-0 — Tito's nuclear bunker",
          'Jablanica spit-roast lamb lunch',
          "First view of Mostar's Old Bridge at dusk",
        ],
        note: 'The bunker tour requires booking in advance. Confirm at least 48 hours before departure.',
      },
      {
        id: 4,
        title: 'Mostar & the Old Bridge',
        city: 'Mostar',
        summary: 'Full day in Mostar — the bridge, the war, the old town, and a swim.',
        photo: '/photos/sarajevo-to-dubrovnik-day-4.jpg',
        accommodation: 'Hotel Bristol, Mostar',
        meals: ['Breakfast', 'Trout lunch'],
        includedActivities: ['Stari Most early morning walk', 'Mostar war history walk', 'Local trout lunch', 'Blagaj Tekke visit'],
        optionalActivities: ['Bridge diver watch', 'Swimming under Stari Most (June–Sep)'],
        morning: '08:30 Morning walk to Stari Most before the tourist crowds arrive. The bridge opens to you differently at 08:30 than at noon. Your guide explains the construction of the original 16th-century Ottoman bridge, its destruction in 1993 by artillery, and its meticulous reconstruction completed in 2004. Walk both banks. Visit the Kujundžiluk bazaar while it is still quiet. 10:00 War history walk through Mostar — the front line ran through this city for years. The destroyed Sniper Tower still stands. Your guide knows these streets personally.',
        afternoon: '12:30 Lunch at a family-run restaurant on the eastern bank — grilled trout from the Neretva, Herzegovinian salad, local bread. 14:30 Optional: watch a bridge diver from the Stari Most diving club prepare and jump — a tradition going back centuries. Not staged for tourists. Real competition divers. 15:30 Drive 20 minutes to the Blagaj Tekke — a 16th-century Dervish monastery built into a cliff face at the source of the Buna river. One of the most atmospheric sites in Bosnia. Return to Mostar for free evening. Dinner on your own — your guide will give three specific recommendations.',
        highlights: [
          'Early morning Stari Most walk',
          'War history walk through divided Mostar',
          'Local trout lunch on the Neretva',
          'Bridge divers — real tradition, not a show',
          'Blagaj Tekke cliff monastery',
        ],
        note: 'Swimming beneath the Old Bridge is possible June–September. Water temperature and safety conditions permitting.',
      },
      {
        id: 5,
        title: 'Wine Country & the Coast',
        city: 'Čapljina / Neum / Pelješac',
        summary: "Herzegovinian wine cellars, Bosnia's only sea, and the Pelješac peninsula.",
        photo: '/photos/sarajevo-to-dubrovnik-day-5.jpg',
        accommodation: 'Hotel Adriatic, Dubrovnik',
        meals: ['Wine tasting & food pairing', 'Neum seafood lunch'],
        includedActivities: ['Herzegovinian wine cellar tasting', 'Neum coastal stop', 'Mali Ston oyster tasting'],
        optionalActivities: ['Sunset walk on Stradun'],
        morning: "09:00 Depart Mostar. Drive south through the Herzegovinian wine country — the Žilavka and Blatina grape varieties grow here in one of Europe's sunniest wine regions. Visit a family winery in the Čapljina area. Not a commercial tasting room — a working cellar with a family who has been making wine for three generations. Guided tasting of 4–5 wines with local cheese and dried meats. 90 minutes.",
        afternoon: "11:30 Continue south to Neum — Bosnia and Herzegovina's only coastal town, a 24-km corridor giving the country its sole access to the Adriatic. It is modest, unhurried, and almost unknown to non-Balkan travellers. Lunch at a seafood restaurant on the waterfront. 13:30 Cross into Croatia. Drive the Pelješac peninsula — arguably Croatia's finest wine and oyster territory. Stop at Mali Ston for the famous oysters, grown in the bay since the 14th century. Arrive Dubrovnik late afternoon. Check in. First view of the walls.",
        highlights: [
          'Herzegovinian family wine cellar tasting',
          "Neum — Bosnia's only sea access",
          'Pelješac peninsula coastal drive',
          'Mali Ston oysters',
          'Arrival into Dubrovnik',
        ],
        note: 'The winery visit is at a working family farm — not a polished tour operator. That is the point.',
      },
      {
        id: 6,
        title: 'Dubrovnik — The Walled City',
        city: 'Dubrovnik',
        summary: 'Old town immersion, city walls walk, and the real Dubrovnik beneath the tourism.',
        photo: '/photos/sarajevo-to-dubrovnik-day-6.jpg',
        accommodation: 'Hotel Adriatic, Dubrovnik',
        meals: ['Breakfast', 'Lunch'],
        includedActivities: ['City walls circuit', 'Old town guided tour', 'Local restaurant lunch'],
        optionalActivities: ['Lokrum island ferry', 'Mount Srđ cable car', 'Sea kayaking around the walls'],
        morning: "08:00 Enter the old town before the cruise ship crowds arrive. Your guide — a Dubrovnik local — begins at the Pile Gate. Walk the Stradun, enter the Rector's Palace, find the streets that do not appear on the standard tour. 09:30 City walls walk — 2km circuit around the medieval fortifications. Views of the Adriatic, the old port, and the terracotta rooftops that were 70% destroyed in the 1991–92 siege and rebuilt stone by stone. Your guide will point out which roof tiles are original and which are replacements — there is a visible colour difference if you know where to look.",
        afternoon: "12:00 Lunch at a restaurant inside the old town chosen for quality rather than location — your guide knows which places locals still eat at. 14:00 Free afternoon. Options: Lokrum island ferry (15 minutes, forested island with a botanical garden and resident peacocks), cable car to Mount Srđ (panoramic views), sea kayaking around the walls, or simply sitting in a small square with a coffee watching the city operate. 19:30 Sunset drinks on a terrace overlooking the Adriatic. Optional group dinner at a seafood restaurant on the old port.",
        highlights: [
          'Early morning old town entry before crowds',
          'City walls circuit — 2km walk',
          '1991 siege damage visible in the roof tiles',
          'Lokrum island, cable car, or kayaking options',
          'Sunset over the Adriatic',
        ],
        note: 'July and August crowds inside the walls are significant. The early morning start on Day 6 is deliberate — non-negotiable for the best experience.',
      },
      {
        id: 7,
        title: 'Departure Day',
        city: 'Dubrovnik',
        summary: 'Final morning in the old town, farewell breakfast, transfer to airport.',
        photo: '/photos/sarajevo-to-dubrovnik-day-7.jpg',
        meals: ['Farewell breakfast'],
        includedActivities: ['Farewell breakfast', 'Private airport transfer'],
        optionalActivities: ['Final old town morning walk'],
        morning: 'Final morning is structured around your departure time. If you leave after midday, there is time for one more walk — your guide will suggest a specific route based on what you have not yet seen. Farewell breakfast at a café your guide considers the best morning spot in Dubrovnik. Pastries, local honey, strong coffee. Conversation about what you have seen over seven days. What surprised you. What you will carry home.',
        afternoon: 'Private transfer to Dubrovnik Airport (Čilipi), approximately 25 minutes from the old town. Your guide accompanies you to the drop-off point. For guests with late afternoon or evening flights: luggage storage arranged, full free day in Dubrovnik until transfer time.',
        highlights: [
          'Final old town morning walk',
          'Farewell breakfast at a local café',
          'Luggage storage for late departures',
          'Private airport transfer',
        ],
        note: 'Dubrovnik Airport is small and can be congested in peak season. Allow 2 hours before departure.',
      },
    ],

    inclusions: [
      'Private minibus transport throughout (Sarajevo to Dubrovnik)',
      'Professional licensed guide for all 7 days',
      'Arrival and departure private transfers',
      'Day 1 welcome dinner at a local konoba',
      'Bosnian coffee ceremony (Day 2)',
      'ARK D-0 bunker guided tour (Day 3)',
      'Jablanica riverside lunch (Day 3)',
      'Blagaj Tekke guided visit (Day 4)',
      'Herzegovinian family wine cellar tasting (Day 5)',
      'Mali Ston oyster tasting (Day 5)',
      'Dubrovnik city walls entry fee (Day 6)',
      'Farewell breakfast (Day 7)',
      'Small group — maximum 10 people',
      'Free cancellation up to 72 hours before departure',
    ],

    exclusions: [
      'Flights and international transport',
      'Accommodation (hotel recommendations provided at each stop)',
      'Most lunches and dinners (exceptions listed in inclusions)',
      'Entry fees not specified in inclusions',
      'Travel insurance — required, not included',
      'Gratuities — appreciated but never expected',
      'Personal expenses and souvenirs',
    ],

    breakdown: {
      accommodation: ['Hotel Hecco Deluxe, Sarajevo (Days 1–2)', 'Hotel Bristol, Mostar (Days 3–4)', 'Hotel Adriatic, Dubrovnik (Days 5–7)'],
      meals: ['Welcome dinner at local konoba (Day 1)', 'Breakfast & lunch (Day 2)', 'Jablanica riverside lamb lunch (Day 3)', 'Breakfast & trout lunch (Day 4)', 'Wine tasting & Neum seafood lunch (Day 5)', 'Breakfast & lunch (Day 6)', 'Farewell breakfast (Day 7)'],
      transport: ['Private minibus throughout (Sarajevo to Dubrovnik)', 'Arrival and departure private transfers'],
      destinations: ['Sarajevo', 'Konjic (ARK D-0)', 'Jablanica', 'Mostar', 'Blagaj', 'Neum', 'Mali Ston', 'Dubrovnik'],
      activities: ['Orientation walk through Baščaršija', 'Bosnian coffee ceremony', 'Between Empires Walking Tour', 'Siege of Sarajevo Tour', 'Konjic Ottoman bridge', "ARK D-0 nuclear bunker tour", 'Jablanica riverside lamb lunch', 'Stari Most early morning walk', 'Mostar war history walk', 'Blagaj Tekke visit', 'Herzegovinian wine cellar tasting', 'Mali Ston oyster tasting', 'Dubrovnik city walls circuit', 'Old town guided tour', 'Farewell breakfast'],
      optional: ['Tunnel of Hope Museum', 'War Childhood Museum', 'Swimming under Stari Most (June–Sep)', 'Lokrum island ferry', 'Mount Srđ cable car', 'Sea kayaking around the walls'],
    },

    activities: [
      {
        icon: 'history',
        name: 'Between Empires Walking Tour',
        description: 'Ottoman bazaars, Austro-Hungarian boulevards, and four religions within 500 metres.',
      },
      {
        icon: 'war',
        name: 'Siege of Sarajevo Tour',
        description: 'The 1,425-day siege told through real stories by someone who lived through it.',
      },
      {
        icon: 'coffee',
        name: 'Bosnian Coffee Ceremony',
        description: 'Learn the ritual behind the most important daily tradition in Bosnia.',
      },
      {
        icon: 'bunker',
        name: "ARK D-0 — Tito's Nuclear Bunker",
        description: "One of Yugoslavia's best-kept secrets — a city-sized bunker carved into the mountain above Konjic.",
      },
      {
        icon: 'history',
        name: 'Mostar Old Bridge & War Walk',
        description: 'The 16th-century bridge, its destruction in 1993, and the city that rebuilt itself.',
      },
      {
        icon: 'wine',
        name: 'Herzegovinian Wine Cellar',
        description: "Three-generation family winery in one of Europe's sunniest wine regions.",
      },
      {
        icon: 'food',
        name: 'Mali Ston Oysters',
        description: 'Bay-grown oysters from a tradition dating back to the 14th century.',
      },
      {
        icon: 'sunset',
        name: 'Dubrovnik City Walls at Sunset',
        description: '2km circuit above the Adriatic with views no photograph fully captures.',
      },
    ],

    importantInfo: [
      {
        title: 'Free Cancellation',
        content: 'Free cancellation up to 72 hours before departure. Cancellations within 72 hours are non-refundable.',
      },
      {
        title: 'Accommodation',
        content: 'Accommodation is not included. Your guide provides vetted recommendations at each overnight stop — budget, mid-range, and boutique options.',
      },
      {
        title: 'Visas',
        content: 'Bosnia and Herzegovina is not EU. Croatia is EU. Most EU/US/UK/AU passports need no visa for either country for stays under 90 days. Confirm your specific passport requirements before booking.',
      },
      {
        title: 'Currency',
        content: 'Bosnia uses BAM (Convertible Mark). Croatia uses EUR. ATMs available throughout the route.',
      },
      {
        title: 'What to Wear',
        content: 'Comfortable walking shoes required. Modest dress near mosques and monasteries. Light layers for canyon sections which can be cooler than the coast.',
      },
      {
        title: 'Physical Demand',
        content: 'The city walls walk in Dubrovnik (2km, uneven stone, no shade in summer) is the most physically demanding segment. Moderate fitness required.',
      },
      {
        title: 'Joining Point',
        content: 'Sarajevo — your guide will contact you before arrival to confirm meeting point and logistics.',
      },
    ],

    dates: [
      { id: 1, date: 'May 3–9, 2026', spots: 10, total: 10 },
      { id: 2, date: 'May 17–23, 2026', spots: 10, total: 10 },
      { id: 3, date: 'June 7–13, 2026', spots: 10, total: 10 },
      { id: 4, date: 'June 21–27, 2026', spots: 10, total: 10 },
      { id: 5, date: 'September 6–12, 2026', spots: 10, total: 10 },
    ],

    mapWaypoints: [
      { lat: 43.8563, lng: 18.4131, label: 'Sarajevo' },
      { lat: 43.9667, lng: 17.9667, label: 'Konjic' },
      { lat: 43.6567, lng: 17.4307, label: 'Jablanica' },
      { lat: 43.3561, lng: 17.8153, label: 'Mostar' },
      { lat: 43.1256, lng: 17.6789, label: 'Čapljina' },
      { lat: 42.9275, lng: 17.6131, label: 'Neum' },
      { lat: 42.8408, lng: 17.4141, label: 'Mali Ston' },
      { lat: 42.6507, lng: 18.0944, label: 'Dubrovnik' },
    ],
    mapProfile: 'driving-car',

    fitnessNotes: [
      {
        type: 'physical',
        level: 'Moderate fitness required',
        detail: 'Most walking is on flat or gently uneven surfaces. The Dubrovnik city walls (Day 6) involve 2km of uneven stone steps in full sun — the most demanding segment. The siege and wartime content on Days 2 and 4 carries emotional weight. Neither is sanitised.',
      },
    ],

    suitability: {
      goodFor: [
        'Travellers who want history with depth, not dates',
        'First-time visitors to Bosnia and Herzegovina',
        'Small group travellers who dislike coach tours',
        'People combining Dubrovnik with a Balkans cultural journey',
        'Wine, food and coastal travel enthusiasts',
        'Anyone who wants to understand the 1990s Balkan wars in context',
      ],
      thinkTwice: [
        'If you want a beach-focused holiday — this is a moving journey, not a resort stay',
        'If wartime and siege content is difficult for you — Days 2 and 4 cover heavy material',
        'If you need luxury hotels at every stop — mid-range accommodation is the baseline',
        'If Dubrovnik in July/August peak crowds concern you — consider travelling in May, June, or September',
      ],
    },
  },

  // ─── THE BALKANS FULL ARC ────────────────────────────────────────────────
  {
    id: 4,
    slug: 'balkans-full-arc',
    name: 'The Balkans Full Arc',
    subtitle: '15 Days from Sarajevo Through the Balkans',
    duration: '15 Days',
    groupSize: 8,
    difficulty: 'Moderate',
    priceWithout: 4490,
    priceWith: 5990,
    rating: 5.0,
    reviews: 0,
    heroImage: package4Hero,
    gallery: [package4Hero],
    about: `Fifteen days. Four countries. One journey that starts in the Ottoman heart of Sarajevo, crosses the Drina into Serbia, climbs into the mountains of Montenegro, descends to the walled bay of Kotor, and ends with a farewell dinner over the lit bridge in Mostar. This is the complete arc — the one that does not skip the mountains, rush the coast, or soften the history.

You will walk Sarajevo's civilizations corridor and hear the siege explained by someone who lived through it. You will cross Andrić's UNESCO bridge on the Drina and read aloud from the novel. You will ride a figure-8 railway through 22 tunnels, sleep at the highest town in the Balkans, optionally raft the deepest canyon in Europe, and climb the walls of Kotor and Dubrovnik before the cruise ships arrive.

Fifteen days. Four countries. Six border crossings. The Balkans, completely.`,

    days: [
      {
        id: 1,
        title: 'Arrival in Sarajevo',
        city: 'Sarajevo',
        summary: 'Arrival day with welcome dinner at a Bosnian aščinica.',
        photo: '/photos/balkans-full-arc-day-1.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Welcome dinner'],
        includedActivities: ['Private arrival transfer', 'Welcome dinner at aščinica', 'Tour leader briefing'],
        optionalActivities: ['Evening Baščaršija walk'],
        morning: 'Private airport transfers to your hotel in the Old Town. Time to settle in and orient yourself in the city at your own pace.',
        afternoon: 'Free afternoon to walk the Baščaršija and find your bearings. Optional coffee at one of the historic coffeehouses. Welcome briefing at 18:30 followed by a welcome dinner at a traditional aščinica — slow-cooked Bosnian dishes: begova čorba, dolma, ćevapi. Tour leader introduces the arc of the journey.',
        highlights: [
          'Welcome dinner with the group',
          'First evening in the Baščaršija old town',
          'Tour leader introduction and trip briefing',
        ],
        note: 'Arrival times are flexible. Welcome dinner at 19:30 is the only fixed point.',
      },
      {
        id: 2,
        title: 'Sarajevo — Between Empires',
        city: 'Sarajevo',
        summary: 'Bosnian coffee ritual and the civilizations walking tour.',
        photo: '/photos/balkans-full-arc-day-2.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Breakfast'],
        includedActivities: ['Bosnian coffee ceremony', 'Between Empires Walking Tour', 'City Hall (Vijećnica)'],
        optionalActivities: ['Yellow Fortress sunset climb', 'Kafana sevdah dinner — €60'],
        morning: 'Bosnian coffee ritual at a Baščaršija coffeehouse — explained as ceremony, not caffeine. Walking tour through the 200-metre civilizations corridor: Sebilj fountain → Gazi Husrev-beg mosque → Sacred Heart Cathedral. Latin Bridge — the assassination that ended the 19th century.',
        afternoon: 'Lunch break (own arrangement — guide gives three picks). City Hall (Vijećnica) — burned 1992, rebuilt 2014 — and the Sarajevo Haggadah story. Free evening. Optional climb to the yellow fortress (Žuta Tabija) for sunset over the city.',
        highlights: [
          'Bosnian coffee ceremony — the correct way',
          'Ottoman to Austro-Hungarian in 200 metres',
          'Latin Bridge and the assassination of 1914',
          'City Hall and the Sarajevo Haggadah',
        ],
        note: 'Long walking day on cobblestones — wear proper shoes.',
      },
      {
        id: 3,
        title: 'Sarajevo — The Siege & The Mountain',
        city: 'Sarajevo',
        summary: 'Tunnel of Hope and Trebević mountain — the hardest emotional day.',
        photo: '/photos/balkans-full-arc-day-3.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Breakfast'],
        includedActivities: ['Tunnel of Hope guided tour', 'Trebević mountain drive', 'Olympic bobsled track'],
        optionalActivities: ['Gallery 11/07/95 (Srebrenica)', 'Sevdah music dinner — €60'],
        morning: 'Tunnel of Hope (Tunel Spasa) — guided by a former defender or family member. The 800-metre wartime lifeline that kept Sarajevo alive from 1992 to 1995.',
        afternoon: 'Drive up Trebević mountain to the Olympic bobsled track — now a graffiti corridor through the forest. Cable car back down. Free time for Gallery 11/07/95 (Srebrenica content — emotionally heavy, optional) or copper workshops in Kazandžiluk. Optional group dinner at a kafana with sevdah live music — €60 supplement.',
        highlights: [
          'Tunnel of Hope guided by someone who lived it',
          'Trebević Olympic bobsled track',
          'Optional sevdah music dinner',
        ],
        note: 'Most emotionally demanding day of the journey. Opt-out available for any segment.',
      },
      {
        id: 4,
        title: 'Across the Drina to Belgrade',
        city: 'Belgrade',
        summary: "Cross into Serbia via the UNESCO Drina bridge from Andrić's novel.",
        photo: '/photos/balkans-full-arc-day-4.jpg',
        accommodation: 'Hotel Moskva, Belgrade',
        meals: ['Breakfast', 'Višegrad lunch'],
        includedActivities: ["Višegrad Andrić's Bridge", 'Reading from the novel on site', 'Andrićgrad walk'],
        optionalActivities: ['Skadarlija evening (own arrangement)'],
        morning: "08:00 departure east through the Drina valley. 11:00 arrival at Višegrad — the Mehmed Paša Sokolović Bridge (UNESCO, 1577). Reading aloud: the opening passage of Ivo Andrić's The Bridge on the Drina, on the bridge itself.",
        afternoon: 'Lunch in Višegrad. Walk through Andrićgrad. 14:00 cross into Serbia at Kotroman/Vardište border. Arrive Belgrade by 17:30. Walk to Skadarlija — the bohemian quarter — for dinner (own arrangement, guide gives three picks).',
        highlights: [
          "Andrić's bridge at Višegrad",
          'Reading from The Bridge on the Drina on site',
          'First border crossing into Serbia',
          'Skadarlija bohemian quarter',
        ],
        note: 'Long transit day. Border crossing can add 30–60 minutes in summer.',
      },
      {
        id: 5,
        title: 'Belgrade',
        city: 'Belgrade',
        summary: 'Kalemegdan fortress and choice afternoon.',
        photo: '/photos/balkans-full-arc-day-5.jpg',
        accommodation: 'Hotel Moskva, Belgrade',
        meals: ['Breakfast'],
        includedActivities: ['Kalemegdan fortress walk', 'Stari Grad walking tour'],
        optionalActivities: ["Museum of Yugoslavia & Tito's mausoleum", 'Nikola Tesla Museum', 'Belgrade splav nightlife'],
        morning: 'Kalemegdan fortress and walking tour of Stari Grad. The confluence of Sava and Danube — where the Balkans literally begin. Optional Saint Sava Temple.',
        afternoon: "Choice afternoon: (a) Museum of Yugoslavia and Tito's mausoleum; (b) Nikola Tesla Museum; (c) free time on Knez Mihailova. Free evening — guide gives a splav (river barge) recommendation for those interested.",
        highlights: [
          'Kalemegdan and the Sava–Danube confluence',
          "Museum of Yugoslavia and the Tito mausoleum",
          'Choice afternoon — pick your depth',
          'Optional Belgrade splav nightlife',
        ],
        note: 'Choice afternoon — the guide stays available for either option.',
      },
      {
        id: 6,
        title: 'Belgrade to Zlatibor — Šargan 8',
        city: 'Zlatibor',
        summary: 'Drive south through Serbia plus the figure-8 mountain railway.',
        photo: '/photos/balkans-full-arc-day-6.jpg',
        accommodation: 'Mountain Hotel, Zlatibor',
        meals: ['Breakfast', 'Sirogojno village lunch'],
        includedActivities: ['Sirogojno ethno-village', 'Šargan 8 railway (pre-booked)', 'Drvengrad walk'],
        optionalActivities: [],
        morning: '09:00 departure southwest. 13:00 arrival at Sirogojno open-air ethno-village — wooden houses, traditional cuisine: komplet lepinja, smoked pršut.',
        afternoon: '15:30 Mokra Gora — ride the Šargan 8 narrow-gauge railway. A figure-8 climb through 22 tunnels, originally built in 1921 to connect Sarajevo and Belgrade. Optional walk through Drvengrad. Dinner and overnight at a mountain hotel in Zlatibor.',
        highlights: [
          'Sirogojno ethno-village lunch',
          'Šargan 8 figure-8 climb through 22 tunnels',
          'Drvengrad wooden village',
        ],
        note: 'Šargan 8 has fixed daily departures (typically 10:30 and 13:25) and sells out in summer. Pre-booked.',
      },
      {
        id: 7,
        title: 'Zlatibor to Žabljak via Mileševa',
        city: 'Žabljak',
        summary: 'The White Angel fresco then up to the highest town in the Balkans.',
        photo: '/photos/balkans-full-arc-day-7.jpg',
        accommodation: 'Hotel Durmitor, Žabljak',
        meals: ['Breakfast', 'Lunch in Pljevlja'],
        includedActivities: ['Mileševa Monastery & White Angel fresco', 'Montenegro border crossing', 'Arrival at Žabljak (1,450m)'],
        optionalActivities: [],
        morning: '08:30 departure south through the Sandžak. 10:00 Mileševa Monastery (13th century) — the White Angel fresco. Used in the first satellite TV transmission from Europe to America in 1962.',
        afternoon: '12:00 cross into Montenegro. 14:00 lunch in Pljevlja. 17:00 arrive Žabljak (1,450m) — the highest town in the Balkans. Dinner at the hotel. Early night — altitude and tomorrow is active.',
        highlights: [
          'Mileševa Monastery and the White Angel',
          'Crossing the Sandžak region',
          'Second border crossing into Montenegro',
          'Arrival at the highest town in the Balkans',
        ],
        note: 'Long transit day. Altitude at Žabljak (1,450m) — drink water, ease into the evening.',
      },
      {
        id: 8,
        title: 'Durmitor National Park',
        city: 'Žabljak',
        summary: 'Black Lake morning and choice afternoon with optional rafting.',
        photo: '/photos/balkans-full-arc-day-8.jpg',
        accommodation: 'Hotel Durmitor, Žabljak',
        meals: ['Breakfast', 'Lunch', 'Sač lamb dinner'],
        includedActivities: ['Black Lake walk (3.7 km)', 'Group sač lamb dinner'],
        optionalActivities: ['Tara Canyon rafting — €55', 'Đurđevića bridge zipline', 'Curevac viewpoint hike'],
        morning: '09:00 Black Lake (Crno jezero) — easy 3.7 km loop walk. The signature glacial lake of Durmitor.',
        afternoon: '12:00 lunch at the lake or in town. Choice afternoon: (a) Tara Canyon rafting, Class II–III, 18 km, approx. 3 hrs on water — €55 supplement; (b) Đurđevića Tara bridge viewpoint and zipline; (c) Curevac viewpoint hike, moderate, 2 hrs. 20:00 group dinner — local lamb cooked under the sač.',
        highlights: [
          'Black Lake morning walk',
          'Optional Tara Canyon rafting',
          'Sač lamb dinner — a regional specialty',
        ],
        note: 'Tara rafting cancels in heavy rain — backup is the Đurđevića viewpoint and zipline.',
      },
      {
        id: 9,
        title: 'Žabljak to Kotor via Ostrog',
        city: 'Kotor',
        summary: 'The Piva canyon descent and Ostrog cliff monastery.',
        photo: '/photos/balkans-full-arc-day-9.jpg',
        accommodation: 'Hotel Vardar, Kotor',
        meals: ['Breakfast', 'Lunch in Nikšić'],
        includedActivities: ['Piva canyon drive (56 tunnels)', 'Ostrog Monastery guided visit'],
        optionalActivities: ['Kotor evening old town walk'],
        morning: '09:00 descent through the Piva canyon — one of the most spectacular drives in Europe: narrow road, 56 tunnels, sheer walls dropping to the river below.',
        afternoon: "12:30 Ostrog Monastery — built into a vertical cliff face. The most important pilgrimage site in Montenegro. Quiet behaviour expected; cover shoulders. 14:00 lunch in Nikšić. 17:30 arrive Kotor. Walk into the walled old town. Free evening to settle in and dine.",
        highlights: [
          'Piva canyon scenic drive — 56 tunnels',
          'Ostrog cliff monastery',
          "First evening in Kotor's walled old town",
        ],
        note: 'Quiet, respectful behaviour at Ostrog. Modest dress required.',
      },
      {
        id: 10,
        title: 'Kotor & the Bay',
        city: 'Kotor',
        summary: 'The walls climb at first light then a boat tour of the bay.',
        photo: '/photos/balkans-full-arc-day-10.jpg',
        accommodation: 'Hotel Vardar, Kotor',
        meals: ['Breakfast', 'Light lunch in Perast'],
        includedActivities: ["Saint John's fortress climb", 'Bay of Kotor boat tour', 'Our Lady of the Rocks', 'Old town walking tour'],
        optionalActivities: ['Cathedral of Saint Tryphon interior', 'Maritime Museum'],
        morning: "08:30 climb the city walls to Saint John's fortress — 1,355 steps, 260m elevation. Best done early before the heat. Half-way option available.",
        afternoon: '11:00 boat tour of the Bay of Kotor — Perast and Our Lady of the Rocks, the man-made island built by sailors stone by stone over 200 years. Light lunch in Perast. 15:30 return to Kotor. Old town walking tour: Cathedral of Saint Tryphon (1166), Maritime Museum, the Venetian lions on every gate.',
        highlights: [
          "Saint John's fortress walls climb — 1,355 steps",
          'Bay of Kotor boat tour',
          'Our Lady of the Rocks story',
          'Cathedral of Saint Tryphon (1166)',
        ],
        note: 'Wall climb in heat is dangerous — early start non-negotiable in summer.',
      },
      {
        id: 11,
        title: 'Kotor to Dubrovnik via Lovćen',
        city: 'Dubrovnik',
        summary: 'Twenty-five serpentines to the Njegoš mausoleum then south to Dubrovnik.',
        photo: '/photos/balkans-full-arc-day-11.jpg',
        accommodation: 'Hotel Adriatic, Dubrovnik',
        meals: ['Breakfast', 'Lunch in Cetinje'],
        includedActivities: ['Lovćen National Park & serpentines', 'Njegoš Mausoleum (1,657m)', 'Sveti Stefan photo stop'],
        optionalActivities: ['Budva old town walk'],
        morning: '09:00 drive the 25 hairpin serpentines up to Lovćen National Park. 10:30 Njegoš Mausoleum at the summit (1,657m) — the resting place of the poet-prince-bishop who is to Montenegro what Shakespeare is to England. 461 steps to the top.',
        afternoon: '13:00 lunch in Cetinje. 15:00 photo stop at Sveti Stefan and Budva. 17:30 cross into Croatia. 19:00 arrive Dubrovnik. Free evening.',
        highlights: [
          'Lovćen 25 serpentines drive',
          'Njegoš Mausoleum at 1,657m',
          'Sveti Stefan photo stop',
          'Third border crossing into Croatia',
        ],
        note: 'Serpentines plus motion sickness — sit forward, ginger candy onboard.',
      },
      {
        id: 12,
        title: 'Dubrovnik',
        city: 'Dubrovnik',
        summary: 'The walls at first light and a free afternoon for Lokrum or Srđ.',
        photo: '/photos/balkans-full-arc-day-12.jpg',
        accommodation: 'Hotel Adriatic, Dubrovnik',
        meals: ['Breakfast'],
        includedActivities: ['City walls circuit (1.94 km)', 'Old town walking tour'],
        optionalActivities: ['Lokrum island ferry', 'Mount Srđ cable car', 'Sea kayaking'],
        morning: '08:00 walk the city walls — 1.94 km circuit. Early start mandatory in summer; by 10:00 the cruise crowds make it unpleasant.',
        afternoon: "10:30 old town walking tour — Stradun, Onofrio's fountains, Rector's Palace, Franciscan monastery (third-oldest pharmacy in Europe, est. 1317). Free afternoon: ferry to Lokrum island (15 min, swimming and monastery ruins) or cable car up Srđ for sunset.",
        highlights: [
          'Dubrovnik walls at first light — 1.94 km circuit',
          "Stradun and the Rector's Palace",
          'Free afternoon: Lokrum or Srđ sunset',
        ],
        note: 'Walls in summer heat — early start essential. Bring water.',
      },
      {
        id: 13,
        title: 'Dubrovnik to Split via Pelješac',
        city: 'Split',
        summary: "Ston walls, oysters, and Plavac Mali wine then Diocletian's Palace.",
        photo: '/photos/balkans-full-arc-day-13.jpg',
        accommodation: 'Hotel Split, Split',
        meals: ['Breakfast', 'Wine tasting & food pairing', 'Ston oysters'],
        includedActivities: ['Ston defensive walls', 'Pelješac Plavac Mali wine tasting', "Diocletian's Palace guided tour"],
        optionalActivities: ['Split Riva evening walk'],
        morning: '09:00 departure north along the Adriatic. 10:30 Ston — the 5.5 km of medieval defensive walls with oysters from the bay below.',
        afternoon: "12:30 Pelješac peninsula wine tasting — Plavac Mali, the Croatian parent grape of Zinfandel and Primitivo. Family winery in the Dingač or Postup region. 15:30 continue to Split via the new Pelješac Bridge. 18:00 arrive Split. Guided walk through Diocletian's Palace. Free evening on the Riva.",
        highlights: [
          'Ston defensive walls and oysters',
          'Pelješac Plavac Mali wine tasting',
          "Diocletian's Palace walking tour",
        ],
        note: 'Wine tasting is included with food pairing.',
      },
      {
        id: 14,
        title: 'Split to Mostar',
        city: 'Mostar',
        summary: 'Počitelj cliff fortress, Blagaj Sufi tekija, and the rebuilt Mostar bridge.',
        photo: '/photos/balkans-full-arc-day-14.jpg',
        accommodation: 'Hotel Kriva Ćuprija, Mostar',
        meals: ['Breakfast', 'Farewell dinner'],
        includedActivities: ['Počitelj cliff fortress', 'Blagaj Tekija', 'Stari Most guided tour', 'Farewell riverside dinner'],
        optionalActivities: ['Bridge diver watch — €25'],
        morning: '09:30 departure south. Cross back into Bosnia — fourth border. 12:00 Počitelj — Ottoman fortress town stacked on a cliff above the Neretva.',
        afternoon: '14:30 Blagaj Tekija — a 16th-century Sufi dervish house at the source of the Buna river, where water emerges from a cliff at 43 m³/sec. 16:30 arrive Mostar. Walking tour of Stari Most — built 1566, destroyed 1993, rebuilt 2004. 20:00 farewell dinner — Herzegovinian wine and japrak in a riverside restaurant overlooking the bridge lit up at night.',
        highlights: [
          'Počitelj cliff fortress climb',
          'Blagaj Sufi tekija and the river source',
          'Stari Most walking tour',
          'Farewell dinner over the lit bridge',
        ],
        note: 'Final group night. Bridge divers only jump when paid (€25 each).',
      },
      {
        id: 15,
        title: 'Mostar to Sarajevo & Departure',
        city: 'Sarajevo',
        summary: 'Final transfer through the Neretva canyon to Sarajevo airport.',
        photo: '/photos/balkans-full-arc-day-15.jpg',
        meals: ['Breakfast'],
        includedActivities: ['Neretva canyon scenic drive', 'Sarajevo airport transfer'],
        optionalActivities: ['Jablanica WWII museum — €40'],
        morning: '08:30 departure north through the Neretva canyon — one of the most scenic drives in the country.',
        afternoon: '11:00 arrive Sarajevo airport for flights from 13:00 onward. Optional half-day extension for late-flight guests: Jablanica Battle Museum and WWII partisan history — €40 supplement.',
        highlights: [
          'Neretva canyon scenic drive',
          'Sarajevo airport drop-off',
          'Optional Jablanica WWII extension',
        ],
        note: 'Late-flight extension must be booked at the start of the trip — capacity limited.',
      },
    ],

    inclusions: [
      '14 nights accommodation (twin share) in vetted hotels and guesthouses',
      'Private vehicle and driver throughout all 15 days',
      'Professional licensed tour guide for the full journey',
      'Airport transfers on arrival and departure (Sarajevo)',
      'Welcome dinner in Sarajevo (Day 1)',
      'Bosnian coffee ceremony (Day 2)',
      'Tunnel of Hope guided slot (Day 3)',
      'ARK D-0 nuclear bunker guided tour (Day 6)',
      'Šargan 8 railway tickets (Day 6)',
      'Mileševa Monastery guided visit (Day 7)',
      'Black Lake guided walk — Durmitor (Day 8)',
      'Ostrog Monastery guided visit (Day 9)',
      'Bay of Kotor boat tour, Perast and Our Lady of the Rocks (Day 10)',
      'Kotor city wall entry (Day 10)',
      'Lovćen National Park and Njegoš Mausoleum entry (Day 11)',
      'Dubrovnik city wall entry (Day 12)',
      'Pelješac wine cellar tasting with food pairing (Day 13)',
      'Ston oyster tasting (Day 13)',
      'Blagaj Tekija guided visit (Day 14)',
      'Farewell dinner in Mostar (Day 14)',
      'Local specialist guides in Belgrade, Kotor, Dubrovnik, Split, and Mostar',
      'Maximum 8 guests',
      'Free cancellation up to 60 days before departure',
    ],

    exclusions: [
      'International flights',
      'Travel insurance — required, not included',
      'Optional Tara Canyon rafting — €55 supplement (Day 8)',
      'Optional sevdah music dinner in Sarajevo — €60 supplement (Day 3)',
      'Optional Jablanica WWII extension on departure — €40 supplement',
      'Lunches not specified in inclusions',
      'Gratuities — appreciated but never expected',
      'Personal expenses and souvenirs',
    ],

    breakdown: {
      accommodation: ['14 nights twin share throughout (Sarajevo, Belgrade, Zlatibor, Žabljak, Kotor, Dubrovnik, Split, Mostar)'],
      meals: ['Welcome dinner, Sarajevo (Day 1)', 'Daily breakfast included', 'Višegrad lunch (Day 4)', 'Sirogojno village lunch (Day 6)', 'Lunch in Pljevlja (Day 7)', 'Sač lamb dinner (Day 8)', 'Light lunch in Perast (Day 10)', 'Lunch in Cetinje (Day 11)', 'Wine tasting & food pairing, Ston oysters (Day 13)', 'Farewell dinner in Mostar (Day 14)'],
      transport: ['Private vehicle and driver throughout all 15 days', 'Airport transfers — Sarajevo arrival & departure'],
      destinations: ['Sarajevo', 'Višegrad', 'Belgrade', 'Zlatibor & Šargan 8', 'Žabljak & Durmitor', 'Kotor', 'Dubrovnik', 'Split', 'Mostar'],
      activities: ['Bosnian coffee ceremony', 'Between Empires Walking Tour', 'City Hall (Vijećnica)', 'Tunnel of Hope guided tour', 'Trebević mountain & Olympic bobsled track', "Andrić's Bridge at Višegrad", 'Kalemegdan fortress walk, Belgrade', 'Sirogojno ethno-village', 'Šargan 8 railway (pre-booked)', 'Mileševa Monastery & White Angel fresco', 'Black Lake walk, Durmitor (3.7 km)', 'Piva canyon drive (56 tunnels)', 'Ostrog Monastery guided visit', "Saint John's fortress climb, Kotor", 'Bay of Kotor boat tour & Our Lady of the Rocks', 'Lovćen National Park & Njegoš Mausoleum', 'Dubrovnik city walls circuit (1.94 km)', 'Ston defensive walls', 'Pelješac Plavac Mali wine tasting', "Diocletian's Palace guided tour", 'Počitelj cliff fortress', 'Blagaj Tekija', 'Stari Most guided tour'],
      optional: ['Tara Canyon rafting — €55 (Day 8)', 'Sevdah music dinner, Sarajevo — €60 (Day 3)', 'Gallery 11/07/95 Srebrenica (Day 3)', 'Jablanica WWII extension — €40 (Day 15)', "Museum of Yugoslavia & Tito's mausoleum"],
    },

    activities: [
      {
        icon: 'coffee',
        name: 'Bosnian Coffee Ceremony',
        description: 'The morning ritual that defines daily life in Bosnia — explained before you drink it.',
      },
      {
        icon: 'war',
        name: 'Tunnel of Hope',
        description: 'The 800-metre wartime lifeline guided by a former defender.',
      },
      {
        icon: 'history',
        name: "Andrić's Bridge at Višegrad",
        description: 'Read aloud from The Bridge on the Drina on the UNESCO bridge itself.',
      },
      {
        icon: 'history',
        name: 'Šargan 8 Railway',
        description: 'Figure-8 climb through 22 mountain tunnels on a narrow-gauge line built in 1921.',
      },
      {
        icon: 'rafting',
        name: 'Tara Canyon Rafting (Optional)',
        description: 'Class II–III rafting through the deepest canyon in Europe — €55 supplement.',
      },
      {
        icon: 'history',
        name: 'Ostrog Monastery',
        description: 'Built into a vertical cliff face — the most important pilgrimage site in Montenegro.',
      },
      {
        icon: 'sunset',
        name: 'Kotor & Dubrovnik City Walls',
        description: 'Both wall circuits walked at first light before the cruise ships arrive.',
      },
      {
        icon: 'wine',
        name: 'Pelješac Wine Cellar',
        description: 'Plavac Mali — the Croatian parent grape of Zinfandel and Primitivo.',
      },
      {
        icon: 'history',
        name: 'Stari Most Mostar',
        description: 'Built 1566. Destroyed 1993. Rebuilt 2004. The bridge that tells the whole story.',
      },
    ],

    importantInfo: [
      {
        title: 'Free Cancellation',
        content: 'Free cancellation up to 60 days before departure. Cancellations 30–60 days before lose 50% of the total. Within 30 days non-refundable.',
      },
      {
        title: 'Available in Three Segments',
        content: 'The Balkans Full Arc is also bookable as three connectable sub-packages: Empires & The Edge (Days 1–5, Sarajevo to Belgrade), Mountains of the Balkans (Days 6–10, Belgrade to Kotor), and Adriatic Crossings (Days 11–15, Kotor to Sarajevo via the coast). All three can be booked consecutively or independently.',
      },
      {
        title: 'Accommodation',
        content: 'Accommodation is included at 14 nights twin share. Solo travellers pay a single supplement — confirmed at booking.',
      },
      {
        title: 'Border Crossings',
        content: 'This journey crosses six borders: Bosnia–Serbia, Serbia–Montenegro, Montenegro–Croatia, Croatia–Bosnia, Bosnia–Croatia, Croatia–Bosnia. Passport with 6 months validity required. Most EU, US, UK, and Australian passports are visa-free for all four countries on this route.',
      },
      {
        title: 'What to Wear',
        content: 'Comfortable walking shoes are non-negotiable. Modest dress required at Ostrog Monastery and recommended for mosques in Sarajevo and Mostar. Pack layers — Žabljak at 1,450m can be cold even in summer; the Adriatic coast is warm.',
      },
      {
        title: 'Joining Point',
        content: 'Sarajevo International Airport (SJJ) or your central Sarajevo hotel. Your guide contacts you 14 days before departure to confirm all logistics.',
      },
    ],

    dates: [
      { id: 1, date: 'May 2–16, 2026', spots: 8, total: 8 },
      { id: 2, date: 'June 6–20, 2026', spots: 8, total: 8 },
      { id: 3, date: 'September 5–19, 2026', spots: 8, total: 8 },
    ],

    mapWaypoints: [
      { lat: 43.8563, lng: 18.4131, label: 'Sarajevo' },
      { lat: 43.8195, lng: 18.3367, label: 'Tunnel of Hope' },
      { lat: 43.7822, lng: 19.2867, label: 'Višegrad Bridge' },
      { lat: 44.8230, lng: 20.4495, label: 'Belgrade' },
      { lat: 43.7178, lng: 19.6647, label: 'Šargan 8' },
      { lat: 43.3656, lng: 19.6664, label: 'Mileševa Monastery' },
      { lat: 43.1547, lng: 19.0967, label: 'Durmitor / Žabljak' },
      { lat: 42.6792, lng: 19.0294, label: 'Ostrog Monastery' },
      { lat: 42.4247, lng: 18.7712, label: 'Kotor' },
      { lat: 42.3994, lng: 18.8389, label: 'Lovćen' },
      { lat: 42.6507, lng: 18.0944, label: 'Dubrovnik' },
      { lat: 42.8367, lng: 17.6963, label: 'Ston' },
      { lat: 43.5081, lng: 16.4402, label: 'Split' },
      { lat: 43.0833, lng: 17.7333, label: 'Počitelj' },
      { lat: 43.3375, lng: 17.8150, label: 'Mostar' },
    ],
    mapProfile: 'driving-car',

    fitnessNotes: [
      {
        type: 'physical',
        level: 'Moderate — sustained over 15 days',
        detail: 'The most demanding physical segments are the Kotor city walls (1,355 steps), the Dubrovnik walls (1.94 km in full sun), and the Black Lake walk at altitude. Žabljak sits at 1,450m — guests with serious cardiac or respiratory conditions should consult a doctor. Tara rafting (Day 8) is optional. Otherwise the daily pace is manageable for most travellers in reasonable health.',
      },
      {
        type: 'emotional',
        level: 'Contains emotionally heavy history',
        detail: 'Day 3 covers the Siege of Sarajevo through the Tunnel of Hope. Optional content includes Gallery 11/07/95, which covers the Srebrenica genocide. This content is handled with full care but is emotionally demanding by nature. Opt-out is available for any individual segment.',
      },
    ],

    suitability: {
      goodFor: [
        'Travellers with two or more weeks who want the complete Balkans story',
        'History readers and slow travellers who prefer depth over speed',
        'Small group fans — maximum 8 guests throughout',
        'Anyone combining the Balkans with a Dubrovnik trip',
        'Those curious about the 1990s wars, Yugoslav history, and the Ottoman legacy',
        'Wine, food, and mountain enthusiasts who want all three',
      ],
      thinkTwice: [
        'If 15 days of continuous movement sounds exhausting rather than energising',
        'If wartime history content is emotionally difficult — Day 3 is heavy',
        'If luxury hotels are a requirement — quality mid-range is the standard throughout',
        'If peak Adriatic summer crowds bother you — September dates are considerably quieter',
      ],
    },
  },

  // ─── EMPIRES & THE EDGE ──────────────────────────────────────────────────
  {
    id: 5,
    slug: 'empires-and-edge',
    name: 'Empires & The Edge',
    subtitle: 'Sarajevo, Višegrad & Belgrade in 5 Days',
    duration: '5 Days',
    groupSize: 8,
    difficulty: 'Easy',
    priceWithout: 1490,
    priceWith: 1890,
    rating: 5.0,
    reviews: 0,
    heroImage: package5Hero,
    gallery: [package5Hero],
    about: `From the Ottoman bazaars of Sarajevo to the Habsburg boulevards a hundred metres away, this 5-day journey is built around one question: how does a place hold so many empires at once? You will walk Sarajevo's civilizations corridor, taste Bosnian coffee the way it is meant to be tasted, and hear the siege explained by someone who lived it.

Then east — across the Drina to Andrić's UNESCO bridge, into Serbia, and up to Belgrade where two great rivers meet at a fortress that has been fought over for 2,300 years. The Sava and the Danube. The Balkans literally begin here.

Five days. Two countries. One coherent story about the edge between worlds.`,

    days: [
      {
        id: 1,
        title: 'First Contact',
        city: 'Sarajevo',
        summary: 'Arrival in Sarajevo with welcome dinner.',
        photo: '/photos/empires-and-edge-day-1.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Welcome dinner'],
        includedActivities: ['Private arrival transfer', 'Welcome dinner with the group', 'Tour leader briefing'],
        optionalActivities: ['Evening Baščaršija walk'],
        morning: 'Private airport transfers to your hotel in the Old Town. Time to settle in and orient yourself in the city at your own pace.',
        afternoon: 'Free afternoon to walk the Baščaršija and find your bearings. Optional coffee at a historic coffeehouse. Welcome dinner with the group at 19:30.',
        highlights: [
          'Welcome dinner with the group',
          'First evening in the Baščaršija old town',
          'Tour leader briefing',
        ],
        note: 'Welcome dinner at 19:30 — the only fixed point on Day 1.',
      },
      {
        id: 2,
        title: 'Between Empires',
        city: 'Sarajevo',
        summary: 'Coffee ritual and the civilizations walking tour.',
        photo: '/photos/empires-and-edge-day-2.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Breakfast'],
        includedActivities: ['Bosnian coffee ceremony', 'Between Empires Walking Tour', 'City Hall (Vijećnica)'],
        optionalActivities: ['Tunnel of Hope Museum — €15', 'Yellow Fortress walk'],
        morning: 'Bosnian coffee ritual at a Baščaršija coffeehouse — explained as ceremony, not caffeine. Walking tour through the 200-metre civilizations corridor: Sebilj fountain to Gazi Husrev-beg mosque to Sacred Heart Cathedral. Latin Bridge — the assassination that ended the 19th century.',
        afternoon: 'Lunch break (own arrangement). City Hall (Vijećnica) — burned 1992, rebuilt 2014 — and the Sarajevo Haggadah story.',
        highlights: [
          'Bosnian coffee ceremony',
          'Ottoman to Austro-Hungarian in 200 metres',
          'Latin Bridge and the assassination of 1914',
          'City Hall and the Sarajevo Haggadah',
        ],
        note: 'Long walking day on cobblestones — wear proper shoes.',
      },
      {
        id: 3,
        title: 'The Siege & The Mountain',
        city: 'Sarajevo',
        summary: 'Tunnel of Hope and Trebević mountain — the hardest emotional day.',
        photo: '/photos/empires-and-edge-day-3.jpg',
        accommodation: 'Hotel Hecco Deluxe, Sarajevo',
        meals: ['Breakfast'],
        includedActivities: ['Tunnel of Hope guided tour', 'Trebević mountain', 'Olympic bobsled track'],
        optionalActivities: ['Gallery 11/07/95 (Srebrenica)', 'Copper workshop in Kazandžiluk'],
        morning: 'Tunnel of Hope guided by a former defender. The 800-metre wartime lifeline that kept Sarajevo alive 1992–95.',
        afternoon: 'Drive up Trebević mountain to the Olympic bobsled track — now a graffiti corridor through the forest. Cable car back down. Free time for Gallery 11/07/95 (Srebrenica content — emotionally heavy, optional) or copper workshops in Kazandžiluk.',
        highlights: [
          'Tunnel of Hope guided by someone who lived it',
          'Trebević Olympic bobsled track',
          'Optional Srebrenica gallery (emotionally heavy)',
        ],
        note: 'Most emotionally demanding day. Opt-out available for any segment.',
      },
      {
        id: 4,
        title: 'Across the Drina',
        city: 'Belgrade',
        summary: "Cross into Serbia via the UNESCO bridge from Andrić's novel.",
        photo: '/photos/empires-and-edge-day-4.jpg',
        accommodation: 'Hotel Moskva, Belgrade',
        meals: ['Breakfast', 'Višegrad lunch'],
        includedActivities: ["Andrić's Bridge at Višegrad", 'Reading from the novel on site', 'Andrićgrad walk'],
        optionalActivities: ['Skadarlija evening (own arrangement)'],
        morning: "08:00 departure east through the Drina valley. 11:00 arrival at Višegrad — the Mehmed Paša Sokolović Bridge (UNESCO 1577). Reading aloud from Ivo Andrić's The Bridge on the Drina on the bridge itself.",
        afternoon: 'Lunch in Višegrad. 14:00 cross into Serbia. 17:30 arrive Belgrade. Walk to Skadarlija — the bohemian quarter — for dinner (own arrangement).',
        highlights: [
          "Andrić's bridge at Višegrad",
          'Reading from the novel on site',
          'Border crossing into Serbia',
          'Skadarlija bohemian quarter',
        ],
        note: 'Long transit day. Border crossing can add 30–60 minutes in summer.',
      },
      {
        id: 5,
        title: 'Belgrade & Departure',
        city: 'Belgrade',
        summary: 'Kalemegdan fortress and choice afternoon, then airport.',
        photo: '/photos/empires-and-edge-day-5.jpg',
        meals: ['Breakfast'],
        includedActivities: ['Kalemegdan fortress walk', 'Stari Grad tour', 'Private transfer to BEG airport'],
        optionalActivities: ["Museum of Yugoslavia & Tito's mausoleum", 'Nikola Tesla Museum'],
        morning: 'Kalemegdan fortress and walking tour of Stari Grad. The confluence of Sava and Danube — where the Balkans literally begin.',
        afternoon: "Choice: Museum of Yugoslavia and Tito's mausoleum, or Nikola Tesla Museum, or free time. Private transfer to Belgrade Nikola Tesla Airport (BEG) for evening flights.",
        highlights: [
          'Kalemegdan and the Sava–Danube confluence',
          'Choice afternoon — Tito or Tesla',
          'Private transfer to BEG',
        ],
        note: 'Departure flights from 18:00 onward recommended.',
      },
    ],

    inclusions: [
      '4 nights accommodation (twin share)',
      'Private vehicle and driver throughout',
      'English-speaking tour leader',
      'Daily breakfast',
      'Welcome dinner in Sarajevo',
      'Tunnel of Hope private slot',
      'Bosnian coffee ceremony',
      "Reading at the Andrić bridge",
      'Local specialist guides in Sarajevo and Belgrade',
      'Maximum 8 guests',
      'Free cancellation up to 60 days before',
    ],

    exclusions: [
      'International flights',
      'Travel insurance — mandatory',
      'Lunches and dinners except where specified',
      'Personal expenses',
      'Gratuities',
    ],

    breakdown: {
      accommodation: ['Hotel Hecco Deluxe, Sarajevo (Days 1–3)', 'Hotel Moskva, Belgrade (Days 4–5)'],
      meals: ['Welcome dinner (Day 1)', 'Daily breakfast', 'Višegrad lunch (Day 4)'],
      transport: ['Private vehicle and driver throughout', 'Arrival and departure private transfers'],
      destinations: ['Sarajevo', 'Tunnel of Hope', 'Višegrad (UNESCO Bridge)', 'Andrićgrad', 'Belgrade'],
      activities: ['Bosnian coffee ceremony', 'Between Empires Walking Tour', 'City Hall (Vijećnica)', 'Tunnel of Hope guided tour', 'Trebević mountain & Olympic bobsled track', "Andrić's Bridge at Višegrad", 'Andrićgrad walk', 'Kalemegdan fortress walk', 'Stari Grad Belgrade tour'],
      optional: ['Yellow Fortress walk', 'Gallery 11/07/95 (Srebrenica)', "Museum of Yugoslavia & Tito's mausoleum", 'Nikola Tesla Museum'],
    },

    activities: [
      { icon: 'coffee', name: 'Bosnian Coffee Ritual', description: 'The morning ceremony that defines daily life in Bosnia.' },
      { icon: 'history', name: 'Sarajevo Civilizations Walk', description: 'Ottoman bazaar to Austro-Hungarian boulevard in 200 metres.' },
      { icon: 'war', name: 'Tunnel of Hope', description: 'The wartime lifeline guided by a former defender.' },
      { icon: 'history', name: "Andrić's Bridge", description: 'Read aloud from The Bridge on the Drina at Višegrad.' },
      { icon: 'history', name: 'Kalemegdan Fortress', description: 'Where the Sava meets the Danube — and the Balkans literally begin.' },
      { icon: 'history', name: 'Museum of Yugoslavia', description: "The country that ended in 1991, told through Tito's mausoleum." },
    ],

    importantInfo: [
      { title: 'Free Cancellation', content: 'Free cancellation up to 60 days before departure. Cancellations 30–60 days lose 50%. Within 30 days non-refundable.' },
      { title: 'Group Size', content: 'Maximum 8 guests.' },
      { title: 'Border Crossings', content: 'This tour crosses one international border (Bosnia to Serbia). Passport with 6 months validity required.' },
      { title: 'Visas', content: 'Bosnia and Serbia are not in the EU. Most US, UK, and EU passports do not require visas.' },
      { title: 'What to Wear', content: 'Comfortable walking shoes essential. Modest dress for places of worship.' },
      { title: 'Joining Point', content: 'Sarajevo International Airport (SJJ) or central hotel. Confirmed 14 days before departure.' },
    ],

    dates: [
      { id: 1, date: 'April 25–29, 2026', spots: 8, total: 8 },
      { id: 2, date: 'May 2–6, 2026', spots: 8, total: 8 },
      { id: 3, date: 'May 16–20, 2026', spots: 8, total: 8 },
      { id: 4, date: 'June 6–10, 2026', spots: 8, total: 8 },
      { id: 5, date: 'September 5–9, 2026', spots: 8, total: 8 },
    ],

    mapWaypoints: [
      { lat: 43.8582, lng: 18.4313, label: 'Sarajevo Latin Bridge' },
      { lat: 43.8195, lng: 18.3367, label: 'Tunnel of Hope' },
      { lat: 43.7822, lng: 19.2867, label: 'Višegrad Bridge' },
      { lat: 44.8230, lng: 20.4495, label: 'Kalemegdan Belgrade' },
    ],
    mapProfile: 'driving-car',

    fitnessNotes: [
      {
        type: 'emotional',
        level: 'Contains emotionally heavy history',
        detail: 'This package includes the Siege of Sarajevo and Tunnel of Hope, covering wartime trauma and survival stories. Optional content covers the Srebrenica genocide. Opt-out available for any segment.',
      },
    ],

    suitability: {
      goodFor: [
        'Cultural travellers and history readers',
        'First-time visitors to the region',
        'Travellers who prefer depth over breadth',
        'Small group fans — maximum 8',
      ],
      thinkTwice: [
        'If wartime history is emotionally too heavy',
        'If you prefer beach or resort travel',
        'If 5 days feels too short to settle in',
      ],
    },
  },

  // ─── MOUNTAINS OF THE BALKANS ────────────────────────────────────────────
  {
    id: 6,
    slug: 'mountains-of-the-balkans',
    name: 'Mountains of the Balkans',
    subtitle: 'Belgrade to Kotor through Durmitor in 5 Days',
    duration: '5 Days',
    groupSize: 8,
    difficulty: 'Moderate',
    priceWithout: 1690,
    priceWith: 2090,
    rating: 5.0,
    reviews: 0,
    heroImage: package6Hero,
    gallery: [package6Hero],
    about: `Most travellers cross from Serbia to Montenegro in a hurry. This 5-day journey takes the long way — through the Sandžak, past the 13th-century White Angel fresco, into the highest town in the Balkans, and finally down through the Piva canyon to the walls of Kotor.

You will ride the Šargan 8 figure-8 mountain railway, walk the Black Lake at Durmitor, optionally raft the deepest canyon in Europe, and stand at Ostrog where a monastery has been built into a vertical cliff face. The Adriatic at the end is your reward.

Five days. Two countries. The mountains most operators skip.`,

    days: [
      {
        id: 1,
        title: 'Arrival in Belgrade',
        city: 'Belgrade',
        summary: 'Arrival and welcome dinner in the bohemian quarter.',
        photo: '/photos/mountains-of-the-balkans-day-1.jpg',
        accommodation: 'Hotel Moskva, Belgrade',
        meals: ['Welcome dinner'],
        includedActivities: ['Private arrival transfer', 'Welcome dinner in Skadarlija', 'Tour leader briefing'],
        optionalActivities: ['Knez Mihailova evening walk'],
        morning: 'Private transfer from Belgrade Nikola Tesla Airport (BEG) to your hotel in the central district.',
        afternoon: 'Free time to walk Knez Mihailova or rest after the flight. Welcome dinner with the group at 19:30 in Skadarlija.',
        highlights: [
          'Welcome dinner with the group',
          'First evening in Skadarlija',
          'Tour leader briefing',
        ],
        note: 'Welcome dinner at 19:30.',
      },
      {
        id: 2,
        title: 'South to Šargan 8',
        city: 'Zlatibor',
        summary: 'Drive south through Serbia plus the figure-8 mountain railway.',
        photo: '/photos/mountains-of-the-balkans-day-2.jpg',
        accommodation: 'Mountain Hotel, Zlatibor',
        meals: ['Breakfast', 'Sirogojno village lunch'],
        includedActivities: ['Sirogojno ethno-village', 'Šargan 8 railway (pre-booked)', 'Drvengrad wooden village'],
        optionalActivities: [],
        morning: '09:00 departure southwest. 13:00 arrival at Sirogojno open-air ethno-village — wooden houses and traditional cuisine: komplet lepinja, smoked pršut.',
        afternoon: '15:30 Mokra Gora — ride the Šargan 8 narrow-gauge railway. A figure-8 climb through 22 tunnels originally built in 1921 to connect Sarajevo and Belgrade. Optional Drvengrad.',
        highlights: [
          'Sirogojno ethno-village',
          'Šargan 8 figure-8 climb',
          'Drvengrad wooden village',
        ],
        note: 'Šargan 8 is pre-booked — train departures are fixed.',
      },
      {
        id: 3,
        title: 'White Angel to the Highest Town',
        city: 'Žabljak',
        summary: 'The Mileševa fresco then up to Žabljak at 1,450m.',
        photo: '/photos/mountains-of-the-balkans-day-3.jpg',
        accommodation: 'Hotel Durmitor, Žabljak',
        meals: ['Breakfast', 'Lunch in Pljevlja'],
        includedActivities: ['Mileševa Monastery & White Angel fresco', 'Montenegro border crossing'],
        optionalActivities: [],
        morning: '08:30 departure south through the Sandžak. 10:00 Mileševa Monastery — the White Angel fresco. One of the masterpieces of European medieval painting; used in the first satellite TV transmission to America in 1962.',
        afternoon: '12:00 cross into Montenegro. 14:00 lunch in Pljevlja. 17:00 arrive Žabljak — the highest town in the Balkans.',
        highlights: [
          'White Angel fresco at Mileševa',
          'Crossing the Sandžak',
          'Border into Montenegro',
          'Highest town in the Balkans',
        ],
        note: 'Long transit day. Altitude — drink water.',
      },
      {
        id: 4,
        title: 'Durmitor National Park',
        city: 'Žabljak',
        summary: 'Black Lake morning and choice afternoon with optional rafting.',
        photo: '/photos/mountains-of-the-balkans-day-4.jpg',
        accommodation: 'Hotel Durmitor, Žabljak',
        meals: ['Breakfast', 'Lunch', 'Sač lamb dinner'],
        includedActivities: ['Black Lake walk (3.7 km)', 'Group sač lamb dinner'],
        optionalActivities: ['Tara Canyon rafting — €55', 'Đurđevića bridge zipline', 'Curevac viewpoint hike'],
        morning: '09:00 Black Lake (Crno jezero) — easy 3.7 km loop walk. The signature glacial lake of Durmitor.',
        afternoon: 'Choice: Tara Canyon rafting, Class II–III — €55 supplement; Đurđevića Tara bridge zipline; or the Curevac viewpoint hike, moderate, 2 hrs. 20:00 group dinner — lamb under the sač.',
        highlights: [
          'Black Lake morning walk',
          'Optional Tara Canyon rafting',
          'Sač lamb dinner',
        ],
        note: 'Tara rafting cancels in heavy rain — backup is the bridge viewpoint.',
      },
      {
        id: 5,
        title: 'To the Adriatic',
        city: 'Kotor',
        summary: 'Piva canyon descent and Ostrog monastery — end in Kotor.',
        photo: '/photos/mountains-of-the-balkans-day-5.jpg',
        meals: ['Breakfast'],
        includedActivities: ['Piva canyon drive (56 tunnels)', 'Ostrog Monastery', 'Drop-off in Kotor or Tivat airport'],
        optionalActivities: [],
        morning: '09:00 descent through the Piva canyon — narrow road, 56 tunnels, one of the most spectacular drives in Europe.',
        afternoon: '12:30 Ostrog Monastery — built into a vertical cliff. The most important pilgrimage site in Montenegro. 17:30 arrive Kotor. Drop-off in old town for guests staying on, or transfer to Tivat Airport (TIV) for evening flights.',
        highlights: [
          'Piva canyon scenic drive',
          'Ostrog cliff monastery',
          'Arrival in Kotor (or Tivat airport)',
        ],
        note: 'Modest dress required at Ostrog. Departure flights from Tivat from 19:00 onward.',
      },
    ],

    inclusions: [
      '4 nights accommodation (twin share)',
      'Private vehicle and driver throughout',
      'English-speaking tour leader',
      'Daily breakfast',
      'Welcome dinner in Belgrade',
      '2 dinners in Žabljak',
      'Šargan 8 railway ticket',
      'All entry fees per itinerary',
      'Local specialist guide in Belgrade',
      'Maximum 8 guests',
      'Free cancellation up to 60 days before',
    ],

    exclusions: [
      'International flights',
      'Travel insurance — mandatory',
      'Lunches except where specified',
      'Optional Tara rafting — €55',
      'Personal expenses',
      'Gratuities',
    ],

    breakdown: {
      accommodation: ['Hotel Moskva, Belgrade (Day 1)', 'Mountain Hotel, Zlatibor (Day 2)', 'Hotel Durmitor, Žabljak (Days 3–4)', 'Drop-off in Kotor or Tivat Airport (Day 5)'],
      meals: ['Welcome dinner in Skadarlija, Belgrade (Day 1)', 'Daily breakfast', 'Sirogojno village lunch (Day 2)', 'Lunch in Pljevlja (Day 3)', 'Lunch & sač lamb dinner (Day 4)'],
      transport: ['Private vehicle and driver throughout', 'Arrival transfer from Belgrade airport'],
      destinations: ['Belgrade', 'Sirogojno', 'Šargan 8 & Drvengrad', 'Žabljak & Durmitor', 'Ostrog Monastery', 'Kotor'],
      activities: ['Welcome dinner in Skadarlija', 'Sirogojno ethno-village', 'Šargan 8 railway (pre-booked)', 'Drvengrad wooden village', 'Mileševa Monastery & White Angel fresco', 'Black Lake walk, Durmitor (3.7 km)', 'Sač lamb dinner (Žabljak)', 'Piva canyon drive (56 tunnels)', 'Ostrog Monastery guided visit'],
      optional: ['Tara Canyon rafting — €55', 'Đurđevića bridge zipline', 'Curevac viewpoint hike'],
    },

    activities: [
      { icon: 'history', name: 'Šargan 8 Railway', description: 'Figure-8 climb through 22 tunnels in the Mokra Gora hills.' },
      { icon: 'history', name: 'White Angel Fresco', description: 'The 13th-century Mileševa masterpiece.' },
      { icon: 'waterfall', name: 'Black Lake Walk', description: 'The signature glacial lake of Durmitor.' },
      { icon: 'rafting', name: 'Tara Canyon Rafting (Optional)', description: 'Class II–III rafting through the deepest canyon in Europe.' },
      { icon: 'history', name: 'Ostrog Monastery', description: 'The cliff-built pilgrimage site.' },
      { icon: 'history', name: 'Piva Canyon Drive', description: "56 tunnels through one of Europe's most spectacular gorges." },
    ],

    importantInfo: [
      { title: 'Free Cancellation', content: 'Free cancellation up to 60 days before departure.' },
      { title: 'Group Size', content: 'Maximum 8 guests.' },
      { title: 'Border Crossings', content: 'Crosses Serbia to Montenegro. Passport with 6 months validity required.' },
      { title: 'Visas', content: 'Most US, UK, and EU passports do not require visas for Serbia or Montenegro.' },
      { title: 'What to Wear', content: 'Layers — Žabljak (1,450m) is cool even in summer. Modest dress at Ostrog: covered shoulders and knees.' },
      { title: 'Departure', content: 'Day 5 ends in Kotor. Tivat Airport (TIV) is 8 km from Kotor old town. Evening flights from 19:00 onward recommended.' },
    ],

    dates: [
      { id: 1, date: 'May 6–10, 2026', spots: 8, total: 8 },
      { id: 2, date: 'May 20–24, 2026', spots: 8, total: 8 },
      { id: 3, date: 'June 10–14, 2026', spots: 8, total: 8 },
      { id: 4, date: 'September 9–13, 2026', spots: 8, total: 8 },
    ],

    mapWaypoints: [
      { lat: 44.8230, lng: 20.4495, label: 'Belgrade Kalemegdan' },
      { lat: 43.7178, lng: 19.6647, label: 'Sirogojno' },
      { lat: 43.7903, lng: 19.5092, label: 'Šargan 8 Mokra Gora' },
      { lat: 43.3656, lng: 19.6664, label: 'Mileševa Monastery' },
      { lat: 43.1547, lng: 19.0967, label: 'Black Lake Durmitor' },
      { lat: 42.6792, lng: 19.0294, label: 'Ostrog Monastery' },
      { lat: 42.4247, lng: 18.7712, label: 'Kotor' },
    ],
    mapProfile: 'driving-car',

    fitnessNotes: [
      {
        type: 'physical',
        level: 'Moderate — high altitude and walking',
        detail: 'Includes a 3.7 km loop walk at altitude (1,416m) and an optional moderate hike. Žabljak is at 1,450m — guests with serious cardiac or respiratory conditions should consult a doctor before booking.',
      },
    ],

    suitability: {
      goodFor: [
        'Active travellers in mid-fitness',
        'Mountain and nature lovers',
        'Travellers who want the road less driven',
        'Small group fans — maximum 8',
      ],
      thinkTwice: [
        'If altitude or moderate hiking is a concern',
        'If you prefer urban or coastal travel',
        'If 5 days of mountain transit feels too remote',
      ],
    },
  },

  // ─── ADRIATIC CROSSINGS ──────────────────────────────────────────────────
  {
    id: 7,
    slug: 'adriatic-crossings',
    name: 'Adriatic Crossings',
    subtitle: 'Kotor to Sarajevo Along the Coast in 6 Days',
    duration: '6 Days',
    groupSize: 8,
    difficulty: 'Easy',
    priceWithout: 1990,
    priceWith: 2590,
    rating: 5.0,
    reviews: 0,
    heroImage: package7Hero,
    gallery: [package7Hero],
    about: `Six days, four old towns, three countries, and one of the most beautiful drives in Europe. This journey starts in the walled bay of Kotor, crosses Lovćen to the Croatian coast, walks Dubrovnik at first light, tastes the parent grape of Zinfandel on Pelješac, and ends at the rebuilt Mostar bridge lit up at the farewell dinner.

You will climb 1,355 steps above Kotor, sail to Our Lady of the Rocks, hear Diocletian's Roman palace explained by someone whose family has lived inside it for generations, and stand at Blagaj where a river emerges from a cliff face at the foot of a Sufi tekija.

Six days. The Adriatic, the way it should be done — slowly, before the cruise ships arrive.`,

    days: [
      {
        id: 1,
        title: 'Arrival in Kotor',
        city: 'Kotor',
        summary: 'Arrival in Kotor and welcome dinner in the old town.',
        photo: '/photos/adriatic-crossings-day-1.jpg',
        accommodation: 'Hotel Vardar, Kotor',
        meals: ['Welcome dinner'],
        includedActivities: ['Private transfer from Tivat Airport', 'Welcome dinner inside the walls', 'Tour leader briefing'],
        optionalActivities: ['Evening stroll in Stari Grad'],
        morning: 'Private transfer from Tivat Airport (TIV) to your hotel inside or just outside the walled old town.',
        afternoon: 'Free time to walk the Stari Grad and orient yourself. Welcome dinner inside the walls at 19:30.',
        highlights: [
          'Welcome dinner inside the walls',
          'First evening in Kotor old town',
          'Tour leader briefing',
        ],
        note: 'Welcome dinner at 19:30.',
      },
      {
        id: 2,
        title: 'Walls & The Bay',
        city: 'Kotor',
        summary: 'The fortress climb at first light then a boat tour of the bay.',
        photo: '/photos/adriatic-crossings-day-2.jpg',
        accommodation: 'Hotel Vardar, Kotor',
        meals: ['Breakfast', 'Light lunch in Perast'],
        includedActivities: ["Saint John's fortress climb", 'Bay of Kotor boat tour', 'Our Lady of the Rocks', 'Cathedral of Saint Tryphon tour'],
        optionalActivities: [],
        morning: "08:30 climb the city walls to Saint John's fortress — 1,355 steps, 260m elevation. Best done early before heat.",
        afternoon: '11:00 boat tour of the Bay of Kotor — Perast and Our Lady of the Rocks. Light lunch in Perast. Afternoon walking tour: Cathedral of Saint Tryphon (1166), Maritime Museum, the Venetian lions on every gate.',
        highlights: [
          "Saint John's fortress climb",
          'Bay of Kotor boat tour',
          'Our Lady of the Rocks',
          'Cathedral of Saint Tryphon',
        ],
        note: 'Wall climb in heat is dangerous — early start non-negotiable in summer.',
      },
      {
        id: 3,
        title: 'Lovćen to Dubrovnik',
        city: 'Dubrovnik',
        summary: 'Twenty-five serpentines to the Njegoš mausoleum then north to Dubrovnik.',
        photo: '/photos/adriatic-crossings-day-3.jpg',
        accommodation: 'Hotel Adriatic, Dubrovnik',
        meals: ['Breakfast', 'Lunch in Cetinje'],
        includedActivities: ['Lovćen 25 serpentines', 'Njegoš Mausoleum (1,657m)', 'Sveti Stefan photo stop'],
        optionalActivities: ['Budva beach stop'],
        morning: '09:00 drive the 25 hairpin serpentines up to Lovćen National Park. 10:30 Njegoš Mausoleum at 1,657m. Panoramic view across to Albania.',
        afternoon: '13:00 lunch in Cetinje. 15:00 photo stop at Sveti Stefan and Budva. 17:30 cross into Croatia. 19:00 arrive Dubrovnik.',
        highlights: [
          'Lovćen 25 serpentines',
          'Njegoš Mausoleum at 1,657m',
          'Sveti Stefan photo stop',
          'Border into Croatia',
        ],
        note: 'Serpentines plus motion sickness — sit forward, ginger candy onboard.',
      },
      {
        id: 4,
        title: 'Dubrovnik',
        city: 'Dubrovnik',
        summary: 'Walls at first light and a free afternoon for Lokrum or Srđ.',
        photo: '/photos/adriatic-crossings-day-4.jpg',
        accommodation: 'Hotel Adriatic, Dubrovnik',
        meals: ['Breakfast'],
        includedActivities: ['City walls walk (1.94 km)', 'Old town guided tour'],
        optionalActivities: ['Lokrum island ferry', 'Mount Srđ cable car'],
        morning: '08:00 walk the city walls — 1.94 km loop. Early start mandatory in summer.',
        afternoon: "10:30 old town walking tour — Stradun, Onofrio's fountains, Rector's Palace, Franciscan monastery. Free afternoon: ferry to Lokrum island or cable car up Srđ for sunset.",
        highlights: [
          'Dubrovnik walls at first light',
          "Stradun and Rector's Palace",
          'Free afternoon — Lokrum or Srđ',
        ],
        note: 'Walls in summer heat — early start essential. Bring water.',
      },
      {
        id: 5,
        title: 'Pelješac to Split',
        city: 'Split',
        summary: "Ston walls, oysters, and Plavac Mali wine then Diocletian's Palace.",
        photo: '/photos/adriatic-crossings-day-5.jpg',
        accommodation: 'Hotel Split, Split',
        meals: ['Breakfast', 'Wine tasting & food pairing', 'Ston oysters'],
        includedActivities: ['Ston defensive walls', 'Pelješac Plavac Mali wine tasting', "Diocletian's Palace guided tour"],
        optionalActivities: ['Split Riva evening walk'],
        morning: '09:00 departure north. 10:30 Ston — the 5.5 km of medieval defensive walls and oysters from the bay below.',
        afternoon: "12:30 Pelješac peninsula wine tasting — Plavac Mali, the Croatian parent grape of Zinfandel and Primitivo. 18:00 arrive Split. Guided walk through Diocletian's Palace.",
        highlights: [
          'Ston defensive walls and oysters',
          'Pelješac Plavac Mali tasting',
          "Diocletian's Palace",
        ],
        note: 'Wine tasting includes food pairing.',
      },
      {
        id: 6,
        title: 'Mostar & Departure',
        city: 'Mostar',
        summary: 'Počitelj fortress, Blagaj tekija, Mostar bridge — and onward to Sarajevo.',
        photo: '/photos/adriatic-crossings-day-6.jpg',
        meals: ['Breakfast', 'Farewell dinner'],
        includedActivities: ['Počitelj cliff fortress', 'Blagaj Tekija', 'Stari Most tour', 'Farewell dinner over the lit bridge'],
        optionalActivities: ['Bridge diver watch — €25', 'Late transfer to Sarajevo (2.5 hrs)'],
        morning: '09:30 departure south. Cross back into Bosnia. 12:00 Počitelj cliff fortress.',
        afternoon: '14:30 Blagaj Tekija — the 16th-century Sufi dervish house at the source of the Buna river. 16:30 arrive Mostar. Walking tour of Stari Most — built 1566, destroyed 1993, rebuilt 2004. Farewell dinner overlooking the lit bridge. Late evening transfer to Sarajevo (130 km, 2.5 hrs) for next-day morning flights.',
        highlights: [
          'Počitelj cliff fortress',
          'Blagaj Sufi tekija',
          'Stari Most',
          'Farewell dinner over the lit bridge',
        ],
        note: 'Sarajevo transfer late evening Day 6, or extend in Mostar by one night — €140 supplement.',
      },
    ],

    inclusions: [
      '5 nights accommodation (twin share)',
      'Private vehicle and driver throughout',
      'English-speaking tour leader',
      'Daily breakfast',
      'Welcome dinner in Kotor and farewell dinner in Mostar',
      'Lunch in Perast',
      'Pelješac winery tasting with food pairing',
      'Boat tour of the Bay of Kotor',
      'Kotor and Dubrovnik wall tickets',
      'All entry fees per itinerary',
      'Local specialist guides in Kotor, Dubrovnik, Split, and Mostar',
      'Maximum 8 guests',
      'Free cancellation up to 60 days before',
    ],

    exclusions: [
      'International flights',
      'Travel insurance — mandatory',
      'Lunches except where specified',
      'Personal expenses',
      'Gratuities',
    ],

    breakdown: {
      accommodation: ['Hotel Vardar, Kotor (Days 1–2)', 'Hotel Adriatic, Dubrovnik (Days 3–4)', 'Hotel Split, Split (Day 5)', 'Mostar (optional extension — €140)'],
      meals: ['Welcome dinner inside the walls, Kotor (Day 1)', 'Daily breakfast', 'Light lunch in Perast (Day 2)', 'Lunch in Cetinje (Day 3)', 'Wine tasting & food pairing, Ston oysters (Day 5)', 'Farewell dinner over the lit bridge, Mostar (Day 6)'],
      transport: ['Private vehicle and driver throughout', 'Transfer from Tivat Airport on arrival'],
      destinations: ['Kotor & Bay of Kotor', 'Lovćen & Cetinje', 'Dubrovnik', 'Ston & Pelješac', 'Split', 'Počitelj', 'Blagaj', 'Mostar'],
      activities: ["Saint John's fortress climb (1,355 steps)", 'Bay of Kotor boat tour', 'Our Lady of the Rocks', 'Cathedral of Saint Tryphon tour', 'Lovćen 25 serpentines', 'Njegoš Mausoleum (1,657m)', 'Sveti Stefan photo stop', 'Dubrovnik city walls walk (1.94 km)', 'Old town guided tour', 'Ston defensive walls', 'Pelješac Plavac Mali wine tasting', "Diocletian's Palace guided tour", 'Počitelj cliff fortress', 'Blagaj Tekija', 'Stari Most Mostar tour', 'Farewell dinner over the lit bridge'],
      optional: ['Lokrum island ferry', 'Mount Srđ cable car', 'Bridge diver watch — €25', 'Budva beach stop'],
    },

    activities: [
      { icon: 'sunset', name: 'Kotor Walls Climb', description: '1,355 steps above the bay at first light.' },
      { icon: 'history', name: 'Bay of Kotor Boat Tour', description: 'Perast and Our Lady of the Rocks story.' },
      { icon: 'history', name: 'Lovćen & Njegoš', description: '25 serpentines to the mausoleum at 1,657m.' },
      { icon: 'history', name: 'Dubrovnik City Walls', description: 'The 1.94 km loop walked at first light.' },
      { icon: 'wine', name: 'Pelješac Wine Tasting', description: 'Plavac Mali — parent grape of Zinfandel and Primitivo.' },
      { icon: 'history', name: "Diocletian's Palace", description: 'Where 3,000 people still live inside Roman walls.' },
      { icon: 'waterfall', name: 'Blagaj Tekija', description: 'Where the Buna river emerges at 43 m³/sec at the foot of a Sufi tekija.' },
      { icon: 'history', name: 'Stari Most Mostar', description: 'The rebuilt 1566 bridge — destroyed 1993, restored 2004.' },
    ],

    importantInfo: [
      { title: 'Free Cancellation', content: 'Free cancellation up to 60 days before departure.' },
      { title: 'Group Size', content: 'Maximum 8 guests.' },
      { title: 'Border Crossings', content: 'Crosses Montenegro to Croatia and Croatia to Bosnia. Croatia is in the EU and Schengen.' },
      { title: 'Visas', content: 'Croatia: Schengen rules apply. Bosnia and Montenegro: most passports visa-free.' },
      { title: 'What to Wear', content: 'Comfortable walking shoes essential. Stairs and cobblestones throughout. Sun hat and water for the wall walks.' },
      { title: 'Joining Point', content: 'Tivat Airport (TIV) is 8 km from Kotor old town. Pickups can also be arranged from Dubrovnik or Podgorica with notice.' },
      { title: 'Departure', content: 'Day 6 ends in Mostar with optional late transfer to Sarajevo (130 km, 2.5 hrs). Sarajevo SJJ flights from 11:00 next day recommended, or extend in Mostar — €140 supplement.' },
    ],

    dates: [
      { id: 1, date: 'May 10–15, 2026', spots: 8, total: 8 },
      { id: 2, date: 'May 24–29, 2026', spots: 8, total: 8 },
      { id: 3, date: 'June 14–19, 2026', spots: 8, total: 8 },
      { id: 4, date: 'September 13–18, 2026', spots: 8, total: 8 },
    ],

    mapWaypoints: [
      { lat: 42.4247, lng: 18.7712, label: 'Kotor' },
      { lat: 42.3994, lng: 18.8389, label: 'Lovćen Njegoš' },
      { lat: 42.2553, lng: 18.8919, label: 'Sveti Stefan' },
      { lat: 42.6507, lng: 18.0944, label: 'Dubrovnik' },
      { lat: 42.8367, lng: 17.6963, label: 'Ston' },
      { lat: 42.9217, lng: 17.4378, label: 'Pelješac' },
      { lat: 43.5081, lng: 16.4402, label: 'Split Diocletian' },
      { lat: 43.0833, lng: 17.7333, label: 'Počitelj' },
      { lat: 43.2542, lng: 17.8819, label: 'Blagaj Tekija' },
      { lat: 43.3375, lng: 17.8150, label: 'Mostar Stari Most' },
    ],
    mapProfile: 'driving-car',

    fitnessNotes: [
      {
        type: 'physical',
        level: 'Moderate — stairs and cobblestones',
        detail: 'Includes 1,355 steps up Kotor walls (half-way option available) and the 1.94 km Dubrovnik wall loop. Cobblestones, hills, and stairs throughout the old towns. Guests with mobility issues should review the daily plan before booking.',
      },
    ],

    suitability: {
      goodFor: [
        'First-time visitors to the Adriatic',
        'Wine and food enthusiasts',
        'History readers and slow-travel fans',
        'Travellers who want depth on the coast, not just photos',
        'Small group fans — maximum 8',
      ],
      thinkTwice: [
        'If you cannot manage stairs and cobblestones',
        'If you prefer beach-resort travel over walking',
        'If 6 days feels too short to settle into each city',
      ],
    },
  },
]

const BREAKDOWN_CARDS = [
  { key: 'accommodation', label: 'Accommodation',        Icon: BedDouble,  color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'meals',         label: 'Meals',                Icon: Utensils,   color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'transport',     label: 'Transport',            Icon: Car,        color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'destinations',  label: 'Destinations',         Icon: MapPin,     color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'activities',    label: 'Included activities',  Icon: CheckCircle, color: '#2e7d5e', bg: 'rgba(46,125,94,0.09)' },
  { key: 'optional',      label: 'Optional activities',  Icon: Plus,       color: '#b8860b', bg: 'rgba(212,175,55,0.1)' },
]

const NAV_TABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'itinerary',   label: 'Itinerary' },
  { id: 'included',    label: "What's Included" },
  { id: 'suitability', label: 'Is This For You?' },
  { id: 'info',        label: 'Important Info' },
  { id: 'reviews',     label: 'Reviews' },
]

const NAVBAR_HEIGHT = 68

function SectionNav({ isMobile }) {
  const [activeId, setActiveId] = useState('overview')
  const [navbarVisible, setNavbarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-10% 0px -80% 0px' }
    )
    NAV_TABS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = (navbarVisible ? NAVBAR_HEIGHT : 0) + 48 + 8
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const sectionNavTop = navbarVisible ? NAVBAR_HEIGHT : 0

  return (
    <nav style={{
      ...navStyles.bar,
      top: `${sectionNavTop}px`,
      transition: 'top 0.3s ease',
    }}>
      <div style={{
        ...navStyles.inner,
        padding: isMobile ? '0 20px' : '0 40px',
      }}>
        {NAV_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              ...navStyles.tab,
              padding: isMobile ? '0 12px' : '0 16px',
              fontSize: isMobile ? '13px' : '14px',
              color: activeId === id ? 'var(--color-forest-green)' : 'var(--color-n500)',
              borderBottom: activeId === id
                ? '2px solid var(--color-forest-green)'
                : '2px solid transparent',
              fontWeight: activeId === id ? '600' : '400',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}

const navStyles = {
  bar: {
    position: 'sticky',
    zIndex: 95,
    backgroundColor: 'var(--color-n000)',
    borderBottom: '1px solid var(--color-n300)',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  inner: {
    display: 'flex',
    alignItems: 'stretch',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    gap: '0',
    minWidth: 'max-content',
  },
  tab: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '0 16px',
    height: '48px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s, border-bottom-color 0.15s',
    flexShrink: 0,
  },
}

function PackageDetail() {
  const { slug } = useParams()
  const pkg = packages.find((p) => p.slug === slug)
  const width = useWindowWidth()
  const isMobile = width <= 768
  const { stats } = useAllReviews()

  const [openDay, setOpenDay] = useState(1)
  const toggleDay = (id) => setOpenDay(prev => prev === id ? null : id)
  const [openInfo, setOpenInfo] = useState(null)
  const [includedExpanded, setIncludedExpanded] = useState(false)
  const [excludedExpanded, setExcludedExpanded] = useState(false)
  const { bookings, getSpotsLeft } = useAvailability()
  const { dates: departureDates, loading: datesLoading } = usePackageDates(pkg?.slug)

  const [calendarOpen, setCalendarOpen] = useState(false)
  const calendarWrapperRef = useRef(null)

  useEffect(() => {
    if (!calendarOpen) return
    function handleOutsideClick(e) {
      if (calendarWrapperRef.current && !calendarWrapperRef.current.contains(e.target)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [calendarOpen])

  const [formMode, setFormMode] = useState('booking') // 'booking' | 'enquiry'
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [withAccommodation, setWithAccommodation] = useState('without')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [enquiryName, setEnquiryName] = useState('')
  const [enquiryEmail, setEnquiryEmail] = useState('')
  const [enquiryText, setEnquiryText] = useState('')
  const [isEnquirySending, setIsEnquirySending] = useState(false)
  const [isEnquirySuccess, setIsEnquirySuccess] = useState(false)
  const [isEnquiryError, setIsEnquiryError] = useState(false)

  useEffect(() => {
    if (!pkg) return
    trackEvent('view_item', {
      currency: 'EUR',
      value: pkg.price,
      items: [{ item_id: pkg.slug, item_name: pkg.name, item_category: 'package', price: pkg.price }],
    })
  }, [pkg?.slug])

  const scrollFired = useRef(new Set())
  useEffect(() => {
    if (!pkg) return
    scrollFired.current = new Set()
    const thresholds = [25, 50, 75, 90]
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const pct = Math.round((window.scrollY / scrollable) * 100)
      thresholds.forEach((t) => {
        if (pct >= t && !scrollFired.current.has(t)) {
          scrollFired.current.add(t)
          trackEvent('scroll_depth', { page: pkg.slug, depth: t })
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pkg?.slug])

  if (!pkg) {
    return (
      <div style={styles.notFound}>
        <h2>Package not found</h2>
        <Link to="/multi-day-tours" style={styles.backLinkDark}>← Back to packages</Link>
      </div>
    )
  }

  const activePrice = withAccommodation === 'with' ? pkg.priceWith : pkg.priceWithout
  const totalPrice = activePrice * numPeople
  const spotsLeft = selectedDate ? getSpotsLeft(pkg.slug, selectedDate, selectedLanguage, pkg.groupSize) : null
  const maxPeople = spotsLeft != null ? Math.min(pkg.groupSize, spotsLeft) : pkg.groupSize

  const handleEnquiry = () => {
    if (!enquiryName || !enquiryEmail || !enquiryText) {
      alert('Please fill in all fields.')
      return
    }
    setIsEnquirySending(true)
    setIsEnquiryError(false)
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        tour_name: `${pkg.name} — ${pkg.subtitle}`,
        guest_name: enquiryName,
        guest_email: enquiryEmail,
        message: enquiryText,
        type: 'Enquiry',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => { setIsEnquirySending(false); setIsEnquirySuccess(true) })
    .catch(() => { setIsEnquirySending(false); setIsEnquiryError(true) })
  }

  const handleBooking = () => {
    if (!selectedDate || !guestName || !guestEmail) {
      alert('Please fill in your name, email, and select a date.')
      return
    }
    setIsSending(true)
    setIsError(false)

    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: totalPrice,
      items: [{ item_id: pkg.slug, item_name: pkg.name, item_category: 'package', price: pkg.price, quantity: numPeople }],
    })

    const templateParams = {
      type: 'Booking',
      tour_name: `${pkg.name} — ${pkg.subtitle}`,
      tour_date: selectedDate,
      num_people: numPeople,
      total_price: totalPrice,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || 'Not provided',
      discount_code: discountCode || 'None',
      language: selectedLanguage,
      accommodation: withAccommodation === 'with' ? 'With accommodation' : 'Without accommodation',
    }

    fetch(`https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/Bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          TourSlug: pkg.slug || pkg.id || '',
          TourName: `${pkg.name} — ${pkg.subtitle}`,
          TourDate: selectedDate,
          NumPeople: numPeople,
          TourType: 'package',
          TotalPrice: totalPrice,
          GuestName: guestName,
          GuestEmail: guestEmail,
          GuestPhone: guestPhone || '',
          DiscountCode: discountCode || '',
          Language: selectedLanguage,
          Accommodation: withAccommodation === 'with' ? 'With accommodation' : 'Without accommodation',
          Status: 'Pending',
        },
      }),
    }).catch((err) => console.warn('Airtable booking save failed:', err))

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).catch(() => {})

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setIsSending(false)
      setIsSuccess(true)
      trackEvent('purchase', {
        transaction_id: `${pkg.slug}-${Date.now()}`,
        currency: 'EUR',
        value: totalPrice,
        items: [{ item_id: pkg.slug, item_name: pkg.name, item_category: 'package', price: pkg.price, quantity: numPeople }],
      })
    })
    .catch(() => { setIsSending(false); setIsError(true) })
  }

  const bookingForm = (
    <div style={styles.bookingCard}>
      {isSuccess ? (
        <div style={styles.successMessage}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <CheckCircle size={40} color="var(--color-success)" />
          </div>
          <h3 style={styles.successTitle}>Request Received!</h3>
          <p style={styles.successText}>
            Thanks {guestName}. Your request for{' '}
            <strong>{pkg.name}</strong> on {selectedDate} for{' '}
            {numPeople} {numPeople === 1 ? 'person' : 'people'} has been
            received. You'll hear back within 24 hours.
          </p>
        </div>
      ) : isEnquirySuccess ? (
        <div style={styles.successMessage}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <CheckCircle size={40} color="var(--color-success)" />
          </div>
          <h3 style={styles.successTitle}>Enquiry Sent!</h3>
          <p style={styles.successText}>
            Thanks {enquiryName}. We've received your enquiry about <strong>{pkg.name}</strong> and will reply within 24 hours.
          </p>
        </div>
      ) : (
        <>
          {/* Mode toggle */}
          <div style={styles.modeToggle}>
            <button
              type="button"
              onClick={() => setFormMode('booking')}
              style={{
                ...styles.modeBtn,
                borderBottom: formMode === 'booking' ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: formMode === 'booking' ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontWeight: formMode === 'booking' ? '700' : '500',
              }}
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => setFormMode('enquiry')}
              style={{
                ...styles.modeBtn,
                borderBottom: formMode === 'enquiry' ? '2px solid var(--color-forest-green)' : '2px solid transparent',
                color: formMode === 'enquiry' ? 'var(--color-forest-green)' : 'var(--color-n500)',
                fontWeight: formMode === 'enquiry' ? '700' : '500',
              }}
            >
              Enquiry
            </button>
          </div>

          {/* ── ENQUIRY MODE ── */}
          {formMode === 'enquiry' ? (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  style={styles.input}
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@email.com"
                  style={styles.input}
                  value={enquiryEmail}
                  onChange={(e) => setEnquiryEmail(e.target.value)}
                />
              </div>
              <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
                <label style={styles.label}>Your Enquiry</label>
                <textarea
                  placeholder="Tell us what you'd like to know — dates, group size, customisations, anything."
                  style={{ ...styles.input, height: '110px', resize: 'vertical', paddingTop: '10px', lineHeight: '1.5' }}
                  value={enquiryText}
                  onChange={(e) => setEnquiryText(e.target.value)}
                />
              </div>
              <button
                style={{
                  ...styles.bookBtn,
                  opacity: isEnquirySending ? 0.7 : 1,
                  cursor: isEnquirySending ? 'not-allowed' : 'pointer',
                }}
                onClick={handleEnquiry}
                disabled={isEnquirySending}
                className="btn-lift btn-glow-amber"
              >
                {isEnquirySending ? 'Sending...' : 'Send Enquiry'}
              </button>
              {isEnquiryError && (
                <p style={styles.errorMessage}>Something went wrong. Please try again or email us directly.</p>
              )}
            </>
          ) : (
          <>
          {/* ── BOOKING MODE ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '600', color: 'var(--color-n700)' }}>
              Book a package
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: '600', color: 'var(--color-n600)' }}>
              Step {bookingStep} of 2
            </span>
          </div>

          {bookingStep === 1 ? (
            <>
              <div style={{ ...styles.formGroup, marginBottom: '12px' }}>
                <div style={styles.accomGrid}>
                  <button
                    type="button"
                    onClick={() => setWithAccommodation('without')}
                    style={{
                      ...styles.accomOption,
                      borderColor: withAccommodation === 'without' ? 'var(--color-forest-green)' : 'var(--color-n300)',
                      backgroundColor: withAccommodation === 'without' ? 'rgba(46,125,94,0.06)' : 'var(--color-n000)',
                    }}
                  >
                    <span style={{ ...styles.accomOptionTitle, color: withAccommodation === 'without' ? 'var(--color-forest-green)' : 'var(--color-n900)' }}>
                      Accommodation excluded
                    </span>
                    <span style={styles.accomOptionPrice}>
                      €{pkg.priceWithout}<span style={styles.accomPerPerson}>/person</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithAccommodation('with')}
                    style={{
                      ...styles.accomOption,
                      borderColor: withAccommodation === 'with' ? 'var(--color-forest-green)' : 'var(--color-n300)',
                      backgroundColor: withAccommodation === 'with' ? 'rgba(46,125,94,0.06)' : 'var(--color-n000)',
                    }}
                  >
                    <span style={{ ...styles.accomOptionTitle, color: withAccommodation === 'with' ? 'var(--color-forest-green)' : 'var(--color-n900)' }}>
                      4★ Hotel included
                    </span>
                    <span style={styles.accomOptionPrice}>
                      €{pkg.priceWith}<span style={styles.accomPerPerson}>/person</span>
                    </span>
                  </button>
                </div>
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '12px' }}>
                <label style={styles.label}>Tour Language</label>
                <div style={styles.pillGroup}>
                  {[
                    { id: 'english', label: 'English' },
                    { id: 'italian', label: 'Italian' },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                          setSelectedLanguage(lang.id)
                          const spots = getSpotsLeft(pkg.slug, selectedDate, lang.id, pkg.groupSize)
                          if (spots != null) setNumPeople((n) => Math.min(n, spots))
                        }}
                      style={{
                        ...styles.pillOption,
                        borderColor: selectedLanguage === lang.id ? 'var(--color-forest-green)' : 'var(--color-n300)',
                        backgroundColor: selectedLanguage === lang.id ? 'rgba(46,125,94,0.08)' : 'var(--color-n000)',
                        color: selectedLanguage === lang.id ? 'var(--color-forest-green)' : 'var(--color-n700)',
                        fontWeight: selectedLanguage === lang.id ? '600' : '500',
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ ...styles.formGroup, position: 'relative' }} ref={calendarWrapperRef}>
                <label style={styles.label}>Select a Date</label>
                <button
                  type="button"
                  style={{
                    ...styles.input,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: datesLoading ? 'default' : 'pointer',
                    textAlign: 'left',
                    color: selectedDate ? 'var(--color-n800)' : 'var(--color-n500)',
                  }}
                  onClick={() => !datesLoading && setCalendarOpen((v) => !v)}
                >
                  <span>
                    {datesLoading
                      ? 'Loading dates…'
                      : selectedDate
                        ? formatDepartureDate(selectedDate)
                        : 'Select a departure date'}
                  </span>
                  <ChevronDown
                    size={14}
                    color="var(--color-n500)"
                    style={{ flexShrink: 0, transform: calendarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </button>

                {isMobile && calendarOpen && (
                  <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 299 }}
                    onMouseDown={(e) => { e.stopPropagation(); setCalendarOpen(false) }}
                  />
                )}

                {calendarOpen && (
                  <div style={{
                    ...(isMobile ? {
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 'min(360px, calc(100vw - 32px))',
                      zIndex: 300,
                    } : {
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      right: 0,
                      zIndex: 200,
                    }),
                    backgroundColor: 'var(--color-n000)',
                    border: '1px solid var(--color-n300)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
                    overflow: 'hidden',
                    maxHeight: '320px',
                    overflowY: 'auto',
                  }}>
                    {isMobile && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 10px', borderBottom: '1px solid var(--color-n200)' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px', color: 'var(--color-n800)' }}>
                          Choose a date
                        </span>
                        <button
                          type="button"
                          onClick={() => setCalendarOpen(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-n500)' }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                    {departureDates.length === 0 ? (
                      <div style={{ padding: '20px 16px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-n500)' }}>
                        No upcoming dates —{' '}
                        <button
                          type="button"
                          onClick={() => { setCalendarOpen(false); setFormMode('enquiry') }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-forest-green)', fontWeight: '600', padding: 0, fontFamily: 'inherit', fontSize: 'inherit' }}
                        >
                          send an enquiry
                        </button>
                      </div>
                    ) : (
                      departureDates.map((date) => {
                        const spots = getSpotsLeft(pkg.slug, date, selectedLanguage, pkg.groupSize)
                        const isFull = spots === 0
                        const isLow = spots != null && spots > 0 && spots <= 3
                        const isSelected = selectedDate === date
                        return (
                          <button
                            key={date}
                            type="button"
                            disabled={isFull}
                            onClick={() => {
                              setSelectedDate(date)
                              setCalendarOpen(false)
                              if (spots != null) setNumPeople((n) => Math.min(n, spots))
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              borderBottom: '1px solid var(--color-n200)',
                              backgroundColor: isSelected ? 'rgba(46,125,94,0.06)' : isFull ? 'var(--color-n050, #fafafa)' : 'transparent',
                              cursor: isFull ? 'default' : 'pointer',
                              fontFamily: 'var(--font-body)',
                              textAlign: 'left',
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: isSelected ? '600' : '500', color: isFull ? 'var(--color-n400)' : isSelected ? 'var(--color-forest-green)' : 'var(--color-n800)' }}>
                              {formatDepartureDate(date)}
                            </span>
                            {isFull && (
                              <span style={{ fontSize: '12px', color: 'var(--color-n400)', fontWeight: '500' }}>Full</span>
                            )}
                            {isLow && (
                              <span style={{ fontSize: '12px', color: 'var(--color-amber)', fontWeight: '600' }}>{spots} spot{spots > 1 ? 's' : ''} left</span>
                            )}
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '12px' }}>
                <label style={styles.label}>Number of People</label>
                <div style={styles.stepper}>
                  <button
                    type="button"
                    disabled={numPeople <= 1}
                    onClick={() => setNumPeople((n) => Math.max(1, n - 1))}
                    style={{
                      ...styles.stepperBtn,
                      opacity: numPeople <= 1 ? 0.35 : 1,
                      cursor: numPeople <= 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={styles.stepperValue}>
                    {numPeople} {numPeople === 1 ? 'person' : 'people'}
                  </span>
                  <button
                    type="button"
                    disabled={numPeople >= maxPeople}
                    onClick={() => setNumPeople((n) => Math.min(maxPeople, n + 1))}
                    style={{
                      ...styles.stepperBtn,
                      opacity: numPeople >= maxPeople ? 0.35 : 1,
                      cursor: numPeople >= maxPeople ? 'not-allowed' : 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalPrice}>€{totalPrice}</span>
              </div>

              <button
                style={styles.bookBtn}
                className="btn-lift btn-glow-amber"
                onClick={() => {
                  if (!selectedDate) { alert('Please select a date.'); return }
                  setBookingStep(2)
                }}
              >
                Continue to Booking — €{totalPrice}
              </button>
            </>
          ) : (
            <>
              {/* Compact chip-style selection summary */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {[
                  { label: 'Date', value: selectedDate },
                  { label: 'Guests', value: `${numPeople} ${numPeople === 1 ? 'person' : 'people'}` },
                  { label: 'Accommodation', value: withAccommodation === 'with' ? 'With' : 'Without' },
                  { label: 'Language', value: selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1) },
                  { label: 'Total', value: `€${totalPrice}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: 'rgba(46,125,94,0.07)',
                    border: '1px solid rgba(46,125,94,0.18)',
                    borderRadius: '100px',
                    padding: '3px 10px',
                  }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-n600)' }}>{label}:</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '11px', color: 'var(--color-forest-green)' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  style={styles.input}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@email.com"
                  style={styles.input}
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  style={styles.input}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              <div style={{ ...styles.formGroup, marginBottom: '12px' }}>
                <label style={styles.label}>
                  Referral Code
                  <span style={styles.optional}> — optional</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HOTEL123"
                  style={styles.input}
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>

              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={styles.secondaryActionBtn}
                  className="btn-lift"
                  onClick={() => setBookingStep(1)}
                >
                  Back
                </button>
                <button
                  style={{
                    ...styles.bookBtn,
                    flex: 1,
                    marginBottom: 0,
                    opacity: isSending ? 0.7 : 1,
                    cursor: isSending ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleBooking}
                  disabled={isSending}
                  className="btn-lift btn-glow-amber"
                >
                  {isSending ? 'Sending...' : `Confirm & Book — €${totalPrice}`}
                </button>
              </div>
            </>
          )}

          {isError && (
            <p style={styles.errorMessage}>
              Something went wrong. Please try again or email us directly.
            </p>
          )}

          </>
          )}
        </>
      )}
    </div>
  )

  return (
    <div>

<SEO
  title={`${pkg.name} — ${pkg.subtitle}`}
  description={pkg.about.slice(0, 155).replace(/\n/g, ' ')}
  url={`/packages/${pkg.slug}`}
/>
<PackageSchema pkg={pkg} />
<PackageBreadcrumbSchema pkg={pkg} />

      <div style={{ ...styles.heroWrapper, height: isMobile ? '56vh' : '70vh' }}>
        <img src={pkg.heroImage} alt={pkg.name} style={styles.heroPhoto} />
        <div style={styles.heroGradient} />
        <div style={styles.heroGradientTop} />
        <div style={styles.heroBackLink}>
          <Link to="/multi-day-tours" style={styles.backLink}>← All Packages</Link>
        </div>
      </div>

      <SectionNav isMobile={isMobile} />

      <div style={{
        ...styles.contentCard,
        padding: isMobile ? '80px 20px 100px 20px' : '96px 40px 48px',
      }}>

        <div style={styles.titleBlock}>
          <div style={styles.titleLeft}>

            {/* Rating — above the title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Star size={15} color="var(--color-amber)" fill="var(--color-amber)" />
              <span style={styles.ratingNumber}>{stats[pkg.slug]?.avgRating ?? pkg.rating}</span>
              <span style={styles.ratingCount}>({stats[pkg.slug]?.count ?? pkg.reviews} reviews)</span>
            </div>

            {/* Title */}
            <h1 style={{
              ...styles.packageTitle,
              fontSize: isMobile ? '28px' : '44px',
            }}>
              {pkg.name}
            </h1>

            {/* Subtitle */}
            {pkg.subtitle && (
              <p style={styles.packageSubtitleText}>{pkg.subtitle}</p>
            )}

            {/* Meta pills — difficulty, duration, group size */}
            <div style={styles.metaPillRow}>
              <span style={styles.metaPill}>
                <Compass size={13} color="var(--color-forest-green)" />
                {pkg.difficulty}
              </span>
              <span style={styles.metaPill}>
                <Clock size={13} color="var(--color-forest-green)" />
                {pkg.duration}
              </span>
              <span style={styles.metaPill}>
                <Users size={13} color="var(--color-forest-green)" />
                Max {pkg.groupSize} people
              </span>
            </div>

          </div>
        </div>

        <div style={{
          ...styles.contentGrid,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
          gap: isMobile ? '32px' : '48px',
          marginTop: '40px',
        }}>

          {/* ── LEFT COLUMN ── */}
          <div style={styles.leftColumn}>

           {/* Gallery — full-bleed carousel, no card wrapper */}
{pkg.gallery && pkg.gallery.length > 0 && (
  <Gallery images={pkg.gallery} alt={pkg.name} />
)}

            {/* Overview: About + Activities */}
            <div id="overview" style={styles.section}>
              <h2 style={styles.sectionTitle}>About this package</h2>
              {pkg.about.split('\n\n').map((paragraph, index) => (
                <p key={index} style={styles.bodyText}>{paragraph}</p>
              ))}
            </div>

            {/* Activities & Experiences */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Activities & experiences</h2>
              <div style={{
                ...styles.activitiesGrid,
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              }}>
                {pkg.activities.map((activity, index) => {
                  const Icon = activityIconMap[activity.icon]
                  return (
                    <div key={index} style={styles.activityCard}>
                      <div style={styles.activityIconWrapper}>
                        {Icon && <Icon size={18} color="var(--color-forest-green)" strokeWidth={1.8} />}
                      </div>
                      <div>
                        <h4 style={styles.activityName}>{activity.name}</h4>
                        <p style={styles.activityDesc}>{activity.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Fitness / content warnings */}
            {pkg.fitnessNotes && pkg.fitnessNotes.length > 0 && (
              <div style={styles.section}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.fitnessNotes.map((note) => (
                    <div key={note.level} style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      backgroundColor: note.type === 'emotional' ? 'rgba(221,107,32,0.06)' : 'rgba(46,125,94,0.06)',
                      borderLeft: `3px solid ${note.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)'}`,
                      borderRadius: '0 var(--radius) var(--radius) 0',
                      padding: '16px 20px',
                    }}>
                      <AlertTriangle
                        size={18}
                        color={note.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)'}
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                      <div>
                        <span style={{
                          display: 'block',
                          fontFamily: 'var(--font-display)',
                          fontWeight: '700',
                          fontSize: '14px',
                          color: note.type === 'emotional' ? 'var(--color-warning)' : 'var(--color-forest-green)',
                          marginBottom: '6px',
                        }}>
                          {note.level}
                        </span>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          color: 'var(--color-n600)',
                          lineHeight: '1.65',
                          margin: 0,
                        }}>
                          {note.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Route map — only if package has waypoints */}
            {pkg.mapWaypoints && pkg.mapWaypoints.length > 0 && (
              <Suspense fallback={null}>
                <RouteMap waypoints={pkg.mapWaypoints} profile={pkg.mapProfile} />
              </Suspense>
            )}

            {/* Day by Day Itinerary */}
            <div id="itinerary" style={styles.section}>
              <h2 style={styles.sectionTitle}>Day by day itinerary</h2>
              <div style={styles.timelineList}>
                {pkg.days.map((day, index) => {
                  const isOpen = openDay === day.id
                  const isLast = index === pkg.days.length - 1
                  return (
                    <div key={day.id} style={{ ...styles.timelineItem, paddingBottom: isLast ? '0' : '12px' }}>
                      {/* Card */}
                      <div
                        className={`itinerary-card${isOpen ? ' is-open' : ''}`}
                        style={styles.timelineContent}
                        onClick={() => toggleDay(day.id)}
                      >
                        {/* Header */}
                        <div style={styles.timelineHeader}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                              <span style={styles.dayChip}>Day {day.id}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={11} color="var(--color-n400)" />
                                <span style={styles.cityInline}>{day.city}</span>
                              </div>
                            </div>
                            <span style={styles.dayTitle}>{day.title}</span>
                            <p style={styles.daySummary}>{day.summary}</p>
                          </div>
                          <div style={{ flexShrink: 0, alignSelf: 'flex-start', paddingTop: '3px' }}>
                            {isOpen
                              ? <ChevronUp size={18} color="var(--color-forest-green)" />
                              : <ChevronDown size={18} color="var(--color-n600)" />
                            }
                          </div>
                        </div>

                        {/* Expanded body */}
                        {isOpen && (
                          <div className="itinerary-body" style={styles.timelineBody}>
                            {/* Divider */}
                            <div style={{ height: '1px', backgroundColor: 'var(--color-n200)', margin: '4px 0 4px' }} />

                            {/* Day photo */}
                            {day.photo && (
                              <div style={{ marginBottom: '12px' }}>
                                <img
                                  src={day.photo}
                                  alt={day.title}
                                  style={styles.dayPhoto}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    const ph = e.currentTarget.nextSibling
                                    if (ph) ph.style.display = 'flex'
                                  }}
                                />
                                <div style={{ ...styles.dayPhoto, display: 'none', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-n100)', color: 'var(--color-n400)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
                                  Photo coming soon
                                </div>
                              </div>
                            )}


                            {day.morning && (
                              <div style={styles.timeBlock}>
                                <div style={styles.timeLabelRow}>
                                  <span style={{ ...styles.timeDot, backgroundColor: 'rgba(241,196,15,0.7)' }} />
                                  <span style={styles.timeLabel}>Morning</span>
                                </div>
                                <p style={styles.timeContent}>{day.morning}</p>
                              </div>
                            )}
                            {day.afternoon && (
                              <div style={styles.timeBlock}>
                                <div style={styles.timeLabelRow}>
                                  <span style={{ ...styles.timeDot, backgroundColor: 'rgba(46,125,94,0.5)' }} />
                                  <span style={styles.timeLabel}>Afternoon</span>
                                </div>
                                <p style={styles.timeContent}>{day.afternoon}</p>
                              </div>
                            )}
                            {day.note && (
                              <div style={styles.dayNote}>
                                <p style={styles.dayNoteText}>{day.note}</p>
                              </div>
                            )}

                            {/* Included & optional activities */}
                            {(day.includedActivities?.length > 0 || day.optionalActivities?.length > 0) && (
                              <>
                                <div style={{ height: '1px', backgroundColor: 'var(--color-n200)' }} />
                                {day.includedActivities?.length > 0 && (
                                  <div style={styles.activitiesBlock}>
                                    <span style={styles.activitiesLabel}>Included activities</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {day.includedActivities.map((act, i) => (
                                        <div key={i} style={styles.activityRow}>
                                          <CheckCircle size={12} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
                                          <span style={styles.activityText}>{act}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {day.optionalActivities?.length > 0 && (
                                  <div style={styles.activitiesBlock}>
                                    <span style={styles.activitiesLabelOptional}>Optional activities</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {day.optionalActivities.map((act, i) => (
                                        <div key={i} style={styles.activityRow}>
                                          <Plus size={12} color="var(--color-amber)" style={{ flexShrink: 0 }} />
                                          <span style={styles.activityText}>{act}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {(day.accommodation || day.meals?.length > 0) && (
                              <>
                                <div style={{ height: '1px', backgroundColor: 'var(--color-n200)' }} />
                                <div style={styles.logisticsBar}>
                                  {day.accommodation && (
                                    <div style={styles.logisticChip}>
                                      <BedDouble size={13} color="var(--color-forest-green)" style={{ flexShrink: 0 }} />
                                      <span style={styles.logisticText}>{day.accommodation}</span>
                                    </div>
                                  )}
                                  {day.meals?.length > 0 && (
                                    <div style={styles.logisticChip}>
                                      <Utensils size={13} color="var(--color-n600)" style={{ flexShrink: 0 }} />
                                      <span style={styles.logisticText}>{day.meals.join(' · ')}</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* What's Included */}
            <div id="included" style={styles.section}>
              <h2 style={styles.sectionTitle}>What's included</h2>

              {/* Breakdown rows — or fallback to flat inclusions list */}
              <div style={{ marginTop: '8px' }}>
                {pkg.breakdown
                  ? BREAKDOWN_CARDS.map(({ key, label, Icon, color }) => {
                      const items = pkg.breakdown[key] || []
                      if (!items.length) return null
                      const isOptional = key === 'optional'
                      return (
                        <div key={key} style={{
                          display: 'grid',
                          gridTemplateColumns: isMobile ? '1fr' : '148px 1fr',
                          gap: isMobile ? '4px' : '24px',
                          padding: '14px 0',
                          borderBottom: '1px solid var(--color-n200)',
                          alignItems: 'flex-start',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: isMobile ? '0' : '1px' }}>
                            <Icon size={14} color={isOptional ? '#b8860b' : 'var(--color-forest-green)'} style={{ flexShrink: 0 }} />
                            <span style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: '700',
                              fontSize: '13px',
                              color: isOptional ? '#b8860b' : 'var(--color-n700)',
                            }}>{label}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: isMobile ? '22px' : '0' }}>
                            {items.map((item, i) => (
                              <span key={i} style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                color: 'var(--color-n600)',
                                lineHeight: '1.55',
                              }}>{item}</span>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  : (includedExpanded ? pkg.inclusions : pkg.inclusions.slice(0, 6)).map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '12px 0',
                        borderBottom: '1px solid var(--color-n200)',
                      }}>
                        <CheckCircle size={14} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.5' }}>{item}</span>
                      </div>
                    ))
                }

                {/* Not included row */}
                {pkg.exclusions?.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '148px 1fr',
                    gap: isMobile ? '4px' : '24px',
                    padding: '14px 0',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: isMobile ? '0' : '1px' }}>
                      <XCircle size={14} color="var(--color-n400)" style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '13px', color: 'var(--color-n500)' }}>Not included</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: isMobile ? '22px' : '0' }}>
                      {pkg.exclusions.map((item, i) => (
                        <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n500)', lineHeight: '1.55' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {!pkg.breakdown && pkg.inclusions.length > 6 && (
                  <button style={showMoreBtnStyle} onClick={() => setIncludedExpanded(v => !v)}>
                    {includedExpanded ? 'Show less' : `See ${pkg.inclusions.length - 6} more`}
                  </button>
                )}
              </div>
            </div>

            {/* Is This For You? */}
            {pkg.suitability && (
              <div id="suitability" style={styles.section}>
                <h2 style={styles.sectionTitle}>Is this trip right for you?</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '16px',
                  marginTop: '16px',
                }}>
                  {/* Good for */}
                  <div style={{
                    backgroundColor: 'rgba(46,125,94,0.06)',
                    border: '1px solid rgba(46,125,94,0.2)',
                    borderRadius: 'var(--radius)',
                    padding: '16px 18px',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: '700',
                      fontSize: '13px',
                      color: 'var(--color-forest-green)',
                      margin: '0 0 12px 0',
                    }}>This trip is for you if…</p>
                    {pkg.suitability.goodFor.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < pkg.suitability.goodFor.length - 1 ? '8px' : 0 }}>
                        <CheckCircle size={15} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.55', margin: 0 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {/* Think twice */}
                  <div style={{
                    backgroundColor: 'var(--color-n100)',
                    border: '1px solid var(--color-n300)',
                    borderRadius: 'var(--radius)',
                    padding: '16px 18px',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: '700',
                      fontSize: '13px',
                      color: 'var(--color-n600)',
                      margin: '0 0 12px 0',
                    }}>This trip may not be right if…</p>
                    {pkg.suitability.thinkTwice.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: i < pkg.suitability.thinkTwice.length - 1 ? '8px' : 0 }}>
                        <XCircle size={15} color="var(--color-n300)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-n600)', lineHeight: '1.55', margin: 0 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Important Information — Tabs */}
            <div id="info" style={styles.section}>
              <h2 style={styles.sectionTitle}>Important Information</h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '20px',
                marginTop: '12px',
              }}>
                {pkg.importantInfo.map((info, index) => {
                  const isActive = openInfo === index || (openInfo === null && index === 0)
                  return (
                    <button
                      key={index}
                      onClick={() => setOpenInfo(index)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: '1.5px solid',
                        borderColor: isActive ? 'var(--color-forest-green)' : 'var(--color-n300)',
                        backgroundColor: isActive ? 'var(--color-forest-green)' : 'var(--color-n000)',
                        color: isActive ? '#fff' : 'var(--color-n600)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: isActive ? '600' : '400',
                        fontSize: 'var(--text-small)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {info.title}
                    </button>
                  )
                })}
              </div>
              {(() => {
                const activeIndex = openInfo === null ? 0 : openInfo
                const activeInfo = pkg.importantInfo[activeIndex]
                return (
                  <div style={{
                    padding: '20px',
                    backgroundColor: 'var(--color-n100)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-n200)',
                  }}>
                    <p style={styles.infoContent}>{activeInfo.content}</p>
                  </div>
                )
              })()}
            </div>

            {/* Package Reviews — approved reviews from Airtable + submission form */}
       <div id="reviews">
  <TourReviews tourId={pkg.slug} tourName={pkg.name} tourSlug={pkg.slug} basePath="/packages" />
</div>

          </div>

          {/* ── RIGHT COLUMN — Desktop only ── */}
          {!isMobile && (
            <div style={{ position: 'sticky', top: '124px', alignSelf: 'start' }}>
              {bookingForm}
            </div>
          )}

        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR ── */}
      {isMobile && (
        <div style={styles.mobileBottomBar}>
          <div style={styles.mobileBottomBarLeft}>
            <span style={styles.mobilePrice}>From €{pkg.priceWithout}</span>
            <span style={styles.mobilePricePer}>per person</span>
          </div>
          <button style={styles.mobileBookBtn} onClick={() => setDrawerOpen(true)} className="btn-lift btn-glow-amber">
            Book Now
          </button>
        </div>
      )}

      {/* ── MOBILE BOOKING DRAWER ── */}
      {isMobile && (
        <>
          <div
            style={{
              ...styles.drawerOverlay,
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: drawerOpen ? 'all' : 'none',
            }}
            onClick={() => setDrawerOpen(false)}
          />
          <div style={{
            ...styles.drawer,
            transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
          }}>
            <div style={styles.drawerHeader}>
              <div style={styles.drawerHandle} />
              <button style={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close booking form">
                <X size={20} color="var(--color-n600)" />
              </button>
            </div>
            <div style={styles.drawerContent}>
              {bookingForm}
            </div>
          </div>
        </>
      )}

    </div>
  )
}

const styles = {
  notFound: { padding: '80px 40px', textAlign: 'center' },

  heroWrapper: {
    position: 'relative',
    height: '70vh',
    minHeight: '400px',
    maxHeight: '680px',
    overflow: 'hidden',
  },

  heroPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },

  heroGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(247,249,252,1) 0%, transparent 100%)',
  },

  heroGradientTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '30%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
  },

  heroBackLink: { position: 'absolute', top: '24px', left: '40px', zIndex: 2 },

  backLink: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n000)',
    textDecoration: 'none',
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    padding: '6px 14px',
    borderRadius: '100px',
    border: '1px solid rgba(255,255,255,0.2)',
  },

  backLinkDark: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  contentCard: {
    backgroundColor: 'var(--color-n000)',
    marginTop: '-60px',
    borderRadius: '24px 24px 0 0',
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
  },

  titleBlock: { maxWidth: '1100px', margin: '0 auto' },
  titleLeft: { maxWidth: '680px' },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  packageTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-n900)',
    lineHeight: '1.15',
    marginBottom: '10px',
  },

  packageSubtitleText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: '1.6',
    marginBottom: '16px',
    marginTop: 0,
    maxWidth: '560px',
  },

  metaPillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },

  metaPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '100px',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n300)',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: '13px',
    color: 'var(--color-n900)',
  },

  packageSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    marginBottom: '12px',
  },

  ratingRow: { display: 'flex', alignItems: 'center', gap: '5px' },

  ratingNumber: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
  },

  ratingCount: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  contentGrid: {
    display: 'grid',
    maxWidth: '1100px',
    margin: '0 auto',
    alignItems: 'start',
  },

  leftColumn: { minWidth: 0 },

  section: {
    paddingBottom: '36px',
    marginBottom: '36px',
    borderBottom: '1px solid var(--color-n300)',
  },

  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '8px',
  },

  sectionSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    marginBottom: '16px',
  },

  bodyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '14px',
  },

  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '12px',
  },

  timelineItem: {
    paddingBottom: '10px',
  },


  timelineContent: {
    padding: '16px 18px',
    cursor: 'pointer',
  },

  timelineHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
  },

  timelineBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    paddingBottom: '4px',
  },

  cityTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(46,125,94,0.08)',
    padding: '3px 10px',
    borderRadius: '100px',
    flexShrink: 0,
  },

  cityLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
  },

  cityInline: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--color-n400)',
  },

  dayChip: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '22px',
    padding: '0 10px',
    borderRadius: '100px',
    backgroundColor: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    color: '#fff',
    letterSpacing: '0.5px',
    flexShrink: 0,
  },

  cityInline: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-n500)',
  },

  dayTitle: {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '17px',
    color: 'var(--color-n900)',
    lineHeight: '1.25',
  },

  daySummary: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n500)',
    margin: '8px 0 0 0',
    lineHeight: '1.55',
  },

  timeBlock: { display: 'flex', flexDirection: 'column', gap: '6px' },

  timeLabelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },

  timeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },

  timeLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'var(--color-n700)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },

  timeContent: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
    paddingLeft: '15px',
  },

  dayNote: {
    backgroundColor: 'rgba(241,196,15,0.08)',
    borderRadius: '8px',
    padding: '12px 14px',
    borderLeft: '3px solid var(--color-amber)',
  },

  dayNoteText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    margin: 0,
    lineHeight: 'var(--leading-body)',
    fontStyle: 'italic',
  },

  highlightsList: { display: 'flex', flexDirection: 'column', gap: '7px' },
  highlightItem: { display: 'flex', alignItems: 'center', gap: '9px' },

  highlightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  dayPhoto: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
  },

  logisticsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },

  logisticChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--color-n100)',
    border: '1px solid var(--color-n200)',
    borderRadius: '100px',
    padding: '4px 12px',
  },

  logisticText: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-n700)',
  },

  activitiesBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  activitiesLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: 'var(--color-forest-green)',
  },

  activitiesLabelOptional: {
    fontFamily: 'var(--font-display)',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: 'var(--color-amber)',
  },

  activityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  activityText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  inclusionsGrid: { display: 'grid', gap: '24px' },

  inclusionSubtitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'var(--color-success)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  exclusionSubtitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'var(--color-n600)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  inclusionsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  inclusionItem: { display: 'flex', alignItems: 'flex-start', gap: '10px' },

  inclusionText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    lineHeight: '1.5',
  },

  activitiesGrid: { display: 'grid', gap: '10px', marginTop: '16px' },

  activityCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '14px',
    backgroundColor: 'var(--color-n100)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-n300)',
  },

  activityIconWrapper: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'rgba(46,125,94,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  activityName: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    marginBottom: '4px',
  },

  activityDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    lineHeight: '1.5',
    margin: 0,
  },

  infoContent: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  suitabilityCard: {
    backgroundColor: 'var(--color-n000)',
    border: '1px solid var(--color-n300)',
    borderRadius: '12px',
    padding: '20px',
  },

  suitabilityCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '14px',
  },

  suitabilityCardLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '14px',
  },

  suitabilityList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  suitabilityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },

  suitabilityDotGreen: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-success)',
    flexShrink: 0,
    marginTop: '6px',
  },

  suitabilityDotAmber: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-warning)',
    flexShrink: 0,
    marginTop: '6px',
  },

  suitabilityText: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n600)',
    lineHeight: '1.65',
  },

  bookingCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    border: '1px solid var(--color-n300)',
  },

  modeToggle: {
    display: 'flex',
    gap: '0',
    marginBottom: '0',
  },

  modeBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '0 0 10px 0',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'color 0.15s, border-bottom-color 0.15s',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    marginBottom: '12px',
    marginTop: '4px',
  },

  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  price: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '26px',
    color: 'var(--color-forest-green)',
  },

  perPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px' },

  accomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },

  accomOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '4px',
    padding: '12px',
    borderRadius: '10px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    width: '100%',
  },

  accomOptionTitle: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '11px',
    lineHeight: '1.3',
    transition: 'color 0.15s ease',
    flex: 1,
  },

  accomOptionPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '18px',
    color: 'var(--color-n900)',
  },

  accomPerPerson: {
    fontFamily: 'var(--font-body)',
    fontWeight: '400',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },

  pillOption: {
    height: '36px',
    padding: '0 14px',
    borderRadius: '100px',
    border: '1.5px solid',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'border-color 0.15s, background-color 0.15s, color 0.15s',
  },

  stepper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--color-n300)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    height: '36px',
  },

  stepperBtn: {
    flexShrink: 0,
    width: '40px',
    height: '100%',
    border: 'none',
    backgroundColor: 'var(--color-n100)',
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: '400',
    color: 'var(--color-n800)',
    lineHeight: 1,
  },

  stepperValue: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-n900)',
    borderLeft: '1px solid var(--color-n300)',
    borderRight: '1px solid var(--color-n300)',
    userSelect: 'none',
  },

  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  optional: {
    fontWeight: '400',
    color: 'var(--color-n600)',
  },

  input: {
    height: '36px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 10px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    marginBottom: '8px',
  },

  totalLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
  },

  totalPrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-forest-green)',
  },

  bookBtn: {
    width: '100%',
    height: 'var(--touch-target)',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    marginBottom: '10px',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },

  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },

  secondaryActionBtn: {
    height: 'var(--touch-target)',
    padding: '0 18px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    backgroundColor: 'var(--color-n000)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    cursor: 'pointer',
    flexShrink: 0,
  },

  cancellationRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },

  freeCancellation: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-success)',
    margin: 0,
  },

  successMessage: { textAlign: 'center', padding: '16px 0' },

  successIcon: {
    display: 'block',
    fontSize: '40px',
    color: 'var(--color-success)',
    marginBottom: '12px',
  },

  successTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    marginBottom: '12px',
  },

  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  errorMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    textAlign: 'center',
    marginTop: '8px',
  },

  mobileBottomBar: {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    zIndex: 150,
    backgroundColor: 'var(--color-n000)',
    borderTop: '1px solid var(--color-n300)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
  },

  mobileBottomBarLeft: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' },

  mobilePrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-forest-green)',
    lineHeight: 1.1,
  },

  mobilePricePer: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: 'var(--color-n500)',
    lineHeight: 1,
  },

  mobileBookBtn: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
  },

  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    transition: 'opacity 0.3s ease',
  },

  drawer: {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    zIndex: 201,
    backgroundColor: 'var(--color-n000)',
    borderRadius: '20px 20px 0 0',
    maxHeight: '85vh',
    overflowY: 'auto',
    transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 20px 8px 20px',
    position: 'relative',
    flexShrink: 0,
  },

  drawerHandle: {
    width: '40px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: 'var(--color-n300)',
  },

  drawerClose: {
    position: 'absolute',
    right: '16px',
    top: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawerContent: {
    padding: '8px 20px 32px 20px',
    overflowY: 'auto',
  },
}

export default PackageDetail