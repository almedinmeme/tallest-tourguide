// src/data/tours.js
// Single source of truth for all tour data.
// Update tour content here — changes flow automatically
// to the Tours listing page, homepage featured section,
// and individual tour detail pages.

import tour1 from '../assets/tour-1-hero.webp'
import tour2 from '../assets/tour-2-hero.webp'
import tour3 from '../assets/tour-3-hero.webp'
import tour4 from '../assets/tour-4-hero.webp'
import tour5 from '../assets/tour-5-hero.webp'
import tour6 from '../assets/tour-6-hero.webp'
import tour7 from '../assets/tour-7-hero.webp'
import mostar1 from '../assets/mostar-1.webp'
import mostar2 from '../assets/mostar-2.webp'
import mostar3 from '../assets/mostar-3.webp'
import sarajevo1 from '../assets/sarajevo-1-grand.webp'
import sarajevo2 from '../assets/sarajevo-2-grand.webp'
import sarajevo3 from '../assets/sarajevo-3-grand.webp'
import cooking1 from '../assets/cooking-1-class.webp'
import cooking2 from '../assets/cooking-2-class.webp'
import cooking3 from '../assets/cooking-3-class.webp'
import cooking4 from '../assets/cooking-4-class.webp'
import cooking5 from '../assets/cooking-5-class.webp'
import cooking6 from '../assets/cooking-6-class.webp'
import cooking7 from '../assets/cooking-7-class.webp'
import cooking8 from '../assets/cooking-8.webp'
import lukomir1 from '../assets/lukomir-1.webp'
import lukomir2 from '../assets/lukomir-2.webp'
import lukomir3 from '../assets/lukomir-3.webp'
import lukomir4 from '../assets/lukomir-4.webp'
import lukomir5 from '../assets/lukomir-5.webp'
import srebrenica1 from '../assets/srebrenica-1.webp' 
import srebrenica2 from '../assets/srebrenica-2.webp' 
import srebrenica3 from '../assets/srebrenica-3.webp' 
import srebrenica4 from '../assets/srebrenica-4.webp' 
import srebrenica5 from '../assets/srebrenica-5.webp' 
import srebrenica6 from '../assets/srebrenica-6.webp' 
import srebrenica7 from '../assets/srebrenica-7.webp' 
import jewish1 from '../assets/jewish-1.webp' 
import jewish2 from '../assets/jewish-2.webp' 
import jewish3 from '../assets/jewish-3.webp' 
import jewish4 from '../assets/jewish-4.webp' 
import jewish5 from '../assets/jewish-5.webp' 
import jewish6 from '../assets/jewish-6.webp' 
import jewish7 from '../assets/jewish-7.webp' 
import morning1 from '../assets/morning-1.webp' 
import morning2 from '../assets/morning-2.webp' 
import morning3 from '../assets/morning-3.webp' 
import morning4 from '../assets/morning-4.webp' 
import morning5 from '../assets/morning-5.webp' 
import morning6 from '../assets/morning-6.webp' 
import morning7 from '../assets/morning-7.webp' 
import jajce1 from '../assets/jajce-1.webp'
import jajce2 from '../assets/jajce-2.webp' 
import jajce3 from '../assets/jajce-3.webp' 
import jajce4 from '../assets/jajce-4.webp' 
import jajce5 from '../assets/jajce-5.webp' 
import jajce6 from '../assets/jajce-6.webp' 
import jajce7 from '../assets/jajce-7.webp' 
import jajce8 from '../assets/jajce-8.webp' 
import siege1 from '../assets/siege-1.webp' 
import siege2 from '../assets/siege-2.webp'
import siege3 from '../assets/siege-3.webp'
import siege4 from '../assets/siege-4.webp'
import siege5 from '../assets/siege-5.webp'
import siege6 from '../assets/siege-6.webp'
import siege7 from '../assets/siege-7.webp'



