// PersonalisedTour.jsx
import { CONTACT_EMAIL } from '../data/settings'
// Dedicated page for the Personalised Tour Package.
// Contains a hero section, value proposition, and a
// multi-step questionnaire that collects visitor preferences
// and sends the responses to your inbox via EmailJS.
//
// The questionnaire is broken into 4 steps with a progress bar.
// Each step is focused and manageable — research shows multi-step
// forms convert at significantly higher rates than single long forms.
import SEO from '../components/SEO'
import { useState } from 'react'
import {
  ArrowRight, ArrowLeft, CheckCircle, Check,
  Sparkles, Users, Heart,
} from 'lucide-react'
import { sendEmail } from '../utils/email'
import useWindowWidth from '../hooks/useWindowWidth'
import Button from '../components/Button'
import { sortedDestinations } from '../data/destinations'
import { getPage } from '../data/pages'

// ─────────────────────────────────────────────────────────
// QUESTIONNAIRE DATA
// Centralised here so adding/removing questions is trivial.
// ─────────────────────────────────────────────────────────

const travellerTypes = [
  {
    id: 'adventurer',
    label: 'The Adventurer',
    description: 'Rafting, hiking, off the beaten path',
  },
  {
    id: 'slow',
    label: 'The Slow Traveller',
    description: 'Coffee stops, city strolls, no rushing',
  },
  {
    id: 'cultural',
    label: 'The Culture Seeker',
    description: 'History, heritage, local stories',
  },
  {
    id: 'foodie',
    label: 'The Foodie',
    description: 'Markets, tastings, cooking with locals',
  },
  {
    id: 'nature',
    label: 'The Nature Lover',
    description: 'Waterfalls, mountains, open landscapes',
  },
  {
    id: 'mixed',
    label: 'A Bit of Everything',
    description: 'No single label fits',
  },
]

const activities = [
  { id: 'walking', label: 'City walking tours' },
  { id: 'food', label: 'Food & coffee experiences' },
  { id: 'wine', label: 'Wine & rakija tasting' },
  { id: 'rafting', label: 'Rafting & water activities' },
  { id: 'history', label: 'War history & siege stories' },
  { id: 'culture', label: 'Mosques, churches & heritage' },
  { id: 'nature', label: 'Waterfalls & natural sites' },
  { id: 'villages', label: 'Villages & local life' },
  { id: 'cooking', label: 'Cooking with local families' },
  { id: 'bunker', label: 'Cold War & Tito legacy' },
  { id: 'mostar', label: 'Mostar & Herzegovina' },
  { id: 'photography', label: 'Photography spots' },
]

// Places to visit — Bosnian cities managed in the admin (Pages →
// Personalised Tour → "Bosnian cities & places"), plus the wider Balkan
// regions straight from the destinations collection. Both stay in sync with
// the admin without code changes.
const personalisedPage = getPage('personalised')
const adminCities = (personalisedPage?.extra?.cities || []).filter(Boolean)
const bosniaCities = adminCities.length > 0 ? adminCities : [
  'Sarajevo',
  'Mostar',
  'Srebrenica',
  'Jajce & Travnik',
  'Lukomir',
  'Konjic & Blagaj',
  'Stolac',
  'Banja Luka',
]

const balkanRegions = sortedDestinations
  .filter((d) => d.slug !== 'bosnia-and-herzegovina')
  .map((d) => d.name)

const accommodationOptions = [
  { id: 'hotel3', label: '3 Star Hotel' },
  { id: 'hotel4', label: '4 Star Hotel' },
  { id: 'boutique', label: 'Boutique & character stays' },
  { id: 'homestay', label: 'Homestay with locals' },
  { id: 'noAccommodation', label: 'I have my own accommodation' },
]

const budgetOptions = [
  { id: 'budget', label: 'Budget', description: 'Up to €50/day' },
  { id: 'mid', label: 'Mid-range', description: '€50–€100/day' },
  { id: 'comfort', label: 'Comfort', description: '€100–€150/day' },
  { id: 'premium', label: 'Premium', description: '€150+/day' },
]

const howHeardOptions = [
  'Instagram',
  'TripAdvisor',
  'Google Search',
  'Friend or family',
  'Travel blog',
  'Other',
]

const TOTAL_STEPS = 4
const STEP_LABELS = ['About you', 'Your trip', 'Interests', 'Details']

