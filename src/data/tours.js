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
    price: 29,
    rating: 4.9,
    reviews: 212,
    duration: '3 hours',
    groupSize: 8,
    badge: 'Bestseller',
    hero: tour1,       // The imported image is now just a variable
    description: 'Walk through the streets that witnessed the longest siege of a capital city in modern warfare. Your guide lived through it. This is not a history lesson — it is a personal story.',
    highlights: [
      'Latin Bridge — the spot where WWI began',
      'The Holiday Inn — command centre during the siege',
      'Sniper Alley — walked daily by civilians under fire',
      'Markale Market — site of the most devastating attacks',
      'The Tunnel of Life entrance point',
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
    price: 49,
    rating: 4.8,
    reviews: 98,
    duration: '8 hours',
    groupSize: 6,
    badge: 'Popular',
    hero: tour2,
    description: 'A full day trip to one of the most beautiful towns in the Balkans. Cross the iconic Stari Most, explore the old bazaar, and eat the best ćevapi of your trip.',
    highlights: [
      'Stari Most — the 16th century Ottoman bridge',
      'Kujundžiluk — the old bazaar street',
      'Koski Mehmed Pasha Mosque',
      'Local lunch included at a riverside restaurant',
      'Blagaj Tekke — the mystical dervish house',
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
    title: 'Tunnel of Hope Tour',
    price: 22,
    rating: 5.0,
    reviews: 45,
    duration: '2.5 hours',
    groupSize: 8,
    badge: 'New',
    hero: tour3,
    description: 'The tunnel that kept Sarajevo alive during the siege. Walk through history 800 metres underground and understand how an entire city survived against the odds.',
    highlights: [
      'Enter the original tunnel used during the siege',
      'Museum exhibits with personal artefacts',
      'Documentary film screening',
      'Q&A with your guide who lived through the siege',
    ],
    includes: [
      'Guide',
      'Museum entry',
      'Small group max 8',
      'Free cancellation 24h',
    ],
    meetingPoint: 'Tunnel Museum, Tuneli 1, Sarajevo',
  },
  {
    id: 4,
    title: 'Jewish Heritage of Sarajevo',
    price: 25,
    rating: 4.9,
    reviews: 67,
    duration: '2 hours',
    groupSize: 8,
    badge: null,
    hero: tour4,
    description: 'Sarajevo is one of the few European cities where a synagogue, mosque, Catholic and Orthodox church all stand within the same city block. This tour explains why.',
    highlights: [
      'The Old Synagogue — now a Jewish museum',
      'The Ashkenazi Synagogue still in use today',
      'The story of how Sarajevo sheltered Jews during WWII',
      'The four religions within one city block',
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
    price: 35,
    rating: 4.9,
    reviews: 89,
    duration: '3 hours',
    groupSize: 6,
    badge: 'Popular',
    hero: tour5,
    description: 'Bosnian food is one of the great undiscovered cuisines of Europe. Six stops, twelve tastings, and one very satisfied stomach.',
    highlights: [
      'Ćevapi at the oldest ćevabdžinica in Sarajevo',
      'Burek from a traditional pekara',
      'Begova čorba — the soup of the Bey',
      'Tufahija — the walnut-stuffed poached apple dessert',
      'Bosnian coffee ceremony',
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
    price: 18,
    rating: 4.8,
    reviews: 134,
    duration: '1.5 hours',
    groupSize: 10,
    badge: null,
    hero: tour6,
    description: 'The best view of Sarajevo costs nothing — except knowing where to go. End your day watching the city light up from the fortress that has overlooked it for centuries.',
    highlights: [
      'The Yellow Fortress panoramic viewpoint',
      'The old city walls and their history',
      'Alifakovac neighbourhood — the hidden residential quarter',
      'The best photography spots in the city',
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