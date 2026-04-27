import { Search, CalendarCheck, Smile } from 'lucide-react'
import { useState, useRef } from 'react'
import useWindowWidth from '../hooks/useWindowWidth'

const steps = [
  {
    id: 1,
    icon: Search,
    label: 'Browse Our Tours',
    description: 'Find the experience that fits your time, curiosity, and travel style.',
  },
  {
    id: 2,
    icon: CalendarCheck,
    label: 'Send a Booking Request',
    description: 'Pick your date and group size. We confirm within 24 hours.',
  },
  {
    id: 3,
    icon: Smile,
    label: 'Show Up & Enjoy',
    description: 'Just arrive curious. Everything else is taken care of.',
  },
]

function HowItWorks() {
  const width = useWindowWidth()
  const isMobile = width <= 768
  const [activeStep, setActiveStep] = useState(0)
  const touchStartX = useRef(null)

  return (
    <section style={styles.section}>

      <div style={styles.header}>
        <span style={styles.eyebrow}>Simple Process</span>
        <h2 style={styles.title}>How It Works</h2>
        <p style={styles.subtitle}>
          From first click to first story — here's what to expect
          when you book with Tallest Tourguide.
        </p>
      </div>

      {isMobile ? (
        <>
          <div
            style={styles.mobileCarouselWrapper}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return
              const delta = touchStartX.current - e.changedTouches[0].clientX
              if (Math.abs(delta) > 40) {
                if (delta > 0) setActiveStep((p) => Math.min(steps.length - 1, p + 1))
                else setActiveStep((p) => Math.max(0, p - 1))
              }
              touchStartX.current = null
            }}
          >
            <div style={{
              ...styles.mobileTrack,
              transform: `translateX(-${activeStep * 100}%)`,
            }}>
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <div key={step.id} style={styles.mobileSlide}>
                    <div style={styles.step}>
                      <span style={styles.stepNumber}>0{step.id}</span>
                      <div style={styles.iconCircle}>
                        <Icon size={26} color="var(--color-n000)" strokeWidth={1.8} />
                      </div>
                      <div style={styles.stepDivider} />
                      <h3 style={styles.stepLabel}>{step.label}</h3>
                      <p style={styles.stepDescription}>{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={styles.mobileDots}>
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  ...styles.dot,
                  width: activeStep === i ? '24px' : '8px',
                  backgroundColor: activeStep === i
                    ? 'var(--color-forest-green)'
                    : 'var(--color-n300)',
                }}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div style={{ ...styles.stepsGrid, gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '860px' }}>
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.id} style={styles.step}>
                <span style={styles.stepNumber}>0{step.id}</span>
                <div style={styles.iconCircle}>
                  <Icon size={26} color="var(--color-n000)" strokeWidth={1.8} />
                </div>
                <div style={styles.stepDivider} />
                <h3 style={styles.stepLabel}>{step.label}</h3>
                <p style={styles.stepDescription}>{step.description}</p>
              </div>
            )
          })}
        </div>
      )}

    </section>
  )
}

const styles = {
  section: {
    backgroundColor: 'var(--color-n000)',
    padding: '88px 40px',
  },

  header: {
    textAlign: 'center',
    maxWidth: '560px',
    margin: '0 auto 64px auto',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    marginBottom: '16px',
  },

  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
  },

  stepsGrid: {
    display: 'grid',
    gap: '40px',
    margin: '0 auto',
  },

  mobileCarouselWrapper: {
    overflow: 'hidden',
    width: '100%',
    maxWidth: '340px',
    margin: '0 auto',
  },

  mobileTrack: {
    display: 'flex',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  mobileSlide: {
    minWidth: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  mobileDots: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '28px',
  },

  dot: {
    height: '8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'width 0.3s ease, background-color 0.3s ease',
  },

  // Each step is a self-contained column.
  // All children are centered — number, icon, divider, text.
  // Because everything is centered within its own column,
  // alignment across columns is automatic and never breaks
  // regardless of text length or window width.
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0px',
  },

  stepNumber: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    color: 'var(--color-mid-green)',
    letterSpacing: '2px',
    marginBottom: '12px',
  },

  iconCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-forest-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    // Subtle shadow lifts the circle off the white background
    // giving it gentle depth without being heavy-handed.
    boxShadow: '0 4px 16px rgba(46, 125, 94, 0.25)',
  },

  // Short decorative divider below the icon.
  // Forest Green colour ties it to the icon above it.
  // Width is intentionally narrow — it's a visual breath,
  // not a structural element.
  stepDivider: {
    width: '32px',
    height: '3px',
    borderRadius: '2px',
    backgroundColor: 'var(--color-amber)',
    marginBottom: '20px',
  },

  stepLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '20px',
    color: 'var(--color-n900)',
    marginBottom: '10px',
    lineHeight: '1.3',
  },

  stepDescription: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    maxWidth: '220px',  // Constrains line length for readability
  },
}

export default HowItWorks