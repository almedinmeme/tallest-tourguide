import SEO from '../components/SEO'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronDown, ChevronUp,
  CheckCircle, XCircle, MapPin, ShieldCheck,
  Calendar, Star, Sunset, History, Coffee,
  Utensils, Home, Footprints,
  Waves, Wine, Shield, Anchor, X,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import useWindowWidth from '../hooks/useWindowWidth'
import package1Hero from '../assets/package-1-hero.webp'
import package2Hero from '../assets/package-2-hero.webp'
import Gallery from '../components/Gallery'

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
  {
    id: 1,
    name: 'Sarajevo Essential',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
    gallery: [package1Hero],
    subtitle: 'Stories, Survival & Soul',
    duration: '2 Days',
    groupSize: 8,
    difficulty: 'Easy',
    price: 99,
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
  },
  {
    id: 2,
    name: 'Bosnia Deep Dive',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
    gallery: [package2Hero],
    subtitle: 'Real Bosnia, Deeply Experienced',
    duration: '5 Days',
    groupSize: 8,
    difficulty: 'Easy',
    price: 480,
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
  },
]

function PackageDetail() {
  const { id } = useParams()
  const pkg = packages.find((p) => p.id === Number(id))
  const width = useWindowWidth()
  const isMobile = width <= 768

  const [openDay, setOpenDay] = useState(null)
  const [openInfo, setOpenInfo] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDateLabel, setSelectedDateLabel] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (!pkg) {
    return (
      <div style={styles.notFound}>
        <h2>Package not found</h2>
        <Link to="/packages" style={styles.backLinkDark}>← Back to packages</Link>
      </div>
    )
  }

  const totalPrice = pkg.price * numPeople

  const handleBooking = () => {
    if (!selectedDateLabel || !guestName || !guestEmail) {
      alert('Please fill in your name, email, and select a date.')
      return
    }
    setIsSending(true)
    setIsError(false)

    const templateParams = {
      tour_name: `${pkg.name} — ${pkg.subtitle}`,
      tour_date: selectedDateLabel,
      num_people: numPeople,
      total_price: totalPrice,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone || 'Not provided',
    }

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => { setIsSending(false); setIsSuccess(true) })
    .catch(() => { setIsSending(false); setIsError(true) })
  }

  const bookingForm = (
    <div style={styles.bookingCard}>
      {isSuccess ? (
        <div style={styles.successMessage}>
          <span style={styles.successIcon}>✓</span>
          <h3 style={styles.successTitle}>Request Received!</h3>
          <p style={styles.successText}>
            Thanks {guestName}. Your request for{' '}
            <strong>{pkg.name}</strong> on {selectedDateLabel} for{' '}
            {numPeople} {numPeople === 1 ? 'person' : 'people'} has been
            received. You'll hear back within 24 hours.
          </p>
        </div>
      ) : (
        <>
          <div style={styles.priceRow}>
            <span style={styles.price}>€{pkg.price}</span>
            <span style={styles.perPerson}>per person</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.formGroup}>
            <label style={styles.label}>Select a Date</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              {pkg.dates.map((dateOption) => {
                const isSelected = selectedDate === String(dateOption.id)
                const isFull = dateOption.spots === 0
                const isFewSpots = dateOption.spots <= 2 && dateOption.spots > 0
                return (
                  <button
                    key={dateOption.id}
                    disabled={isFull}
                    onClick={() => {
                      if (!isFull) {
                        setSelectedDate(String(dateOption.id))
                        setSelectedDateLabel(dateOption.date)
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--color-forest-green)' : 'var(--color-n300)',
                      backgroundColor: isSelected ? 'rgba(46,125,94,0.06)' : 'var(--color-n000)',
                      cursor: isFull ? 'not-allowed' : 'pointer',
                      opacity: isFull ? 0.5 : 1,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar
                        size={13}
                        color={isSelected ? 'var(--color-forest-green)' : 'var(--color-n600)'}
                      />
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-small)',
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected ? 'var(--color-forest-green)' : 'var(--color-n900)',
                      }}>
                        {dateOption.date}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: isFull
                        ? 'var(--color-error)'
                        : isFewSpots
                          ? 'var(--color-amber)'
                          : 'var(--color-n600)',
                    }}>
                      {isFull ? 'Sold Out' : isFewSpots ? `${dateOption.spots} left` : `${dateOption.spots} available`}
                    </span>
                  </button>
                )
              })}
            </div>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Number of People</label>
            <select
              style={styles.input}
              value={numPeople}
              onChange={(e) => setNumPeople(Number(e.target.value))}
            >
              {Array.from({ length: pkg.groupSize }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalPrice}>€{totalPrice}</span>
          </div>

          <button
            style={{
              ...styles.bookBtn,
              opacity: isSending ? 0.7 : 1,
              cursor: isSending ? 'not-allowed' : 'pointer',
            }}
            onClick={handleBooking}
            disabled={isSending}
          >
            {isSending ? 'Sending Request...' : `Request to Book — €${totalPrice}`}
          </button>

          {isError && (
            <p style={styles.errorMessage}>
              Something went wrong. Please try again or email us directly.
            </p>
          )}

          <div style={styles.cancellationRow}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <p style={styles.freeCancellation}>
              Free cancellation up to 48 hours before
            </p>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div>

<SEO
  title={`${pkg.name} — ${pkg.subtitle}`}
  description={pkg.about.slice(0, 155).replace(/\n/g, ' ')}
  url={`/packages/${pkg.id}`}
/>

      <div style={styles.heroWrapper}>
        <img src={pkg.heroImage} alt={pkg.name} style={styles.heroPhoto} />
        <div style={styles.heroGradient} />
        <div style={styles.heroGradientTop} />
        <div style={styles.heroBackLink}>
          <Link to="/packages" style={styles.backLink}>← All Packages</Link>
        </div>
      </div>

      <div style={{
        ...styles.contentCard,
        padding: isMobile ? '32px 20px 100px 20px' : '48px 40px',
      }}>

        <div style={styles.titleBlock}>
          <div style={styles.titleLeft}>

            {/* Rating — above the title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Star size={15} color="var(--color-amber)" fill="var(--color-amber)" />
              <span style={styles.ratingNumber}>{pkg.rating}</span>
              <span style={styles.ratingCount}>({pkg.reviews} reviews)</span>
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
              <span style={styles.metaPill}>🧭 {pkg.difficulty}</span>
              <span style={styles.metaPill}>⏱ {pkg.duration}</span>
              <span style={styles.metaPill}>👥 Max {pkg.groupSize} people</span>
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

            {/* About */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>About This Package</h2>
              {pkg.about.split('\n\n').map((paragraph, index) => (
                <p key={index} style={styles.bodyText}>{paragraph}</p>
              ))}
            </div>

            {/* Activities & Experiences */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Activities & Experiences</h2>
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

            {/* Day by Day Itinerary */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Day by Day Itinerary</h2>
              <p style={styles.sectionSubtitle}>Click each day to expand the full schedule.</p>
              <div style={styles.accordionList}>
                {pkg.days.map((day) => {
                  const isOpen = openDay === day.id
                  return (
                    <div
                      key={day.id}
                      style={{
                        ...styles.accordionItem,
                        borderLeft: isOpen ? '3px solid var(--color-forest-green)' : '3px solid transparent',
                      }}
                    >
                      <button
                        style={styles.accordionHeader}
                        onClick={() => setOpenDay(isOpen ? null : day.id)}
                      >
                        <div style={styles.accordionHeaderTop}>
                          <div style={styles.accordionPills}>
                            <span style={styles.dayNumber}>Day {day.id}</span>
                            <div style={styles.cityTag}>
                              <MapPin size={11} color="var(--color-forest-green)" />
                              <span style={styles.cityLabel}>{day.city}</span>
                            </div>
                          </div>
                          {isOpen
                            ? <ChevronUp size={18} color="var(--color-forest-green)" />
                            : <ChevronDown size={18} color="var(--color-n600)" />
                          }
                        </div>
                        <div style={styles.accordionHeaderBottom}>
                          <span style={styles.dayTitle}>{day.title}</span>
                          <span style={styles.daySummary}>{day.summary}</span>
                        </div>
                      </button>

                      {isOpen && (
                        <div style={styles.accordionBody}>
                          {day.morning && (
                            <div style={styles.timeBlock}>
                              <span style={styles.timeLabel}>Morning</span>
                              <p style={styles.timeContent}>{day.morning}</p>
                            </div>
                          )}
                          {day.afternoon && (
                            <div style={styles.timeBlock}>
                              <span style={styles.timeLabel}>Afternoon</span>
                              <p style={styles.timeContent}>{day.afternoon}</p>
                            </div>
                          )}
                          {day.note && (
                            <div style={styles.dayNote}>
                              <p style={styles.dayNoteText}>{day.note}</p>
                            </div>
                          )}
                          <div style={styles.highlightsList}>
                            {day.highlights.map((highlight, i) => (
                              <div key={i} style={styles.highlightItem}>
                                <CheckCircle size={13} color="var(--color-forest-green)" />
                                <span style={styles.highlightText}>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* What's Included */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>What's Included</h2>
              <div style={{
                ...styles.inclusionsGrid,
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                marginTop: '16px',
              }}>
                <div>
                  <h3 style={styles.inclusionSubtitle}>Included</h3>
                  <div style={styles.inclusionsList}>
                    {pkg.inclusions.map((item, i) => (
                      <div key={i} style={styles.inclusionItem}>
                        <CheckCircle size={15} color="var(--color-success)" />
                        <span style={styles.inclusionText}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={styles.exclusionSubtitle}>Not Included</h3>
                  <div style={styles.inclusionsList}>
                    {pkg.exclusions.map((item, i) => (
                      <div key={i} style={styles.inclusionItem}>
                        <XCircle size={15} color="var(--color-n300)" />
                        <span style={{ ...styles.inclusionText, color: 'var(--color-n600)' }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information — Tabs */}
            <div style={styles.section}>
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

          </div>

          {/* ── RIGHT COLUMN — Desktop only ── */}
          {!isMobile && (
            <div style={{ position: 'sticky', top: '88px', alignSelf: 'start' }}>
              {bookingForm}
            </div>
          )}

        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR ── */}
      {isMobile && (
        <div style={styles.mobileBottomBar}>
          <div style={styles.mobileBottomBarLeft}>
            <span style={styles.mobilePrice}>€{pkg.price}</span>
            <span style={styles.mobilePricePer}>per person</span>
          </div>
          <button style={styles.mobileBookBtn} onClick={() => setDrawerOpen(true)}>
            Book This Package
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
    backgroundColor: 'var(--color-n100)',
    marginTop: '-80px',
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
    backgroundColor: 'var(--color-n000)',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '16px',
    border: '1px solid var(--color-n300)',
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

  accordionList: { display: 'flex', flexDirection: 'column', gap: '8px' },

  accordionItem: {
    backgroundColor: 'var(--color-n100)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'border-left 0.2s ease',
  },

  accordionHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },

  accordionHeaderTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  accordionHeaderBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    paddingRight: '32px',
  },

  accordionPills: { display: 'flex', alignItems: 'center', gap: '8px' },

  dayNumber: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    backgroundColor: 'rgba(46,125,94,0.1)',
    padding: '3px 10px',
    borderRadius: '100px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  cityTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(74,168,128,0.1)',
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

  dayTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
  },

  daySummary: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
  },

  accordionBody: {
    padding: '0 16px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  timeBlock: { display: 'flex', flexDirection: 'column', gap: '5px' },

  timeLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '11px',
    color: 'var(--color-forest-green)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  timeContent: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  dayNote: {
    backgroundColor: 'var(--color-amber-light)',
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

  highlightsList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  highlightItem: { display: 'flex', alignItems: 'center', gap: '8px' },

  highlightText: {
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
    borderRadius: '10px',
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

  bookingCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    border: '1px solid var(--color-n300)',
  },

  divider: {
    height: '1px',
    backgroundColor: 'var(--color-n300)',
    marginBottom: '16px',
    marginTop: '4px',
  },

  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },

  price: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '32px',
    color: 'var(--color-forest-green)',
  },

  perPerson: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },

  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  input: {
    height: 'var(--touch-target)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 12px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    marginBottom: '10px',
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

  mobileBottomBarLeft: { display: 'flex', alignItems: 'baseline', gap: '4px' },

  mobilePrice: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '24px',
    color: 'var(--color-forest-green)',
  },

  mobilePricePer: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
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