function PersonalisedTour() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  const [step, setStep] = useState(1)
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  // Form data — all answers collected across steps
  const [formData, setFormData] = useState({
    // Step 1 — About you
    name: '',
    email: '',
    phone: '',
    travellerType: '',
    groupSize: '',
    // Step 2 — Your trip
    arrivalDate: '',
    departureDate: '',
    duration: '',
    places: [],
    // Step 3 — Your interests
    activities: [],
    accommodation: '',
    budget: '',
    // Step 4 — Final details
    otherInfo: '',
    howHeard: '',
  })

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleActivity = (activityId) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter((a) => a !== activityId)
        : [...prev.activities, activityId],
    }))
  }

  const togglePlace = (place) => {
    setFormData((prev) => ({
      ...prev,
      places: prev.places.includes(place)
        ? prev.places.filter((p) => p !== place)
        : [...prev.places, place],
    }))
  }

  const canProceed = () => {
    if (step === 1) return formData.name && formData.email && formData.travellerType
    if (step === 2) return formData.groupSize
    if (step === 3) return formData.activities.length > 0 && formData.budget
    return true
  }

  const handleSubmit = () => {
    setIsSending(true)
    setIsError(false)

    const selectedActivities = activities
      .filter((a) => formData.activities.includes(a.id))
      .map((a) => a.label)
      .join(', ')

    const budgetLabel = budgetOptions.find(b => b.id === formData.budget)?.label || 'Not specified'
    const travellerLabel = travellerTypes.find(t => t.id === formData.travellerType)?.label || 'Not specified'
    const accommodationLabel = accommodationOptions.find(a => a.id === formData.accommodation)?.label || 'Not specified'

    sendEmail('personalised', {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      traveller_type: travellerLabel,
      group_size: formData.groupSize,
      arrival_date: formData.arrivalDate || 'Flexible',
      departure_date: formData.departureDate || 'Flexible',
      duration: formData.duration || 'Flexible',
      places: formData.places.length > 0 ? formData.places.join(', ') : 'Open to suggestions',
      budget: budgetLabel,
      accommodation: accommodationLabel,
      interests: selectedActivities,
      notes: formData.otherInfo || 'None',
      how_heard: formData.howHeard || 'Not specified',
    })
    .then(() => { setIsSending(false); setIsSuccess(true) })
    .catch(() => { setIsSending(false); setIsError(true) })
  }

  return (
    <div>
      <SEO
  title={personalisedPage?.seo?.title || 'Personalised Tours — Your Bosnia, Your Way'}
  description={personalisedPage?.seo?.description || 'Build a custom Bosnia itinerary around your interests. Private guide, flexible dates, accommodation arranged on request. Fill in our short questionnaire.'}
  url="/personalised"
  image="https://tallesttourguide.com/og-image.jpg"
/>

      {/* ── HERO ────────────────────────────────────────────
          Deep-forest editorial opening (same voice as the homepage hero
          and closing banner), with the three value props folded in as a
          quiet strip — no floating boxes. */}
      <section style={{ ...styles.hero, padding: isMobile ? '56px 24px 40px' : '80px 40px 56px' }}>
        <div style={styles.heroGlow} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={styles.eyebrow}>Plan your trip — free</span>
          <h1 style={{
            ...styles.heroTitle,
            fontSize: isMobile ? '32px' : '46px',
          }}>
            <span style={styles.heroTitleThin}>Your Bosnia.</span>{' '}
            <span style={styles.heroTitleBold}>Your Way.</span>
          </h1>
          <p style={{ ...styles.heroSubtitle, maxWidth: '540px', margin: '14px auto 0' }}>
            Tell us what you're curious about and we'll build an itinerary
            around you — not the other way around.
          </p>
          <div style={styles.heroTrustRow}>
            <span style={styles.heroTrustItem}>✓ Free to request</span>
            <span style={styles.heroTrustDot}>·</span>
            <span style={styles.heroTrustItem}>✓ No obligation</span>
            <span style={styles.heroTrustDot}>·</span>
            <span style={styles.heroTrustItem}>✓ Proposal within 24h</span>
          </div>

          {/* Value props — inside the hero, separated by a hairline */}
          <div style={{
            ...styles.heroValues,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            {[
              {
                icon: Sparkles,
                title: 'Built Around You',
                text: 'Every stop, experience, and meal chosen for your interests — never a template.',
              },
              {
                icon: Users,
                title: 'Private Guide',
                text: 'No shared groups. Your guide\'s full attention, your pace, your questions.',
              },
              {
                icon: Heart,
                title: 'Local Knowledge',
                text: 'Places that aren\'t on Google Maps. People who live here. Stories you won\'t read anywhere.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} style={{ ...styles.heroValue, alignItems: isMobile ? 'center' : 'flex-start' }}>
                  <div style={styles.heroValueIcon}>
                    <Icon size={15} color="var(--color-amber)" strokeWidth={1.8} />
                  </div>
                  <h3 style={styles.heroValueTitle}>{item.title}</h3>
                  <p style={styles.heroValueText}>{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── QUESTIONNAIRE ───────────────────────────────── */}
      <section style={styles.questionnaireSection}>
        <div style={{
          ...styles.questionnaireCard,
          padding: isMobile ? '24px' : '48px',
        }}>

          {isSuccess ? (

            /* Success state */
            <div style={styles.successState}>
              <div style={styles.successIconWrapper}>
                <CheckCircle
                  size={48}
                  color="var(--color-success)"
                />
              </div>
              <h2 style={styles.successTitle}>
                We've Got Your Answers
              </h2>
              <p style={styles.successText}>
                Thanks {formData.name}. Your questionnaire has been
                received and we'll come back to you at{' '}
                <strong>{formData.email}</strong> within 24 hours
                with a personalised proposal.
              </p>
              <Button to="/" variant="secondary">
                Back to homepage
              </Button>
            </div>

          ) : (

            <>
              {/* Step indicator — labelled milestones instead of a bare
                  percentage. Completed steps get a check; the connector
                  line fills as you go. Mobile falls back to a slim bar
                  with the current step's name. */}
              {isMobile ? (
                <div style={styles.progressSection}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>
                      Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step - 1]}
                    </span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${(step / TOTAL_STEPS) * 100}%`,
                    }} />
                  </div>
                </div>
              ) : (
                <div style={styles.stepsRow}>
                  {STEP_LABELS.map((label, i) => {
                    const n = i + 1
                    const done = n < step
                    const current = n === step
                    return (
                      <div key={label} style={{ ...styles.stepItem, flex: n < TOTAL_STEPS ? 1 : 'none' }}>
                        <div
                          style={{
                            ...styles.stepCircle,
                            backgroundColor: done ? 'var(--color-forest-green)' : current ? 'var(--color-n000)' : 'var(--color-n100)',
                            borderColor: done || current ? 'var(--color-forest-green)' : 'var(--color-n300)',
                            color: current ? 'var(--color-forest-green)' : 'var(--color-n500)',
                          }}
                        >
                          {done ? <Check size={13} color="#fff" strokeWidth={3} /> : n}
                        </div>
                        <span
                          style={{
                            ...styles.stepLabel,
                            color: current ? 'var(--color-n900)' : done ? 'var(--color-forest-green)' : 'var(--color-n500)',
                            fontWeight: current ? 700 : 600,
                          }}
                        >
                          {label}
                        </span>
                        {n < TOTAL_STEPS && (
                          <div style={{ ...styles.stepConnector, backgroundColor: done ? 'var(--color-forest-green)' : 'var(--color-n300)' }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ── STEP 1 — About You ─────────────────── */}
              {step === 1 && (
                <div style={styles.stepContent}>
                  <h2 style={styles.stepTitle}>
                    Let's start with you
                  </h2>
                  <p style={styles.stepSubtitle}>
                    A few basics so we know who we're talking to.
                  </p>

                  <div style={{
                    ...styles.formRow,
                    flexDirection: isMobile ? 'column' : 'row',
                  }}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Ana Kovačević"
                        className="pt-input" style={styles.input}
                        value={formData.name}
                        onChange={(e) =>
                          updateForm('name', e.target.value)
                        }
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="ana@example.com"
                        className="pt-input" style={styles.input}
                        value={formData.email}
                        onChange={(e) =>
                          updateForm('email', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+387 61 000 000"
                      className="pt-input" style={styles.input}
                      value={formData.phone}
                      onChange={(e) =>
                        updateForm('phone', e.target.value)
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      What kind of traveller are you? *
                    </label>
                    <div className="pt-options" style={{
                      ...styles.optionGrid,
                      gridTemplateColumns: isMobile
                        ? '1fr'
                        : 'repeat(2, 1fr)',
                    }}>
                      {travellerTypes.map((type) => (
                        <button
                          key={type.id}
                          style={{
                            ...styles.optionCard,
                            borderColor:
                              formData.travellerType === type.id
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n300)',
                            backgroundColor:
                              formData.travellerType === type.id
                                ? 'rgba(46,125,94,0.06)'
                                : 'var(--color-n000)',
                          }}
                          onClick={() =>
                            updateForm('travellerType', type.id)
                          }
                        >
                          <span style={{
                            ...styles.optionTitle,
                            color: formData.travellerType === type.id
                              ? 'var(--color-forest-green)'
                              : 'var(--color-n900)',
                          }}>
                            {type.label}
                          </span>
                          <span style={styles.optionDesc}>
                            {type.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ── STEP 2 — Your Trip ─────────────────── */}
              {step === 2 && (
                <div style={styles.stepContent}>
                  <h2 style={styles.stepTitle}>
                    Tell us about your trip
                  </h2>
                  <p style={styles.stepSubtitle}>
                    Dates, group size, and how you're arriving.
                    Flexible on dates? Just leave them blank.
                  </p>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      How many people? *
                    </label>
                    <div className="pt-options" style={{
                      ...styles.optionGrid,
                      gridTemplateColumns: isMobile
                        ? 'repeat(2, 1fr)'
                        : 'repeat(4, 1fr)',
                    }}>
                      {['1', '2', '3–4', '5–8', '9–12', '12+'].map(
                        (size) => (
                          <button
                            key={size}
                            style={{
                              ...styles.sizeOption,
                              borderColor:
                                formData.groupSize === size
                                  ? 'var(--color-forest-green)'
                                  : 'var(--color-n300)',
                              backgroundColor:
                                formData.groupSize === size
                                  ? 'rgba(46,125,94,0.06)'
                                  : 'var(--color-n000)',
                              color: formData.groupSize === size
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n900)',
                            }}
                            onClick={() =>
                              updateForm('groupSize', size)
                            }
                          >
                            {size}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div style={{
                    ...styles.formRow,
                    flexDirection: isMobile ? 'column' : 'row',
                  }}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Arrival date
                      </label>
                      <input
                        type="date"
                        className="pt-input" style={styles.input}
                        value={formData.arrivalDate}
                        onChange={(e) =>
                          updateForm('arrivalDate', e.target.value)
                        }
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Departure date
                      </label>
                      <input
                        type="date"
                        className="pt-input" style={styles.input}
                        value={formData.departureDate}
                        onChange={(e) =>
                          updateForm('departureDate', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      How long would you like to travel?
                    </label>
                    <div className="pt-options" style={{
                      ...styles.optionGrid,
                      gridTemplateColumns: isMobile
                        ? 'repeat(2, 1fr)'
                        : 'repeat(4, 1fr)',
                    }}>
                      {[
                        '1–2 days',
                        '3–4 days',
                        '5–7 days',
                        '1 week+',
                      ].map((d) => (
                        <button
                          key={d}
                          style={{
                            ...styles.sizeOption,
                            borderColor:
                              formData.duration === d
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n300)',
                            backgroundColor:
                              formData.duration === d
                                ? 'rgba(46,125,94,0.06)'
                                : 'var(--color-n000)',
                            color: formData.duration === d
                              ? 'var(--color-forest-green)'
                              : 'var(--color-n900)',
                          }}
                          onClick={() =>
                            updateForm('duration', d)
                          }
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Where would you like to go?
                    </label>
                    <p style={styles.placesHint}>
                      Pick as many as you like — or leave it to us and we'll suggest a route.
                    </p>

                    <span style={styles.placesGroupLabel}>Bosnia & Herzegovina</span>
                    <div className="pt-options" style={styles.placesWrap}>
                      {bosniaCities.map((place) => {
                        const isSelected = formData.places.includes(place)
                        return (
                          <button
                            key={place}
                            style={{
                              ...styles.placeChip,
                              borderColor: isSelected ? 'var(--color-forest-green)' : 'var(--color-n300)',
                              backgroundColor: isSelected ? 'rgba(46,125,94,0.08)' : 'var(--color-n000)',
                              color: isSelected ? 'var(--color-forest-green)' : 'var(--color-n600)',
                            }}
                            onClick={() => togglePlace(place)}
                          >
                            {isSelected && <CheckCircle size={13} color="var(--color-forest-green)" />}
                            {place}
                          </button>
                        )
                      })}
                    </div>

                    {balkanRegions.length > 0 && (
                      <>
                        <span style={{ ...styles.placesGroupLabel, marginTop: '14px' }}>Across the Balkans</span>
                        <div className="pt-options" style={styles.placesWrap}>
                          {balkanRegions.map((place) => {
                            const isSelected = formData.places.includes(place)
                            return (
                              <button
                                key={place}
                                style={{
                                  ...styles.placeChip,
                                  borderColor: isSelected ? 'var(--color-forest-green)' : 'var(--color-n300)',
                                  backgroundColor: isSelected ? 'rgba(46,125,94,0.08)' : 'var(--color-n000)',
                                  color: isSelected ? 'var(--color-forest-green)' : 'var(--color-n600)',
                                }}
                                onClick={() => togglePlace(place)}
                              >
                                {isSelected && <CheckCircle size={13} color="var(--color-forest-green)" />}
                                {place}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>

                </div>
              )}

              {/* ── STEP 3 — Your Interests ────────────── */}
              {step === 3 && (
                <div style={styles.stepContent}>
                  <h2 style={styles.stepTitle}>
                    What do you want to experience?
                  </h2>
                  <p style={styles.stepSubtitle}>
                    Select everything that interests you —
                    we'll build around your choices.
                  </p>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Activities & experiences *
                    </label>
                    <div className="pt-options" style={{
                      ...styles.activitiesGrid,
                      gridTemplateColumns: isMobile
                        ? 'repeat(2, 1fr)'
                        : 'repeat(3, 1fr)',
                    }}>
                      {activities.map((activity) => {
                        const isSelected =
                          formData.activities.includes(activity.id)
                        return (
                          <button
                            key={activity.id}
                            style={{
                              ...styles.activityChip,
                              borderColor: isSelected
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n300)',
                              backgroundColor: isSelected
                                ? 'rgba(46,125,94,0.08)'
                                : 'var(--color-n000)',
                              color: isSelected
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n600)',
                            }}
                            onClick={() =>
                              toggleActivity(activity.id)
                            }
                          >
                            {isSelected && (
                              <CheckCircle
                                size={13}
                                color="var(--color-forest-green)"
                              />
                            )}
                            {activity.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Accommodation preference
                    </label>
                    <div className="pt-options" style={{
                      ...styles.optionGrid,
                      gridTemplateColumns: isMobile
                        ? '1fr'
                        : 'repeat(2, 1fr)',
                    }}>
                      {accommodationOptions.map((opt) => (
                        <button
                          key={opt.id}
                          style={{
                            ...styles.smallOption,
                            borderColor:
                              formData.accommodation === opt.id
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n300)',
                            backgroundColor:
                              formData.accommodation === opt.id
                                ? 'rgba(46,125,94,0.06)'
                                : 'var(--color-n000)',
                            color:
                              formData.accommodation === opt.id
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n900)',
                          }}
                          onClick={() =>
                            updateForm('accommodation', opt.id)
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Daily budget per person *
                    </label>
                    <div className="pt-options" style={{
                      ...styles.optionGrid,
                      gridTemplateColumns: isMobile
                        ? 'repeat(2, 1fr)'
                        : 'repeat(4, 1fr)',
                    }}>
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt.id}
                          style={{
                            ...styles.budgetOption,
                            borderColor:
                              formData.budget === opt.id
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n300)',
                            backgroundColor:
                              formData.budget === opt.id
                                ? 'rgba(46,125,94,0.06)'
                                : 'var(--color-n000)',
                          }}
                          onClick={() =>
                            updateForm('budget', opt.id)
                          }
                        >
                          <span style={{
                            ...styles.budgetLabel,
                            color: formData.budget === opt.id
                              ? 'var(--color-forest-green)'
                              : 'var(--color-n900)',
                          }}>
                            {opt.label}
                          </span>
                          <span style={styles.budgetDesc}>
                            {opt.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ── STEP 4 — Final Details ─────────────── */}
              {step === 4 && (
                <div style={styles.stepContent}>
                  <h2 style={styles.stepTitle}>
                    Anything else we should know?
                  </h2>
                  <p style={styles.stepSubtitle}>
                    Optional details that help us build a
                    better proposal — dietary requirements,
                    special occasions, mobility considerations.
                  </p>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Additional notes
                    </label>
                    <textarea
                      placeholder="Tell us anything that would help us plan the perfect trip for you..."
                      className="pt-input" style={styles.textarea}
                      value={formData.otherInfo}
                      onChange={(e) =>
                        updateForm('otherInfo', e.target.value)
                      }
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      How did you hear about us?
                    </label>
                    <div className="pt-options" style={{
                      ...styles.optionGrid,
                      gridTemplateColumns: isMobile
                        ? 'repeat(2, 1fr)'
                        : 'repeat(3, 1fr)',
                    }}>
                      {howHeardOptions.map((opt) => (
                        <button
                          key={opt}
                          style={{
                            ...styles.smallOption,
                            borderColor:
                              formData.howHeard === opt
                                ? 'var(--color-forest-green)'
                                : 'var(--color-n300)',
                            backgroundColor:
                              formData.howHeard === opt
                                ? 'rgba(46,125,94,0.06)'
                                : 'var(--color-n000)',
                            color: formData.howHeard === opt
                              ? 'var(--color-forest-green)'
                              : 'var(--color-n900)',
                          }}
                          onClick={() =>
                            updateForm('howHeard', opt)
                          }
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary before submission */}
                  <div style={styles.summaryCard}>
                    <span style={styles.summaryTitle}>
                      Your Summary
                    </span>
                    <div style={styles.summaryGrid}>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>Name</span>
                        <span style={styles.summaryValue}>
                          {formData.name}
                        </span>
                      </div>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>Group</span>
                        <span style={styles.summaryValue}>
                          {formData.groupSize || 'Not specified'}
                        </span>
                      </div>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>
                          Traveller type
                        </span>
                        <span style={styles.summaryValue}>
                          {travellerTypes.find(
                            t => t.id === formData.travellerType
                          )?.label || 'Not specified'}
                        </span>
                      </div>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>Budget</span>
                        <span style={styles.summaryValue}>
                          {budgetOptions.find(
                            b => b.id === formData.budget
                          )?.label || 'Not specified'}
                        </span>
                      </div>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>
                          Activities
                        </span>
                        <span style={styles.summaryValue}>
                          {formData.activities.length} selected
                        </span>
                      </div>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>
                          Duration
                        </span>
                        <span style={styles.summaryValue}>
                          {formData.duration || 'Flexible'}
                        </span>
                      </div>
                      <div style={styles.summaryItem}>
                        <span style={styles.summaryLabel}>
                          Places
                        </span>
                        <span style={styles.summaryValue}>
                          {formData.places.length > 0 ? formData.places.join(', ') : 'Open to suggestions'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Navigation buttons */}
              <div style={{
                ...styles.navButtons,
                justifyContent: step === 1
                  ? 'flex-end'
                  : 'space-between',
              }}>

                {step > 1 && (
                  <button
                    style={styles.backBtn}
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <ArrowLeft size={16} color="var(--color-n600)" />
                    <span>Back</span>
                  </button>
                )}

                {step < TOTAL_STEPS ? (
                  <Button
                    variant="primary"
                    style={{
                      opacity: canProceed() ? 1 : 0.5,
                      cursor: canProceed() ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                      if (canProceed()) setStep((s) => s + 1)
                    }}
                  >
                    <span>Continue</span>
                    <ArrowRight
                      size={16}
                      color="var(--color-n900)"
                    />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSending}
                  >
                    {isSending
                      ? 'Sending…'
                      : 'Submit & get my proposal'
                    }
                  </Button>
                )}

              </div>

              {isError && (
                <p style={styles.errorMessage}>
                  Something went wrong. Please try again or
                  email us at {CONTACT_EMAIL}
                </p>
              )}

            </>
          )}

        </div>
      </section>

    </div>
  )
}

const styles = {

  hero: {
    backgroundColor: 'var(--color-forest-deep)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // Warm amber glow — same "candlelight on deep green" treatment as the
  // homepage closing banner, so the brand pages feel like one family.
  heroGlow: {
    position: 'absolute',
    top: '-20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '760px',
    height: '480px',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(244,161,48,0.10) 0%, transparent 65%)',
    pointerEvents: 'none',
  },

  heroTitle: {
    fontFamily: 'var(--font-hero)',
    color: 'var(--color-n000)',
    lineHeight: '1.12',
    margin: '14px 0 0',
  },

  heroTitleThin: {
    fontWeight: '300',
    fontStyle: 'italic',
    opacity: 0.92,
  },

  heroTitleBold: {
    fontWeight: '800',
  },

  heroSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 'var(--leading-body)',
  },

  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-amber)',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
  },

  heroTrustRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '18px',
  },

  heroTrustItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    whiteSpace: 'nowrap',
  },

  heroTrustDot: {
    color: 'rgba(255,255,255,0.3)',
  },

  heroValues: {
    display: 'grid',
    gap: '28px',
    marginTop: '44px',
    paddingTop: '36px',
    borderTop: '1px solid rgba(255,255,255,0.12)',
  },

  heroValue: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  heroValueIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '9px',
    backgroundColor: 'rgba(244,161,48,0.14)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroValueTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-n000)',
    margin: 0,
  },

  heroValueText: {
    fontFamily: 'var(--font-body)',
    fontSize: '13.5px',
    color: 'rgba(255,255,255,0.62)',
    lineHeight: '1.6',
    margin: 0,
  },

  questionnaireSection: {
    backgroundColor: 'var(--color-n100)',
    padding: '28px 40px 60px 40px',
  },

  questionnaireCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: 'var(--radius-lg)',
    maxWidth: '760px',
    margin: '0 auto',
    boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
    border: '1px solid var(--color-n300)',
  },

  progressSection: {
    marginBottom: '36px',
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },

  progressLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  // Desktop step indicator — numbered milestones with a filling connector.
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
  },

  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
  },

  stepCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0,
    transition: 'all 0.25s ease',
  },

  stepLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    transition: 'color 0.25s ease',
  },

  stepConnector: {
    flex: 1,
    height: '2px',
    margin: '0 14px',
    borderRadius: '1px',
    transition: 'background-color 0.25s ease',
  },

  progressTrack: {
    height: '6px',
    backgroundColor: 'var(--color-n300)',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: 'var(--color-forest-green)',
    borderRadius: '3px',
    transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '32px',
  },

  stepTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    margin: 0,
  },

  stepSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
    marginTop: '-10px',
  },

  formRow: {
    display: 'flex',
    gap: '16px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },

  label: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
  },

  input: {
    height: 'var(--touch-target)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
  },

  textarea: {
    height: '120px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '12px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    lineHeight: 'var(--leading-body)',
  },

  optionGrid: {
    display: 'grid',
    gap: '10px',
  },

  optionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '14px',
    borderRadius: '10px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },

  optionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    transition: 'color 0.15s ease',
  },

  optionDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
  },

  sizeOption: {
    height: '48px',
    borderRadius: '10px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    transition: 'all 0.15s ease',
  },

  activitiesGrid: {
    display: 'grid',
    gap: '8px',
  },

  // "Where would you like to go?" — wrapping chip rows in two groups.
  placesHint: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--color-n600)',
    margin: '-4px 0 2px',
  },

  placesGroupLabel: {
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '12px',
    color: 'var(--color-n500)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '4px',
  },

  placesWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },

  placeChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '40px',
    padding: '0 14px',
    borderRadius: '999px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    whiteSpace: 'nowrap',
  },

  activityChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '44px',
    padding: '0 14px',
    borderRadius: '8px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    transition: 'all 0.15s ease',
    textAlign: 'left',
  },

  smallOption: {
    height: '44px',
    padding: '0 14px',
    borderRadius: '8px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    transition: 'all 0.15s ease',
    textAlign: 'left',
  },

  budgetOption: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '12px',
    borderRadius: '10px',
    border: '1.5px solid',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },

  budgetLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    transition: 'color 0.15s ease',
  },

  budgetDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--color-n600)',
  },

  summaryCard: {
    backgroundColor: 'var(--color-n100)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid var(--color-n300)',
  },

  summaryTitle: {
    display: 'block',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    marginBottom: '14px',
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },

  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  summaryLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-n600)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  summaryValue: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
  },

  navButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '44px',
    padding: '0 20px',
    backgroundColor: 'transparent',
    color: 'var(--color-n600)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    cursor: 'pointer',
  },

  errorMessage: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-error)',
    textAlign: 'center',
    marginTop: '12px',
  },

  successState: {
    textAlign: 'center',
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  successIconWrapper: {
    marginBottom: '8px',
  },

  successTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    margin: 0,
  },

  successText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    maxWidth: '480px',
    margin: 0,
  },

}

export default PersonalisedTour