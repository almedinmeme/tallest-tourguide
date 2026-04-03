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

const tours = [
  {
    id: 1,
    title: 'Sarajevo Grand Walking Tour: The Full Story',
    price: 29,
    rating: 4.9,
    reviews: 102,
    duration: '4 hours',
    groupSize: 12,
    badge: 'Bestseller',
    hero: tour1,
    detailHero: tour1,
    description: 'This tour is built around a different pace and a different mindset. It\'s for travelers who notice details, ask questions, and want to feel a place rather than move through it. Over four hours, Sarajevo opens gradually—through conversations, quiet corners, and moments that connect history with everyday life.\n\nA planned food stop and a traditional coffee degustation are part of the experience, giving context to how Sarajevo is lived, not just seen. By the end, the city feels familiar in a way most visitors don\'t reach—its contrasts make sense, and its story stays with you.\n\n Small group, local guide, no rushed stops. This is the most detailed Sarajevo walking experience available—built for the 10% of visitors who want the whole story.',
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
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['11 AM'],
    languages: ['english', 'bosnian'],
    subtitle: 'Sarajevo Unveiled: A Walk Through Cultures, Centuries & Crossroads',
    gallery: [
  { src: tour1, caption: 'Latin Bridge, where WWI began in 1914.' },
  { src: sarajevo1, caption: 'Baščaršija — the old bazaar built in the 15th century.' },
  sarajevo2, sarajevo3
],

  },
   {
    id: 2,
    title: 'Mostar, Kravice & More: Full Day Herzegovina Tour',
    price: 69,
    rating: 5.0,
    reviews: 38,
    duration: 'Full day',
    groupSize: 8,
    badge: 'Popular',
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
      'Small group max 8',
      'Transport in AC Vehicle',
      'Free cancellation 24h',
    ],
    excludes: [
      'Entrance fees to Kravice Waterfalls',
      'Lunch',
      'Gratuities',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'How long is the full day tour and what time does it return to Sarajevo?',
        answer: 'The tour departs Sarajevo in the morning and returns in the early evening, typically around 8–10 hours in total. Exact timing will be confirmed at booking.',
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
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    subtitle: 'Rivers, Ruins & the Old Bridge: A Full Day Through the Heart of Herzegovina',
    gallery: [tour5,mostar1,mostar2,mostar3],
  },
 
 {
    id: 8,
    title: 'Above the World: A Full Day Hike to Lukomir, Bosnia\'s Highest Village',
    price: 69,
    rating: 5.0,
    reviews: 4,
    duration: 'Half day',
    groupSize: 8,
    badge: 'Active',
    hero: lukomir1,
    detailHero: lukomir2,
    description: 'Lukomir sits at 1,469 metres above sea level on the edge of the Rakitnica Canyon — the deepest and most untouched river canyon in the western Balkans. It is the highest permanently inhabited village in Bosnia, and in many ways it feels like the rest of the world simply forgot to arrive. Stone houses, traditional dress, shepherds moving across the plateau exactly as their grandparents did. Getting there on foot makes it mean something entirely different than arriving any other way.The route follows the canyon rim through the Bjelašnica plateau, with open mountain views that stretch further than you expect and a silence that takes some adjusting to. The hike is moderate — rewarding for those with some trail experience, manageable for anyone in good shape who takes it at their own pace. Lunch is taken in the village itself, with a local family. You descend with the kind of tiredness that feels earned, and a view of Bosnia that very few visitors ever reach.',
    highlights: [
      'Bjelašnica Plateau — The hike opens across one of Bosnia\'s most dramatic high-altitude landscapes, wide open and quietly overwhelming in every direction.',
      'Rakitnica Canyon Rim — The trail follows the edge of the deepest untouched canyon in the western Balkans — a drop so vast it takes a moment to fully register.',
      'Traditional Bosnian Countryside — Between trailhead and village, the landscape passes through meadows, shepherd paths, and highland terrain unchanged for centuries.',
      'Lukomir Village — Bosnia\'s highest permanently inhabited settlement, where stone houses, traditional dress, and a pace of life entirely its own still exist without performance.',
      'Lunch Prepared by Locals — A home-cooked meal inside the village, prepared by residents. Simple, seasonal, and one of the most grounding moments of the entire day.',
      'Canyon Viewpoints — Several natural stopping points along the rim offer unobstructed views deep into the Rakitnica gorge — the kind that stay with you long after the hike ends.',
    ],
    includes: [
      'Local guide',
      'Return transport from Sarajevo',
      'Small group max 8',
      'Free cancellation 24h',
    ],
    excludes: [
      'Entrance fees to museums',
      'Lunch',
      'Gratuities',
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
        answer: 'es, with the right preparation. The trail is moderate rather than technical — no climbing or scrambling involved. A reasonable base fitness level and proper footwear will carry most people through comfortably. Your guide sets a pace that works for the group.',
      },
    ],
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    subtitle: 'There Is a Village in Bosnia That Time Completely Missed. You Can Walk There.',
    gallery: [lukomir1, lukomir2, lukomir3,lukomir4, lukomir5],
  },
    {
    id: 4,
    title: 'Authentic Bosnian Cooking Experience in a Local Home',
    price: 49,
    rating: 5.0,
    reviews: 38,
    duration: '4 hours',
    groupSize: 6,
    badge: 'New',
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
      'Gratuities',
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
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['04 PM'],
    languages: ['english', 'bosnian'],
    subtitle: 'The Best Meal in Sarajevo Isn\'t in a Restaurant. It\'s in Someone\'s Home.',
    gallery: [cooking1, cooking2, cooking3, cooking4, cooking5, cooking6, cooking7],
  },
    {
    id: 5,
    title: 'Jajce & Travnik: A Full Day in Medieval Bosnia',
    price: 69,
    rating: 4.8,
    reviews: 12,
    duration: 'Full day',
    groupSize: 8,
    badge: null,
    hero: tour6,
    detailHero: tour6,
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
      'Small group max 8',
      'Transport in AC Vehicle',
      'Free cancellation 24h',
    ],
    excludes: [
      'Museums and castle entrances',
      'Lunch',
      'Gratuities',
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
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['08 AM'],
    languages: ['english', 'bosnian'],
    subtitle: 'Kings, Castles & Waterfalls: A Full Day in Medieval Bosnia',
    gallery: [tour6, ],
  },

    {
    id: 6,
    title: 'Early Morning or Sunset: Sarajevo Essential\'s Walking Tour',
    price: 18,
    rating: 4.9,
    reviews: 58,
    duration: '2 hours',
    groupSize: 12,
    badge: 'Essential', 
    hero: tour2,
    detailHero: tour2,
    description: 'Sarajevo Old Town unfolds as a compact crossroads of empires, faiths, and daily life—often within a few steps. This two-hour walking tour is structured for travelers who want context, not just checkpoints. You\'ll trace the shift from Ottoman lanes to Austro-Hungarian avenues, passing mosques, churches, and synagogues that still function side by side.\n\nBeginning at the Latin Bridge—where a single act in 1914 reshaped global history—you\'ll move through the dense fabric of Baščaršija, follow the line where East meets West, and climb toward a final viewpoint over the valley. Along the way: craft streets that never industrialized, markets that once linked trade routes, and landmarks that define the city\'s resilience. Small group, local guide, steady pace.',
    highlights: [
      'Latin Bridge & Assassination Site — Stand where Archduke Franz Ferdinand was shot in 1914, the spark that ignited World War I.',
      'Baščaršija Old Bazaar — Sarajevo\'s Ottoman core, laid out in the 15th century, where narrow streets, wooden shops, and the rhythm of daily trade still define the city\'s identity.',
      'Coppersmith Street (Kazandžiluk) — A single lane of workshops where artisans shape copper by hand, preserving techniques unchanged for centuries.',
      'Gazi Husrev-Bey Mosque — Built in 1531, the architectural and spiritual anchor of the old town.',
      'Gazi Husrev-Bey Bezistan — A vaulted stone market once filled with silk, spices, and textiles.',
      'Sarajevo Meeting of Cultures — A visible line in the street marking the transition from Ottoman to Austro-Hungarian urban design.',
      'Hotel Europe — Opened during Austro-Hungarian rule, this landmark hosted notable figures of its time.',
      'City Hall (Vijećnica) — A stunning neo-Moorish building, rebuilt after wartime destruction.',
      'Blacksmith Street and Shahid Graveyard — Everyday craftsmanship alongside the more recent memory of the 1990s war.',
      'Yellow Fortress — A hilltop fort offering a clear view over the old town and surrounding mountains.',
    ],
    includes: [
      'Local guide',
      'Small group max 12',
      'Walking tour',
      'Free cancellation 24h',
    ],
    excludes: [
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
        answer: 'The route covers roughly 2–3 km at a relaxed pace through the old town, but includes a gradual uphill walk toward the Yellow Fortress. Comfortable shoes are recommended; suitable for most fitness levels with basic mobility.',
      },
      {
        question: 'Are entrance fees to mosques or other sites included?',
        answer: 'The tour includes access to outdoor areas and select interiors. Some religious sites may request a small voluntary donation — your guide will let you know in advance.',
      },
    ],
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['08 AM', '05 PM'],
    languages: ['english', 'bosnian'],
    subtitle: 'Two hours. Four centuries. One city unlike any other.',
    gallery: [tour2],
  },
    {
    id: 7,
    title: 'Sarajevo\'s Jewish Heritage Tour',
    price: 29,
    rating: 4.9,
    reviews: 67,
    duration: '4 hours',
    groupSize: 8,
    badge: null,
    hero: tour4,
    detailHero: tour4,
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
      'Small group max 8',
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
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['11 AM'],
    languages: ['english', 'bosnian'],
    subtitle: 'Roots & Remembrance: A half-day walk through survival, memory, and belonging.',
    gallery: [tour4],
  },

    {
    id: 3,
    title: 'Siege, Genocide, Survival: Half-Day Sarajevo War Tour',
    price: 35,
    rating: 5.0,
    reviews: 156,
    duration: '4 hours',
    groupSize: 8,
    badge: null,
    hero: tour3,
    detailHero: tour3,
    description: 'Between April 1992 and February 1996, the city of Sarajevo was encircled, shelled, and sniped at for 1,425 consecutive days. Ordinary people — teachers, doctors, children, neighbours — survived without electricity, without running water, without knowing if the next day would come. What they built in response was not just survival. It was an act of extraordinary collective resilience that the world was watching and largely failed to stop.This half-day tour moves through the physical memory of that time — from Sniper Alley, where civilians ran for their lives across open ground, to the Markale Market massacre site, to the Tunnel of Hope that kept the city breathing beneath a besieged airport. War photography documents what cameras captured. Srebrenica genocide memorial materials bear witness to what happened beyond the city\'s boundaries. This tour does not sensationalise. It remembers, with honesty and with care.',
    highlights: [
      'Sarajevo Tunnel Tour — Step into the narrow passage that kept Sarajevo alive when the city was completely cut off.',
      'Sarajevo Sniper Alley — Drive the same exposed roads where crossing a street once meant calculating risk in real time.',
      'Sarajevo Roses — Each mark fixes a moment in place, connecting the city\'s surface with the stories of those who didn\'t survive.',
      'City Hall — What appears restored and elegant today once burned for days, taking centuries of written memory with it.',
      'Markale — A busy market turned into a site of tragedy within seconds.',
      '11/07/95 Gallery — Inside, the story widens beyond Sarajevo through images and testimonies that are direct and unfiltered.',
    ],
    includes: [
      'Local guide',
      'Small group max 8',
      'Walking tour',
      'Free cancellation 24h',
    ],
    excludes: [
      'Entrance fees to Tunnel Museum and 11/07/95',
      'Transport with AC Vehicles',
      'Gratuities',
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
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['11 AM'],
    languages: ['english', 'bosnian'],
    subtitle: 'A half-day tour that does not look away — and neither should you.',
    gallery: [tour3],
  },

  {
    id: 9,
    title: 'Sarajevo Coffee & Culinary Walk: Taste the City',
    price: 39,
    rating: 4.9,
    reviews: 52,
    duration: '3 hours',
    groupSize: 8,
    badge: null,
    hero: cooking8,
    detailHero: cooking8,
    description: 'Sarajevo has been a city of trade, hospitality, and table culture for five centuries. This three-hour culinary walk moves through the old town with stops that are chosen for what they reveal about the city as much as what they taste like. You will drink Bosnian coffee the correct way, try ćevapi at a place locals have been going to for decades, sample burek from a bakery that opens before dawn, and finish with something sweet that you will spend the rest of the trip trying to recreate at home.\n\nThe route is slow and conversational. There is no rushing between stops. Your guide connects the food to the history — why Bosnian coffee is served differently from Turkish coffee, what the Ottoman trading routes brought to the table, and how the siege years shaped the way the city eats today. Small group, walking pace, every stop chosen carefully.',
    highlights: [
      'Bosnian Coffee Ritual — Learn the correct way to drink Bosnian coffee, including the džezva, the sugar cube, and the rahat lokum that comes alongside.',
      'Ćevapi at a Local Institution — Sarajevo\'s most iconic dish, at a place that has been doing it correctly for longer than most visitors have been alive.',
      'Fresh Burek from the Bakery — Straight from the oven, filled with meat or cheese, eaten the way it is meant to be eaten — standing up.',
      'Baščaršija Market Stop — A walk through the bazaar with stops at spice sellers, dried fruit stalls, and the copper workshops that surround them.',
      'Traditional Sweets — Tufahija, hurmašice, or halvah — the dessert course changes with the season and what your guide thinks is worth tasting that day.',
    ],
    includes: [
      'Local guide',
      'All food tastings included',
      'Small group max 8',
      'Free cancellation 24h',
    ],
    excludes: [
      'Additional food or drinks beyond tastings',
      'Gratuities',
      'Personal expenses',
    ],
    faqs: [
      {
        question: 'How much food is included — will this replace a meal?',
        answer: 'The tastings are generous and most visitors find they are not hungry for a full meal afterwards. Think of it as a progressive lunch rather than a snack tour.',
      },
      {
        question: 'Can this tour accommodate vegetarians?',
        answer: 'Yes. Most stops have vegetarian options — burek with cheese, vegetable dishes, and all the sweets. Let your guide know at the start and every stop will be adjusted.',
      },
      {
        question: 'Is this tour suitable for children?',
        answer: 'Yes — the food is approachable and the pace is relaxed. Children tend to enjoy the burek and sweet stops most. The walking distance is short and manageable for most ages.',
      },
    ],
    meetingPoint: 'Mejdan park next to the Latin Bridge, Obala Kulina bana, Sarajevo',
    startingTimes: ['10 AM'],
    languages: ['english', 'bosnian'],
    subtitle: 'Feel and Taste Sarajevo\'s History in Every Bite and Sip.',
    gallery: [cooking8],
  },
]

export default tours