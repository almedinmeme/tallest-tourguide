import { Search, CalendarCheck, Smile } from 'lucide-react'
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

      {/* Steps grid — three equal columns on desktop,
          single column on mobile. Using CSS grid instead
          of flexbox gives us perfect equal-width columns
          with no fighting between content and connectors.
          Every element in each column aligns to the same
          invisible grid lines automatically. */}
      <div style={{
        ...styles.stepsGrid,
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        maxWidth: isMobile ? '400px' : '860px',
      }}>

        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <div key={step.id} style={styles.step}>

              {/* Step number */}
              <span style={styles.stepNumber}>0{step.id}</span>

              {/* Icon circle */}
              <div style={styles.iconCircle}>
                <Icon size={26} color="var(--color-n000)" strokeWidth={1.8} />
              </div>

              {/* Divider line below icon — a short decorative
                  line that visually separates the icon from the
                  text below it. Cleaner than a connector between
                  steps and keeps every column self-contained
                  so alignment is never dependent on adjacent columns. */}
              <div style={styles.stepDivider} />

              {/* Step text */}
              <h3 style={styles.stepLabel}>{step.label}</h3>
              <p style={styles.stepDescription}>{step.description}</p>

            </div>
          )
        })}

      </div>

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