const tours = [
  {
    id: 1,
    slug: 'sarajevo-walking-tour',
    category: 'city-walks',
    title: 'Essential Sarajevo Walking Tour: History, Culture & the Full Story',
    price: 25,
    rating: 5,
    reviews: 12,
    duration: '3 hours',
    groupSize: 12,

    badge: 'Essential',
    hero: tour1,
    detailHero: tour1,
    description: 'This tour is built around a different pace and a different mindset. It\'s for travelers who notice details, ask questions, and want to feel a place rather than move through it. Over three hours, Sarajevo opens gradually—through conversations, quiet corners, and moments that connect history with everyday life.\n\nA planned food stop and a traditional coffee degustation are part of the experience, giving context to how Sarajevo is lived, not just seen. By the end, the city feels familiar in a way most visitors don\'t reach—its contrasts make sense, and its story stays with you.\n\n Small group, local guide, no rushed stops. This is the most detailed Sarajevo walking experience available—built for the 10% of visitors who want the whole story.',
    highlights: [
      'Latin Bridge & Assassination Site — Stand where Archduke Franz Ferdinand was shot in 1914, the spark that ignited World War I.',
      'Baščaršija Old Bazaar — Sarajevo\'s beating heart since the 15th century. Cobblestones, coffee, and crafts still alive today.',
      'Coppersmith Street (Kazandžiluk) — Hammered copper souvenirs made by hand, a trade unchanged for over 500 years.',
      'Gazi Husrev-Bey Mosque — Built in 1531, this remains the architectural and spiritual anchor of the old town, balancing Ottoman design with continuous religious use.',
      'Gazi Husrev-Bey Bezistan — A covered 16th-century market where silk and spice routes once crossed.',
      'Old Orthodox Church — One of the oldest in the region, quietly holding centuries of Sarajevo\'s Serbian heritage.',
      'Jewish Quarter — A rare testament to Sephardic history in the heart of the Balkans, layered with resilience.',
      'Sarajevo Cathedral — The most important catholic cathedral in Bosnia, a graceful anchor of Catholic presence in the city.',
      'Hotel Europe — Opened during Austro-Hungarian rule, this landmark represents the city\'s shift toward Central European elegance.',
      'City Hall (Vijećnica) — A stunning neo-Moorish building, rebuilt after wartime destruction, now a symbol of recovery.',
    ],
    includes: [
      'Local guide',
      'Small group max 12',
      'Walking tour',
      'Free cancellation 24h',
    ],
    excludes: [
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
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['10 AM', '05 PM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'First-time visitors wanting the full story of Sarajevo',
      'History and culture enthusiasts who notice details',
      'Travelers who prefer a relaxed, unhurried pace',
      'Anyone who wants context, not just checkpoints',
    ],
    notRightFor: [
      'Guests looking for a fast highlights-only overview',
      'Those with significant mobility limitations (cobblestone terrain)',
      'Guests who prefer solo exploration over guided storytelling',
    ],
    accessibility: {
      walking: '2–3 km on mostly flat ground',
      terrain: 'Cobblestone streets through the old town; no steep climbs',
      wheelchairFriendly: false,
      notes: 'Comfortable walking shoes strongly recommended. Not suitable for wheelchairs due to cobblestone surfaces.',
    },
    subtitle: 'Sarajevo Unveiled: A Walk Through Cultures, Centuries & Crossroads',
    gallery: [
  { src: tour1, caption: 'Latin Bridge, where WWI began in 1914.' },
  { src: sarajevo1, caption: 'Baščaršija — the old bazaar built in the 15th century.' },
  sarajevo2, sarajevo3
],
    mapWaypoints: [
      { lat: 43.8582, lng: 18.4313, label: 'Latin Bridge' },
      { lat: 43.8594, lng: 18.4324, label: 'Baščaršija' },
      { lat: 43.8589, lng: 18.4279, label: 'Gazi Husrev-beg Mosque' },
      { lat: 43.8597, lng: 18.4341, label: 'City Hall (Vijećnica)' },
      { lat: 43.8613, lng: 18.4272, label: 'Yellow Fortress' },
    ],
    mapProfile: 'foot-walking',
  },
   {
    id: 2,
    slug: 'mostar-day-trip-from-sarajevo',
    category: 'day-trips',
    title: 'Mostar Day Trip from Sarajevo: Old Bridge, Kravice & Herzegovina',
    price: 65,
    rating: 5.0,
    reviews: 18,
    duration: 'Full day',
    groupSize: 12,

    badge: 'Bestseller',
    hero: tour5,
    detailHero: tour5,
    description: 'Most first-time visitors to Bosnia come expecting history. They leave talking about the water. This full-day tour from Sarajevo takes you deep into Herzegovina — a landscape of impossible turquoise rivers, medieval fortresses, and a bridge so beautiful it was rebuilt from memory after war destroyed it. Every stop earns its place on this route.\n\nDeparting Sarajevo in the morning, you travel south through changing terrain, stopping at Konjic\'s old bridge and Jablanica\'s open-air war museum, before the route opens into Herzegovina. Počitelj\'s hilltop fortress, the spring at Blagaj Buna rising from a cliff face, the cascading waterfalls at Kravice, and finally Mostar — its Old Bridge, its bazaar, its divers — all within a single, full day. This is Bosnia at its most visually stunning.',
    highlights: [
      'Konjic — A charming riverside town with its own restored Ottoman bridge, a perfect first taste of what Herzegovina has in store.',
      'Jablanica — Home to the legendary WWII battle site where Tito\'s partisans crossed the Neretva. The destroyed bridge still stands as a monument.',
      'Počitelj — A fortified medieval village frozen in time, climbing up a limestone hill with panoramic views over the Neretva river valley.',
      'Blagaj Buna — A 16th-century Dervish monastery built into a cliff above one of Europe\'s largest freshwater springs. Quietly breathtaking.',
      'Kravice Waterfalls — A series of cascading falls spilling into a vivid emerald pool. One of Bosnia\'s most spectacular natural sights.',
      'Mostar Old Bridge (Stari Most) — The iconic 16th-century bridge, rebuilt after its 1993 destruction, arching over the Neretva.',
    ],
    includes: [
      'Local guide',
      'Small group max 12',
      'Transport in AC Vehicle',
      'Free cancellation 24h',
    ],
    excludes: [
      'Entrance fees to Kravice Waterfalls (20 BAM/10 EUR)',
      'Lunch',
      'Gratuities (optional but appreciated)',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'How long is the full day tour and what time does it return to Sarajevo?',
        answer: 'The tour departs Sarajevo in the morning and returns in the early evening, typically around 10-12 hours in total. Exact timing will be confirmed at booking.',
      },
      {
        question: 'Is swimming at Kravice Waterfalls included or optional?',
        answer: 'Swimming at Kravice is possible during warmer months and is entirely optional. Bringing a swimsuit and a small towel is recommended if you\'d like to take a dip.',
      },
      {
        question: 'Is this tour suitable for first-time visitors who don\'t know much about Bosnian history?',
        answer: 'It is designed exactly for them. The guide provides context at every stop — history, culture, and local stories — without overwhelming. You leave with a genuine feel for the country, not just photographs of it.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'First-time visitors wanting to see Herzegovina in a single day',
      'Nature lovers drawn to turquoise rivers and waterfalls',
      'Those with one full day to experience Bosnia beyond Sarajevo',
      'Anyone curious about Ottoman history and architecture',
    ],
    notRightFor: [
      'Guests who prefer slow, deep single-location experiences',
      'Those prone to motion sickness (mountain road driving)',
      'Travelers who have already visited Mostar and Kravice',
    ],
    accessibility: {
      walking: 'Moderate walking at each stop (1–2 km per location)',
      terrain: 'Steep cobblestone streets in Počitelj and Mostar; flatter terrain at Kravice',
      wheelchairFriendly: false,
      notes: 'Several sites involve uneven terrain and steep paths. Not suitable for guests with significant mobility limitations.',
    },
    subtitle: 'Rivers, Ruins & the Old Bridge: A Full Day Through the Heart of Herzegovina',
    gallery: [tour5,mostar1,mostar2,mostar3],
    mapWaypoints: [
      { lat: 43.8563, lng: 18.4132, label: 'Sarajevo' },
      { lat: 43.6579, lng: 17.9621, label: 'Konjic' },
      { lat: 43.1219, lng: 17.7315, label: 'Počitelj' },
      { lat: 43.1367, lng: 17.6017, label: 'Kravice Waterfalls' },
      { lat: 43.2534, lng: 17.9052, label: 'Blagaj' },
      { lat: 43.3370, lng: 17.8156, label: 'Mostar Old Bridge' },
    ],
    mapProfile: 'driving-car',
  },
 
 {
    id: 8,
    slug: 'lukomir-hike-bosnia',
    category: 'adventure',
    title: 'Lukomir Hike: Full Day Trek to Bosnia\'s Highest Mountain Village',
    price: 65,
    rating: 5.0,
    reviews: 4,
    duration: 'Full day',
    groupSize: 12,

    badge: 'Active',
    hero: lukomir1,
    detailHero: lukomir5,
    description: 'Lukomir sits at 1,469 metres above sea level on the edge of the Rakitnica Canyon — the deepest and most untouched river canyon in the western Balkans. It is the highest permanently inhabited village in Bosnia, and in many ways it feels like the rest of the world simply forgot to arrive. Stone houses, traditional dress, shepherds moving across the plateau exactly as their grandparents did. Getting there on foot makes it mean something entirely different than arriving any other way.The route follows the canyon rim through the Bjelašnica plateau, with open mountain views that stretch further than you expect and a silence that takes some adjusting to. The hike is moderate — rewarding for those with some trail experience, manageable for anyone in good shape who takes it at their own pace. Lunch is taken in the village itself, with a local family. You descend with the kind of tiredness that feels earned, and a view of Bosnia that very few visitors ever reach.',
    highlights: [
      'Bjelašnica Plateau — The hike opens across one of Bosnia\'s most dramatic high-altitude landscapes, wide open and quietly overwhelming in every direction.',
      'Rakitnica Canyon Rim — The trail follows the edge of the deepest untouched canyon in the western Balkans — a drop so vast it takes a moment to fully register.',
      'Traditional Bosnian Countryside — Between trailhead and village, the landscape passes through meadows, shepherd paths, and highland terrain unchanged for centuries.',
      'Lukomir Village — Bosnia\'s highest permanently inhabited settlement, where stone houses, traditional dress, and a pace of life entirely its own still exist without performance.',
      'Lunch Prepared by Locals — A home-cooked meal inside the village, prepared by residents. Simple, seasonal, and one of the most grounding moments of the entire day.',
      'Canyon Viewpoints — Several natural stopping points along the rim offer unobstructed views deep into the Rakitnica gorge — the kind that stay with you long after the hike ends.',
    ],
    fitnessNote: {
      type: 'physical',
      level: 'Moderate fitness required',
      detail: 'This tour involves approximately 12–14 km of hiking on mountain terrain with uneven paths and moderate elevation gain across the Bjelašnica plateau. Guests should be comfortable walking for 4–5 hours. Not suitable for guests with significant mobility limitations, heart conditions, or those uncomfortable on rocky mountain paths.',
    },
    includes: [
      'Experienced mountain trained local guide',
      'Return transport from Sarajevo',
      'Small group max 12',
      'Free cancellation 24h',
    ],
    excludes: [
      'Lunch in home of Lukomir residents (approx. 10-15 BAM/5-7 EUR)',
      'Gratuities (optional but appreciated)',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'How long is the hike and how much elevation is involved?',
        answer: 'The full route covers approximately 12–14 km with moderate elevation gain across the Bjelašnica plateau. The total day, including transport from Sarajevo, lunch, and the return, runs around 8–10 hours.',
      },
      {
        question: 'Is any special equipment required for this hike?',
        answer: 'Sturdy trail or hiking shoes are essential. Layers are strongly recommended — plateau weather changes quickly regardless of season. Trekking poles are optional but helpful on the canyon rim sections.',
      },
      {
        question: 'Is this hike suitable for someone who doesn\'t hike regularly but is reasonably fit?',
        answer: 'Yes, with the right preparation. The trail is moderate rather than technical — no climbing or scrambling involved. A reasonable base fitness level and proper footwear will carry most people through comfortably. Your guide sets a pace that works for the group.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'Active travelers comfortable with mountain terrain and long walks',
      'Anyone seeking a genuinely off-the-beaten-path Bosnia experience',
      'Nature and mountain lovers who want views that feel earned',
      'Guests with a full day and reasonable trail fitness',
    ],
    notRightFor: [
      'Guests not comfortable with 4–5 hours of continuous walking',
      'Those with mobility limitations, heart conditions, or knee problems',
      'Children under 10 or guests unaccustomed to mountain conditions',
    ],
    accessibility: {
      walking: '12–14 km on mountain terrain over a full day',
      terrain: 'Uneven highland paths, plateau, and canyon rim; no technical climbing',
      wheelchairFriendly: false,
      notes: 'Not suitable for guests with mobility limitations. Sturdy hiking footwear and layered clothing are essential.',
    },
    subtitle: 'There Is a Village in Bosnia That Time Completely Missed. You Can Walk There.',
    gallery: [lukomir1, lukomir2, lukomir3,lukomir4, lukomir5],
    mapWaypoints: [
      { lat: 43.8563, lng: 18.4132, label: 'Sarajevo' },
      { lat: 43.7089, lng: 18.2731, label: 'Bjelašnica' },
      { lat: 43.7061, lng: 18.3131, label: 'Lukomir Trailhead' },
    ],
    mapProfile: 'driving-car',
  },
    {
    id: 4,
    slug: 'bosnian-cooking-class-sarajevo',
    category: 'food-culture',
    title: 'Bosnian Cooking Class in Sarajevo: Burek, Klepe & Local Home Dining',
    price: 45,
    rating: 5.0,
    reviews: 8,
    duration: '4 hours',
    groupSize: 6,

    badge: 'Authentic',
    hero: cooking4,
    detailHero: tour7,
    description: 'There is a version of travel where you eat at the right places, see the right things, and still feel like an outsider. This is not that. In a warm Sarajevo home, your host welcomes you with traditional Bosnian coffee and the kind of unhurried hospitality that cannot be staged.\n\nWhat follows is three to four hours of cooking, storytelling, and sitting down together over a meal you made with your own hands. You will learn to stretch burek dough the way it has been done for generations, fold klepe dumplings by hand, and prepare a seasonal dish — stuffed peppers, Begova čorba, or sataraš — chosen by your host based on what is fresh. Everything bakes, simmers, and comes together while conversation flows naturally. You finish with sutlijaš or hurmašice, homemade juice, and the particular satisfaction of a meal that meant something.',
    highlights: [
      'Traditional Bosnian Coffee Welcome — The experience opens the Bosnian way — slowly, warmly, with coffee prepared in a džezva and stories already beginning.',
      'Seasonal Starter Dish — Cook a traditional recipe chosen by your host — stuffed peppers, sataraš, or Begova čorba — based on the season.',
      'Handmade Burek or Bosnian Pita — Learn to stretch and fill dough entirely by hand, mastering a technique passed down through generations.',
      'Klepe Dumplings from Scratch — Fold and cook delicate meat or vegetable dumplings — one of Bosnia\'s most beloved comfort foods.',
      'Three-Course Shared Meal — Sit down and enjoy everything you prepared together, paired with homemade juices.',
      'Traditional Desserts — End with sutlijaš or hurmašice, sweet, simple, and the kind of finish that makes the whole experience linger.',
    ],
    includes: [
      'Family home hosted',
      'Small group max 6',
      'AC transportation',
      'Free cancellation 48h',
    ],
    excludes: [
      'Gratuities (optional but appreciated)',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'Do I need any cooking experience to join this experience?',
        answer: 'None at all. Your host guides every step with patience and warmth. The focus is on connection and enjoyment — not technique. If you can stretch dough and laugh at the same time, you are fully qualified.',
      },
      {
        question: 'Can dietary requirements or preferences be accommodated?',
        answer: 'Yes. Vegetarian fillings for burek and klepe are available. Please mention any dietary needs at the time of booking so your host can prepare accordingly.',
      },
      {
        question: 'How many people participate in the cooking experience?',
        answer: 'This is an intimate experience designed for small groups — typically two to six guests. It takes place in a private Sarajevo home, so the atmosphere stays personal and unhurried throughout.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['04 PM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'Food lovers wanting a genuine local kitchen experience',
      'Couples and small groups seeking intimate cultural immersion',
      'Families with children who enjoy hands-on activities',
      'Anyone who believes the best way into a culture is through its food',
    ],
    notRightFor: [
      'Guests expecting restaurant-style dining rather than home cooking',
      'Those with severe allergies to dairy or meat (vegetarian options available, but the kitchen works with animal products)',
      'Anyone looking for outdoor sightseeing rather than an indoor experience',
    ],
    accessibility: {
      walking: 'None — the experience takes place in a private home',
      terrain: 'Indoor, ground floor',
      wheelchairFriendly: true,
      notes: 'Fully accessible. Please mention any mobility or dietary requirements at the time of booking.',
    },
    subtitle: 'The Best Meal in Sarajevo Isn\'t in a Restaurant. It\'s in Someone\'s Home.',
    gallery: [cooking1, cooking2, cooking3, cooking4, cooking5, cooking6, cooking7],
    mapWaypoints: [
      { lat: 43.8595, lng: 18.4257, label: 'Markale Market' },
      { lat: 43.8594, lng: 18.4324, label: 'Guide\'s Home (Baščaršija area)' },
    ],
    mapProfile: 'foot-walking',
  },
    {
    id: 5,
    slug: 'jajce-travnik-day-trip-sarajevo',
    category: 'day-trips',
    title: 'Jajce & Travnik Day Trip from Sarajevo: Medieval Bosnia Full Day Tour',
    price: 65,
    rating: 5.0,
    reviews: 12,
    duration: 'Full day',
    groupSize: 12,

    badge: null,
    hero: jajce1,
    detailHero: jajce5,
    description: 'Long before modern borders were drawn, Bosnia had its own medieval kingdom — with royal cities, fortress towns, and a landscape that made it nearly unconquerable. This full-day tour from Sarajevo takes you to two of its most remarkable survivors: Jajce, the last capital of the Bosnian kingdom, and Travnik, the seat of Ottoman viziers for over a century. Two towns, two eras, one extraordinary day.\n\nThe route winds through central Bosnia with a stop at Visoko — home to the controversial Bosnian pyramids — before arriving at Jajce, where a waterfall tumbles directly into the town center and the Pliva lakes mirror the sky just minutes away. Travnik follows, with its colourful bazaar, the birthplace of Nobel laureate Ivo Andrić, and a fortress that has watched over the valley for 600 years. This is Bosnia that most visitors never reach — and never stop thinking about.',
    highlights: [
      'Visoko (optional) — A thought-provoking stop at the site of the so-called Bosnian Pyramids, one of the most debated archaeological mysteries in Europe.',
      'Jajce Old Town — The royal capital of the last Bosnian kingdom, a walled hilltop town where medieval streets and Ottoman layers exist side by side.',
      'Jajce Waterfall — One of the rarest sights in Europe — a full river waterfall crashing into the heart of a living town.',
      'Pliva Lakes — Two glacial lakes just outside Jajce, calm and mirror-flat, surrounded by old watermills that still stand at the water\'s edge.',
      'Travnik Castle — A commanding 15th-century fortress rising above Travnik, offering sweeping views over the valley and the old bazaar below.',
      'Travnik Old Town — Birthplace of Ivo Andrić, Nobel Prize winner, and a town rich with Ottoman architecture and living tradition.',
    ],
    includes: [
      'Local guide',
      'Small group max 12',
      'Transport in AC Vehicle',
      'Free cancellation 24h',
    ],
    excludes: [
      'Museums and castle entrances',
      'Lunch',
      'Gratuities (optional but appreciated)',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'Is prior knowledge of Bosnian medieval history needed to enjoy this tour?',
        answer: 'Not at all. The guide builds the story from the ground up — connecting the kingdoms, the Ottoman era, and the landscape in a way that makes everything click, even for first-time visitors.',
      },
      {
        question: 'Is the Visoko pyramid stop confirmed or truly optional?',
        answer: 'It is an optional addition depending on group interest and timing. If included, your guide will present the site honestly — covering both the archaeological debate and what is definitively known — so you can form your own view.',
      },
      {
        question: 'Is this tour physically demanding?',
        answer: 'There is moderate walking involved, including some uphill paths at Jajce and Travnik Castle. The pace is relaxed and manageable for most fitness levels. Comfortable walking shoes are strongly recommended.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'History enthusiasts curious about medieval Bosnia and the Ottoman era',
      'Travelers on longer Bosnia trips wanting to see central Bosnia',
      'Those drawn to dramatic landscapes and fortified hilltop towns',
      'Anyone who prefers layered historical storytelling over beach or nightlife',
    ],
    notRightFor: [
      'Guests who have already visited both Jajce and Travnik',
      'Those prone to motion sickness on winding mountain roads',
      'Visitors expecting mostly flat, easy walking throughout',
    ],
    accessibility: {
      walking: 'Moderate walking with uphill climbs at castle sites',
      terrain: 'Cobblestone and uneven paths; steep climb to Travnik Castle',
      wheelchairFriendly: false,
      notes: 'The castle climbs involve steps and uneven ground. Comfortable walking shoes are essential.',
    },
    subtitle: 'Kings, Castles & Waterfalls: A Full Day in Medieval Bosnia',
    gallery: [jajce1, jajce2, jajce3, jajce4, jajce5, jajce6, jajce7, jajce8, tour6, ],
    mapWaypoints: [
      { lat: 43.8563, lng: 18.4132, label: 'Sarajevo' },
      { lat: 44.1188, lng: 17.7891, label: 'Visoko' },
      { lat: 44.2272, lng: 17.6636, label: 'Travnik' },
      { lat: 44.3388, lng: 17.2710, label: 'Jajce Waterfall' },
    ],
    mapProfile: 'driving-car',
  },

    {
    id: 6,
    slug: 'sarajevo-morning-walk-tour',
    category: 'city-walks',
    title: 'Sarajevo Morning Walk Tour: Sarajevo Before the Crowds',
    price: 15,
    rating: 5.0,
    reviews: 8,
    duration: '1.5 hours',
    groupSize: 12,

    badge: 'Early Bird',
    hero: morning7,
    detailHero: morning7,
    description: 'Sarajevo is a compact crossroads of empires, faiths, and centuries — and this two-hour morning walking tour is built for travelers who want context, not just checkpoints. The city at this hour belongs to you — before the crowds arrive, before the heat settles, before Baščaršija fills with the noise of the day. \n\n From the Latin Bridge, where a single act in 1914 reshaped global history, through the Ottoman lanes of the old bazaar, past mosques, churches, and synagogues that still function side by side, to a final viewpoint over the valley. Craft streets that never industrialized. Markets that once linked trade routes. A city defined by what it survived. For early risers who want the best version of every place they visit. Small group, local guide, steady pace.',
    highlights: [
    'Latin Bridge & Assassination Site — Stand where Archduke Franz Ferdinand was shot in 1914, the spark that ignited World War I.',
      'Baščaršija Old Bazaar — Sarajevo\'s beating heart since the 15th century. Cobblestones, coffee, and crafts still alive today.',
      'Coppersmith Street (Kazandžiluk) — Hammered copper souvenirs made by hand, a trade unchanged for over 500 years.',
      'Gazi Husrev-Bey Mosque — Built in 1531, this remains the architectural and spiritual anchor of the old town, balancing Ottoman design with continuous religious use.',
      'Gazi Husrev-Bey Bezistan — A covered 16th-century market where silk and spice routes once crossed.',
      'Old Orthodox Church — One of the oldest in the region, quietly holding centuries of Sarajevo\'s Serbian heritage.',
      'Jewish Quarter — A rare testament to Sephardic history in the heart of the Balkans, layered with resilience.',
      'Sarajevo Cathedral — The most important catholic cathedral in Bosnia, a graceful anchor of Catholic presence in the city.',
      'Hotel Europe — Opened during Austro-Hungarian rule, this landmark represents the city\'s shift toward Central European elegance.',
      'City Hall (Vijećnica) — A stunning neo-Moorish building, rebuilt after wartime destruction, now a symbol of recovery.'
    ],
    includes: [
      'Local guide',
      'Small group max 12',
      'Walking tour',
      'Free cancellation 24h',
    ],
    excludes: [
      'Gratuities (optional but appreciated)',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'Is this tour suitable for people who don\'t know much about Sarajevo\'s history?',
        answer: 'Absolutely. The tour is built around discovery — no prior knowledge needed. Your guide connects the dots between cultures, eras, and stories as you walk.',
      },
      {
        question: 'How much walking is involved? Is it suitable for all fitness levels?',
        answer: 'The route covers roughly 2–3 km at a relaxed pace through the old town. Comfortable shoes are recommended; suitable for most fitness levels with basic mobility.',
      },
      {
        question: 'Are entrance fees to mosques or other sites included?',
        answer: 'The tour includes access to outdoor areas and select interiors. Some religious sites may request a small voluntary donation — your guide will let you know in advance.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'Early risers who want Sarajevo before the crowds arrive',
      'Budget-conscious travelers wanting a short, high-value city orientation',
      'Guests with limited time who want the essential story in 90 minutes',
      'Those who enjoy cities at their quietest and most authentic',
    ],
    notRightFor: [
      'Guests who prefer sleeping in or evening activities',
      'Those wanting deep historical immersion (see the 3-hour Essential tour)',
      'Guests looking for food stops or tastings along the route',
    ],
    accessibility: {
      walking: '2–3 km at a relaxed pace through the old town',
      terrain: 'Cobblestone streets; mostly flat with no steep climbs',
      wheelchairFriendly: false,
      notes: 'Comfortable walking shoes recommended. Manageable for most fitness levels.',
    },
    subtitle: '90 minutes. Four centuries. One city unlike any other.',
    gallery: [morning1,morning2,morning3,morning4,morning5,morning6,morning7,tour2],
    mapWaypoints: [
      { lat: 43.8582, lng: 18.4313, label: 'Latin Bridge' },
      { lat: 43.8594, lng: 18.4324, label: 'Baščaršija' },
      { lat: 43.8589, lng: 18.4279, label: 'Gazi Husrev-beg Mosque' },
      { lat: 43.8597, lng: 18.4341, label: 'City Hall (Vijećnica)' },
    ],
    mapProfile: 'foot-walking',
  },
    {
    id: 7,
    slug: 'sarajevo-jewish-heritage-tour',
    category: 'history',
    title: 'Sarajevo Jewish Heritage Tour: Synagogues, Museum & the Haggadah',
    price: 29,
    rating: 5.0,
    reviews: 11,
    duration: '3-4 hours',
    groupSize: 12,

    badge: null,
    hero: jewish2,
    detailHero: jewish5,
    description: 'Sarajevo has been home to Jewish communities since the 16th century, when Sephardic Jews expelled from Spain found refuge here — welcomed in a way much of Europe refused to offer. This half-day tour traces that unbroken thread, from the oldest synagogue in the Balkans to a cemetery that holds five centuries of stories. It is not a history lesson. It is a conversation with the past that still echoes today.\n\nOver three to four hours, you will visit the Jewish Museum of Bosnia and Herzegovina, the grand Ashkenazi Synagogue, the Kal Grande — the Great Sephardic Synagogue — and the historic Jewish Cemetery on the hillside above the city. Where possible, the tour includes a viewing of the Sarajevo Haggadah, one of the oldest and most traveled Jewish manuscripts in the world — a book that survived the Inquisition, World War II, and the siege of Sarajevo itself.',
    highlights: [
      'Jewish Museum of Bosnia and Herzegovina — Housed in the old Sephardic synagogue, it holds one of the richest Jewish collections in Southeast Europe.',
      'Ashkenazi Synagogue — A striking early 20th-century building marking the arrival of Central European Jewish communities in Sarajevo.',
      'Kal Grande — The Great Sephardic Synagogue, a cornerstone of Sarajevo\'s Jewish quarter and its community life for centuries.',
      'Jewish Cemetery Sarajevo — Perched on a hillside, this cemetery spans five centuries and offers a profound, panoramic place of reflection.',
      'Sarajevo Haggadah (if available) — One of the world\'s most remarkable Jewish manuscripts, safeguarded through wars, occupations, and sieges.',
    ],
    includes: [
      'Local guide',
      'Small group max 12',
      'Walking tour',
      'Free cancellation 24h',
    ],
    excludes: [
      'Entrance fees to Jewish Museum, Ashkenazi Synagogue, Haggadah',
      'Gratuities',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'Is this tour suitable for visitors with no prior knowledge of Jewish history in the Balkans?',
        answer: 'Yes. The guide provides full context throughout, making the experience meaningful whether you are visiting for personal heritage reasons or out of cultural curiosity.',
      },
      {
        question: 'Is the Sarajevo Haggadah viewing guaranteed?',
        answer: 'The Haggadah is housed at the National Museum of Bosnia and Herzegovina and access depends on museum scheduling. Your guide will confirm availability ahead of the tour and arrange the visit where possible.',
      },
      {
        question: 'Is this tour appropriate for older travelers or those with limited mobility?',
        answer: 'The tour includes some uphill walking, particularly to the Jewish Cemetery. The pace is relaxed and the guide is mindful of the group. Anyone with mobility concerns is encouraged to mention this at booking.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['10 AM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'Guests with Jewish heritage or a personal connection to Sephardic history',
      'History enthusiasts interested in diaspora, resilience, and identity',
      'Cultural travelers who want to understand Sarajevo beyond its Ottoman story',
      'Anyone moved by rare manuscripts and long, layered memory',
    ],
    notRightFor: [
      'Guests expecting a light sightseeing experience',
      'Those with significant mobility limitations (uphill walk to Jewish Cemetery)',
      'Guests looking for outdoor nature or active pursuits',
    ],
    accessibility: {
      walking: '3–4 km with one significant uphill section to the cemetery',
      terrain: 'Mixed surfaces; includes a moderately steep climb on uneven ground',
      wheelchairFriendly: false,
      notes: 'The Jewish Cemetery involves a steep uphill walk. Guests with mobility concerns should mention this at booking.',
    },
    subtitle: 'Roots & Remembrance: A half-day walk through survival, memory, and belonging.',
    gallery: [jewish1, jewish2, jewish3, jewish4, jewish5, jewish6, jewish7, tour4],
    mapWaypoints: [
      { lat: 43.8588, lng: 18.4279, label: 'Ashkenazi Synagogue' },
      { lat: 43.8593, lng: 18.4320, label: 'Old Jewish Quarter' },
      { lat: 43.8583, lng: 18.4288, label: 'Jewish Museum' },
      { lat: 43.8523, lng: 18.4313, label: 'Jewish Cemetery' },
    ],
    mapProfile: 'foot-walking',
  },

    {
    id: 3,
    slug: 'sarajevo-war-tour',
    category: 'history',
    title: 'Sarajevo War Tour: Siege, Tunnel of Hope & Fall of Yugoslavia',
    price: 30,
    rating: 5.0,
    reviews: 36,
    duration: '4 hours',
    groupSize: 12,

    badge: null,
    hero: tour3,
    detailHero: siege7,
    description: 'Between April 1992 and February 1996, the city of Sarajevo was encircled, shelled, and sniped at for 1,425 consecutive days. Ordinary people — teachers, doctors, children, neighbours — survived without electricity, without running water, without knowing if the next day would come. What they built in response was not just survival. It was an act of extraordinary collective resilience that the world was watching and largely failed to stop.\n\nThis half-day tour moves through the physical memory of that time — from Sniper Alley, where civilians ran for their lives across open ground, to the Markale Market massacre site, to the Tunnel of Hope that kept the city breathing beneath a besieged airport. War photography documents what cameras captured. Srebrenica genocide memorial materials bear witness to what happened beyond the city\'s boundaries. This tour does not sensationalise. It remembers, with honesty and with care.',
    highlights: [
      'Sarajevo Tunnel Tour — Step into the narrow passage that kept Sarajevo alive when the city was completely cut off.',
      'Sarajevo Sniper Alley — Drive the same exposed roads where crossing a street once meant calculating risk in real time.',
      'Sarajevo Roses — Each mark fixes a moment in place, connecting the city\'s surface with the stories of those who didn\'t survive.',
      'City Hall — What appears restored and elegant today once burned for days, taking centuries of written memory with it.',
      'Markale — A busy market turned into a site of tragedy within seconds.',
      'Trebevic Mountain — The hills that once shelled the city now offer a panoramic view of what was endured and what was saved.',
      'Bobsleigh Track — The Olympic venue that became a frontline, still scarred by war but open to visitors as a reminder of what was lost and what was survived.',
    ],
    includes: [
      'Local guide',
      'Small group max 12',
      'Walking tour',
      'Free cancellation 24h',
    ],
    excludes: [
      'Entrance fees to Tunnel Museum (20 BAM/10 EUR)',
      'Transport with AC Vehicles',
      'Gratuities (optional but appreciated)',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'How intense or emotional is this tour?',
        answer: 'The content is direct and based on real events, including civilian casualties and personal stories. It is not graphic, but it is serious in tone and often leaves a strong impression. Most visitors find it meaningful rather than overwhelming, especially with a guide providing context throughout.',
      },
      {
        question: 'How much walking is involved? Is it suitable for all fitness levels?',
        answer: 'The route covers roughly 2–3 km at a relaxed pace. Comfortable shoes are recommended; suitable for most fitness levels with basic mobility.',
      },
      {
        question: 'Is this tour historically accurate and balanced?',
        answer: 'Yes. The narrative is based on documented facts, verified timelines, and widely accepted historical sources. A professional guide explains events within their broader context, avoiding simplification while staying clear and structured.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['10 AM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'Those who want to understand what happened in Sarajevo between 1992 and 1996',
      'History enthusiasts ready for emotionally honest, serious content',
      'Travelers who have done a city orientation and want deeper context',
      'Educators, journalists, and those with professional interest in the conflict',
    ],
    notRightFor: [
      'Children under 14 — content includes wartime imagery and civilian deaths',
      'Guests sensitive to trauma or PTSD-related material',
      'Those expecting a typical sightseeing experience with light commentary',
    ],
    accessibility: {
      walking: '2–3 km with vehicle sections between sites',
      terrain: 'Mostly flat urban terrain; the tunnel museum involves a narrow underground passage',
      wheelchairFriendly: false,
      notes: 'Please mention any claustrophobia concerns at booking. Some sections involve vehicle transport.',
    },
    subtitle: 'A half-day tour that does not look away — and neither should you.',
    gallery: [tour3, siege1, siege2, siege3, siege4, siege5, siege6, siege7],
    mapWaypoints: [
      { lat: 43.8582, lng: 18.4313, label: 'Latin Bridge' },
      { lat: 43.8595, lng: 18.4257, label: 'Markale Market' },
      { lat: 43.8517, lng: 18.4028, label: 'Sniper Alley' },
      { lat: 43.8240, lng: 18.3690, label: 'Tunnel Museum' },
    ],
    mapProfile: 'driving-car',
  },

  {
    id: 9,
    slug: 'srebrenica-day-trip-from-sarajevo',
    category: 'history',
    title: 'Srebrenica Day Trip from Sarajevo | Genocide Memorial & Museum Tour',
    price: 59,
    rating: 5.0,
    reviews: 2,
    duration: 'Full day',
    groupSize: 12,

    badge: null,
    hero: srebrenica7,
    detailHero: srebrenica7,
    description: 'In July 1995, over 8,000 Bosniak Muslim men and boys were systematically killed in and around the town of Srebrenica in what the International Court of Justice ruled a genocide. It happened in Europe, under a United Nations protection mandate, within living memory. The Srebrenica-Potočari Memorial and Cemetery now holds the identified remains of those victims — and the process of identification continues to this day. \n\n This full-day trip from Sarajevo is not designed to be comfortable. It is designed to be honest. Your guide will provide full historical context throughout — the lead-up to the genocide, the failure of international protection, the role of the Dutchbat UN battalion, the testimonies of survivors, and the ongoing work of documentation and justice. You will visit the memorial cemetery, the genocide museum, the former UN Dutch Battalion base, the Memorial Room of the Mothers of Srebrenica, and the town itself. You will leave knowing what happened, why it matters, and why remembrance is not optional.',
    highlights: [
      'Srebrenica-Potočari Memorial & Cemetery — The primary site of remembrance, where thousands of identified victims are buried in white stone markers across a hillside that extends as far as the eye can see.',
      'Srebrenica Genocide Museum — A deeply documented account of the events of July 1995, told through testimony, evidence, and the findings of international tribunals. One of the most important museums in Europe.',
      'Dutch Battalion UN Base (Dutchbat) — The former headquarters of the UN peacekeeping force tasked with protecting the safe zone. A sobering site that raises necessary questions about the limits and failures of international intervention.',
      'Memorial Room of the Mothers of Srebrenica — A space dedicated to the survivors — the mothers, wives, and daughters who lost everything and have spent decades demanding truth, identification, and accountability.',
      'Town of Srebrenica — The town itself, quiet and still marked by the weight of what occurred here, provides essential human context that no museum exhibit can fully replicate.',
    ],
    fitnessNote: {
      type: 'emotional',
      level: 'Emotionally demanding',
      detail: 'This tour covers the Srebrenica genocide — one of the most traumatic events in European post-war history. The experience includes memorial sites, documentary footage, and survivor testimonials. We encourage all guests to consider this carefully before booking. The round trip also involves approximately 5 hours of driving. Not recommended for children under 16.',
    },
    includes: [
      'Local guide',
      'Small group max 12',
      'Free cancellation 24h',
    ],
    excludes: [
      'Food and drinks at stops',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'Is this tour appropriate for visitors who are emotionally sensitive to trauma and genocide content?',
        answer: 'This tour engages directly and unflinchingly with the Srebrenica genocide — mass atrocity, survivor testimony, and ongoing identification of victims. It is handled with full respect and care, but the content is heavy by nature. Guests should arrive prepared for that. It is not recommended for children under 16.',
      },
      {
        question: 'Does the tour present events from a particular political perspective?',
        answer: 'The tour presents events as established historical and legal fact — as ruled by the International Court of Justice and the International Criminal Tribunal for the former Yugoslavia. Srebrenica is recognised as genocide under international law. The guide does not present this as contested. Denial of the genocide will not be entertained on this tour.',
      },
      {
        question: 'How long is the full day trip and what is the travel time from Sarajevo?',
        answer: 'The drive from Sarajevo to Srebrenica takes approximately two and a half hours each way through mountain roads. The full day runs around 10 hours including transport, site visits, and time for quiet reflection. A stop for lunch in the area is included in the schedule.',
      },
    ],
    meetingPoint: 'In front of the Tallest Tourguide & Friends office, Hamdije Kresevljakovica 61, Sarajevo. Right next to the Viking Pub.',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    rightFor: [
      'Travelers committed to understanding modern European genocide',
      'Guests who have already seen Sarajevo and want to go deeper into Bosnia',
      'Educators, human rights advocates, and those with a professional interest',
      'Anyone who believes remembrance is not optional',
    ],
    notRightFor: [
      'Children under 16 — content carries significant emotional weight',
      'Guests who are emotionally sensitive to genocide content or survivor testimony',
      'Those wanting sightseeing, nature, or a typical full-day excursion',
      'Anyone not prepared for approximately 5 hours of driving',
    ],
    accessibility: {
      walking: 'Limited — most of the day is spent in vehicles and at the memorial',
      terrain: 'The memorial site involves walking on slightly uneven ground',
      wheelchairFriendly: false,
      notes: 'Physical accessibility is manageable for most guests. Please contact us with specific mobility concerns.',
    },
    subtitle: 'What Happened in Srebrenica in July 1995 Must Not Be Forgotten. This Tour Exists So It Isn\'t.',
    gallery: [srebrenica1, srebrenica2, srebrenica3, srebrenica4, srebrenica5, srebrenica6, srebrenica7],
    mapWaypoints: [
      { lat: 43.8563, lng: 18.4132, label: 'Sarajevo' },
      { lat: 44.0822, lng: 19.2878, label: 'Potočari Memorial' },
      { lat: 44.0764, lng: 19.3050, label: 'Srebrenica' },
    ],
    mapProfile: 'driving-car',
  },
]

export default tours