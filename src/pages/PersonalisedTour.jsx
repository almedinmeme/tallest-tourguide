// PersonalisedTour.jsx
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
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, CheckCircle,
  Sparkles, Users, Calendar, Heart,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import useWindowWidth from '../hooks/useWindowWidth'

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

    const templateParams = {
      tour_name: 'Personalised Tour Package — Questionnaire',
      guest_name: formData.name,
      guest_email: formData.email,
      guest_phone: formData.phone || 'Not provided',
      tour_date: `${formData.arrivalDate || 'Flexible'} to ${formData.departureDate || 'Flexible'}`,
      num_people: formData.groupSize,
      total_price: `Budget: ${budgetOptions.find(b => b.id === formData.budget)?.label || 'Not specified'}`,
      traveller_type: travellerTypes.find(t => t.id === formData.travellerType)?.label || '',
      activities: selectedActivities,
      accommodation: formData.accommodation,
      other_info: formData.otherInfo || 'None provided',
      how_heard: formData.howHeard || 'Not specified',
    }

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => { setIsSending(false); setIsSuccess(true) })
    .catch(() => { setIsSending(false); setIsError(true) })
  }

  return (
    <div>
      <SEO
  title="Personalised Tour Package"
  description="Build a custom Bosnia itinerary around your interests. Private guide, flexible dates, accommodation arranged on request. Fill in our short questionnaire."
  url="/personalised"
/>

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroIconWrapper}>
            <Sparkles
              size={28}
              color="var(--color-amber)"
              strokeWidth={1.5}
            />
          </div>
          <span style={styles.eyebrow}>Personalised Tour Package</span>
          <h1 style={{
            ...styles.heroTitle,
            fontSize: isMobile ? '32px' : '52px',
          }}>
            Your Bosnia.<br />
            Your Way.
          </h1>
          <p style={styles.heroSubtitle}>
            Tell us what you're curious about and we'll build
            an itinerary around you — not the other way around.
          </p>
        </div>
      </section>

      {/* ── WHY CHOOSE PERSONALISED ─────────────────────── */}
      <section style={styles.whySection}>
        <div style={{
          ...styles.whyGrid,
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        }}>

          {[
            {
              icon: Sparkles,
              title: 'Built Around You',
              text: 'Every stop, experience, and meal is chosen for your interests — not pulled from a template.',
            },
            {
              icon: Users,
              title: 'Private Guide',
              text: 'No shared groups. Your guide\'s full attention, your pace, your questions answered fully.',
            },
            {
              icon: Heart,
              title: 'Local Knowledge',
              text: 'Places that don\'t appear on Google Maps. People who live here. Stories you won\'t read anywhere.',
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} style={styles.whyCard}>
                <div style={styles.whyIconWrapper}>
                  <Icon
                    size={20}
                    color="var(--color-forest-green)"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 style={styles.whyTitle}>{item.title}</h3>
                <p style={styles.whyText}>{item.text}</p>
              </div>
            )
          })}

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
              <Link to="/" style={styles.successBtn}>
                Back to Homepage
              </Link>
            </div>

          ) : (

            <>
              {/* Progress bar */}
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>
                    Step {step} of {TOTAL_STEPS}
                  </span>
                  <span style={styles.progressPercent}>
                    {Math.round((step / TOTAL_STEPS) * 100)}%
                  </span>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${(step / TOTAL_STEPS) * 100}%`,
                  }} />
                </div>
              </div>

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
                        style={styles.input}
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
                        style={styles.input}
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
                      style={styles.input}
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
                    <div style={{
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
                    <div style={{
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
                        style={styles.input}
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
                        style={styles.input}
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
                    <div style={{
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
                    <div style={{
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
                    <div style={{
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
                    <div style={{
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
                      style={styles.textarea}
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
                    <div style={{
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
                  <button
                    style={{
                      ...styles.nextBtn,
                      opacity: canProceed() ? 1 : 0.5,
                      cursor: canProceed()
                        ? 'pointer'
                        : 'not-allowed',
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
                  </button>
                ) : (
                  <button
                    style={{
                      ...styles.submitBtn,
                      opacity: isSending ? 0.7 : 1,
                      cursor: isSending
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                    onClick={handleSubmit}
                    disabled={isSending}
                  >
                    {isSending
                      ? 'Sending...'
                      : 'Submit & Get My Proposal'
                    }
                  </button>
                )}

              </div>

              {isError && (
                <p style={styles.errorMessage}>
                  Something went wrong. Please try again or
                  email us at hello@tallesttourguide.com
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

  heroInner: {
    maxWidth: '600px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  heroIconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    backgroundColor: 'rgba(244,161,48,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },

  hero: {
    backgroundColor: 'var(--color-forest-green)',  // Green instead of near-black
    padding: '80px 40px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: 'var(--color-n000)',
    lineHeight: '1.15',
    margin: 0,
  },

  heroSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-amber-light)',  // Amber light instead of grey
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-mid-green)',  // Mid green eyebrow
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },

 whySection: {
    backgroundColor: 'var(--color-n100)',
    padding: '64px 40px',
  },

  whyGrid: {
    display: 'grid',
    gap: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  },

  whyCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '24px',
    backgroundColor: 'var(--color-n100)',
    borderRadius: '12px',
    border: '1px solid var(--color-n300)',
  },

  whyIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(46,125,94,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  whyTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h3)',
    color: 'var(--color-n900)',
    margin: 0,
  },

  whyText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    margin: 0,
  },

  questionnaireSection: {
    backgroundColor: 'var(--color-n100)',
    padding: '64px 40px 80px 40px',
  },

  questionnaireCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '20px',
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

  progressPercent: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
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
    fontSize: '11px',
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

  nextBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '48px',
    padding: '0 28px',
    backgroundColor: 'var(--color-amber)',
    color: 'var(--color-n900)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    transition: 'opacity 0.15s ease',
  },

  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '48px',
    padding: '0 28px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    transition: 'opacity 0.15s ease',
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

  successBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    height: '48px',
    padding: '0 28px',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    marginTop: '8px',
  },
}

export default PersonalisedTour
