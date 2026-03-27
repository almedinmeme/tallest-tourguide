// Contact.jsx
// This page serves visitors who have questions before booking,
// want a custom or private tour, or simply want to reach a human.
// It uses the same EmailJS setup as TourDetail.jsx —
// the same service, but a different template that we'll set up
// to deliver messages formatted as general enquiries rather
// than booking requests.
//
// Note: We're reusing the same EmailJS service ID but we'll
// create a second template specifically for contact messages.
// This keeps your inbox organised — booking requests look different
// from general enquiries so you know how to prioritise responses.

import { useState } from 'react'
import emailjs from '@emailjs/browser'

function Contact() {

  // Each piece of form data gets its own state variable.
  // This is the same pattern you used in TourDetail —
  // React watches each value and rerenders the form
  // whenever any of them changes.
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  // These three control the submission feedback UI —
  // exactly the same pattern as TourDetail.
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = () => {

    // Validate that the essential fields are filled.
    // Subject is optional — some people just want to say hello.
    if (!name || !email || !message) {
      alert('Please fill in your name, email, and message.')
      return
    }

    setIsSending(true)
    setIsError(false)

    // These placeholder names must match exactly what you set up
    // in your second EmailJS template — we'll create that template
    // together after you've seen this page working in the browser.
    const templateParams = {
      contact_name: name,
      contact_email: email,
      contact_subject: subject || 'General Enquiry',
      contact_message: message,
    }

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setIsSending(false)
      setIsSuccess(true)
    })
    .catch(() => {
      setIsSending(false)
      setIsError(true)
    })
  }

  return (
    <div>

      {/* ── PAGE HEADER ───────────────────────────────────
          Same green header pattern as the Tours page —
          consistent visual language across all pages
          signals a professional, considered design. */}
      <section style={styles.pageHeader}>
        <div style={styles.headerInner}>
          <span style={styles.eyebrow}>Get In Touch</span>
          <h1 style={styles.headline}>Let's Talk</h1>
          <p style={styles.subheading}>
            Have a question, a custom tour request, or want to
            arrange a private group experience? Send a message
            and you'll hear back within 24 hours.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────
          Two-column layout — same grid pattern as TourDetail.
          Contact info on the left, form on the right.
          We put the info on the left deliberately: visitors
          read left to right, so they encounter your human
          details first before they see the form. This reduces
          the feeling that they're submitting into a void. */}
      <section style={styles.contentSection}>
        <div style={styles.contentGrid}>

          {/* ── LEFT COLUMN — Contact Info ─────────────── */}
          <div style={styles.infoColumn}>

            <h2 style={styles.infoTitle}>
              Come Find Us in Sarajevo
            </h2>

            <p style={styles.infoText}>
              Every tour starts and ends in the heart of Sarajevo.
              Whether you're planning your first visit or your fifth,
              we're happy to help you make the most of your time in Bosnia.
            </p>

            {/* Contact details — each as a small info block */}
            <div style={styles.contactDetails}>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>📍</span>
                <div>
                  <span style={styles.detailLabel}>Location</span>
                  <span style={styles.detailValue}>
                    Sarajevo, Bosnia & Herzegovina
                  </span>
                </div>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>✉️</span>
                <div>
                  <span style={styles.detailLabel}>Email</span>
                  
                    <a href="mailto:hello@tallesttourguide.com"
                    style={styles.detailLink}
                  >
                    hello@tallesttourguide.com
                  </a>
                </div>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>⏱</span>
                <div>
                  <span style={styles.detailLabel}>Response Time</span>
                  <span style={styles.detailValue}>
                    Within 24 hours
                  </span>
                </div>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>🗣️</span>
                <div>
                  <span style={styles.detailLabel}>Languages</span>
                  <span style={styles.detailValue}>
                    English, Bosnian
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ── RIGHT COLUMN — Contact Form ────────────── */}
          <div style={styles.formColumn}>
            <div style={styles.formCard}>

              {/* Same conditional rendering pattern as TourDetail —
                  swap the form for a success message on completion.
                  Once you've seen this pattern twice, you'll notice
                  it everywhere in React applications. */}
              {isSuccess ? (

                <div style={styles.successMessage}>
                  <span style={styles.successIcon}>✓</span>
                  <h3 style={styles.successTitle}>Message Received!</h3>
                  <p style={styles.successText}>
                    Thanks {name}. Your message has been received and
                    you'll hear back within 24 hours at {email}.
                  </p>
                </div>

              ) : (

                <>
                  {/* Two inputs side by side on the same row —
                      name and email. The formRow div uses flexbox
                      to place them next to each other with a gap. */}
                  <div style={styles.formRow}>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Your Name</label>
                      <input
                        type="text"
                        placeholder="Ana Kovačević"
                        style={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Email Address</label>
                      <input
                        type="email"
                        placeholder="ana@example.com"
                        style={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Subject
                      <span style={styles.optional}> — optional</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Private group tour for 12 people"
                      style={styles.input}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  {/* Textarea for the message — note that textarea
                      uses a different style than input because it's
                      a multi-line element. We give it a fixed height
                      and allow vertical resizing only so it can't
                      break the layout by being dragged horizontally. */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message</label>
                    <textarea
                      placeholder="Tell us about your group, travel dates, or any questions you have..."
                      style={styles.textarea}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    style={{
                      ...styles.submitBtn,
                      opacity: isSending ? 0.7 : 1,
                      cursor: isSending ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleSubmit}
                    disabled={isSending}
                  >
                    {isSending ? 'Sending...' : 'Send Message'}
                  </button>

                  {isError && (
                    <p style={styles.errorMessage}>
                      Something went wrong. Please try emailing us directly
                      at hello@tallesttourguide.com
                    </p>
                  )}
                </>

              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: 'var(--color-forest-green)',
    padding: '72px 40px',
  },

  headerInner: {
    maxWidth: '680px',
    margin: '0 auto',
    textAlign: 'center',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-mid-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h1)',
    color: 'var(--color-n000)',
    marginBottom: '16px',
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-amber-light)',
    lineHeight: 'var(--leading-body)',
  },

  contentSection: {
    padding: '72px 40px 80px 40px',
    backgroundColor: 'var(--color-n100)',
  },

  // Same two-column grid as TourDetail —
  // left column for info, right column for the form card.
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr',
    gap: '64px',
    maxWidth: '1100px',
    margin: '0 auto',
    alignItems: 'start',
  },

  infoColumn: {
    paddingTop: '8px',
  },

  infoTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h2)',
    color: 'var(--color-n900)',
    marginBottom: '16px',
    lineHeight: '1.3',
  },

  infoText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '40px',
  },

  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },

  detailIcon: {
    fontSize: '20px',
    marginTop: '2px',
  },

  detailLabel: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n900)',
    marginBottom: '4px',
  },

  detailValue: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
  },

  detailLink: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-forest-green)',
    textDecoration: 'none',
  },

  formColumn: {},

  formCard: {
    backgroundColor: 'var(--color-n000)',
    borderRadius: '16px',
    padding: '36px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid var(--color-n300)',
  },

  // flexbox row that places two form fields side by side.
  // Each child formGroup takes equal space via flex: 1.
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '0px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    flex: 1,
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
    height: 'var(--touch-target)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '0 12px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
  },

  // Textarea is like an input but taller and multiline.
  // resize: vertical means the visitor can make it taller
  // if they need more space, but not wider — protecting the layout.
  textarea: {
    height: '160px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--color-n300)',
    padding: '12px',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n900)',
    backgroundColor: 'var(--color-n000)',
    width: '100%',
    resize: 'vertical',
    lineHeight: 'var(--leading-body)',
  },

  submitBtn: {
    width: '100%',
    height: 'var(--touch-target)',
    backgroundColor: 'var(--color-forest-green)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-body)',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '12px',
  },

  successMessage: {
    textAlign: 'center',
    padding: '24px 0',
  },

  successIcon: {
    display: 'block',
    fontSize: '48px',
    color: 'var(--color-success)',
    marginBottom: '16px',
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
}

export default Contact