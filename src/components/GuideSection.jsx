// GuideSection.jsx
// The most personal section on the entire site.
// It introduces the guide — the human being behind the business —
// using a photo carousel, personal copy, and a pull quote.
//
// The carousel uses a single piece of state: selectedPhoto,
// which is the index (0-4) of the currently displayed photo.
// Clicking a thumbnail or an arrow updates that index,
// React rerenders the main photo instantly.
// No libraries needed — pure useState logic you already know.
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'
import Img from './Img'

// Photo data — each photo has an src and a caption.
// The caption appears below the main photo and gives
// context about where and what the visitor is seeing.
// Keep captions short — one location, one detail.
//
// Paths point at /uploads/ (not a src/assets import) so they go through Img
// and get the same 480/960/1600w responsive variants as admin-uploaded
// content — these five files were already sitting in public/uploads/,
// byte-identical to the old src/assets copies, just unreferenced.
const photos = [
  { src: '/uploads/guide-1.webp', caption: 'Things Tallest Tourguide & Friends do... ' },
  { src: '/uploads/guide-2.webp', caption: 'Early morning Bosnian coffee ceremony' },
  { src: '/uploads/guide-3.webp', caption: 'Surviving the Neretva Rafting' },
  { src: '/uploads/guide-4.webp', caption: 'Doing a good banter with each other' },
  { src: '/uploads/guide-5.webp', caption: 'Forgetting the banter after the lunch'  },
]

function GuideSection() {
  const width = useWindowWidth()
  const isMobile = width <= 768

  // selectedPhoto is the index of the currently visible photo.
  // Starts at 0 — the Baščaršija group shot.
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  // Navigate to the previous photo.
  // The modulo operator (%) wraps around — if you're at index 0
  // and go back, it wraps to the last photo (index 4).
  // Think of it like a circular array — no dead ends.
  const handlePrev = () => {
    setSelectedPhoto((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Navigate to the next photo — wraps from last back to first.
  const handleNext = () => {
    setSelectedPhoto((prev) => (prev + 1) % photos.length)
  }

  return (
    <section style={styles.section}>
      <div style={{
        ...styles.inner,
        gridTemplateColumns: isMobile ? '1fr' : '55% 1fr',
        gap: isMobile ? '40px' : '64px',
      }}>

        {/* ── LEFT COLUMN — Photo Carousel ──────────────
            Photo leads on both desktop and mobile —
            the visual sets the emotional tone before the words. */}
        <div style={styles.photoColumn}>

          {/* Main photo display */}
          <div style={styles.mainPhotoWrapper}>

            {/* The photo itself — objectFit cover keeps it
                perfectly cropped regardless of the source dimensions */}
            <Img
              src={photos[selectedPhoto].src}
              alt={photos[selectedPhoto].caption}
              sizes="(min-width: 900px) 570px, 90vw"
              style={styles.mainPhoto}
            />

            {/* Left arrow — navigates to previous photo.
                Positioned absolutely over the photo's left edge.
                Large enough to tap comfortably on mobile. */}
            <button
              style={{ ...styles.arrowBtn, left: '12px' }}
              onClick={handlePrev}
              aria-label="Previous photo"
              className="btn-overlay"
            >
              <ChevronLeft size={20} color="var(--color-n000)" />
            </button>

            {/* Right arrow — navigates to next photo */}
            <button
              style={{ ...styles.arrowBtn, right: '12px' }}
              onClick={handleNext}
              aria-label="Next photo"
              className="btn-overlay"
            >
              <ChevronRight size={20} color="var(--color-n000)" />
            </button>

            {/* Photo counter — "1 / 5" style indicator.
                Sits in the bottom right corner of the photo.
                Tells visitors how many photos exist without
                requiring them to click through all of them
                to find out. Small detail, reduces anxiety. */}
            <div style={styles.photoCounter}>
              {selectedPhoto + 1} / {photos.length}
            </div>

          </div>

          {/* Caption below the main photo */}
          <p style={styles.caption}>
            {photos[selectedPhoto].caption}
          </p>

          {/* Thumbnail strip — hidden on mobile to keep the
              layout clean. Arrow buttons provide sufficient
              navigation on small screens without the visual
              clutter of five small thumbnails in a row. */}
          {!isMobile && (
            <div style={styles.thumbnails}>
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(index)}
                  style={{
                    ...styles.thumbnail,
                    // Active thumbnail gets a Forest Green ring so visitors
                    // can see which photo is displayed; the offset ring
                    // (border + box-shadow) reads cleaner than a border that
                    // eats into the image itself.
                    boxShadow: selectedPhoto === index
                      ? '0 0 0 2px var(--color-n000), 0 0 0 4px var(--color-forest-green)'
                      : 'none',
                    opacity: selectedPhoto === index ? 1 : 0.55,
                  }}
                  aria-label={`View photo ${index + 1}`}
                >
                  <Img
                    src={photo.src}
                    alt={photo.caption}
                    sizes="110px"
                    style={styles.thumbnailImg}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Mobile dot indicators — shown instead of thumbnails.
              Five dots, one per photo, filled dot = current photo.
              A universally understood mobile carousel pattern. */}
          {isMobile && (
            <div style={styles.dots}>
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(index)}
                  style={{
                    ...styles.dot,
                    // Morphing pill indicator — the active dot stretches to a
                    // pill rather than just scaling up, matching the carousel
                    // dots on the packages preview below.
                    width: selectedPhoto === index ? '22px' : '8px',
                    backgroundColor: selectedPhoto === index
                      ? 'var(--color-forest-green)'
                      : 'var(--color-n300)',
                  }}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN — Text ─────────────────────── */}
        <div style={styles.textColumn}>

          <span style={styles.eyebrow}>Our belief</span>

          <h2 style={styles.headline}>
            Deeply local.<br />
            Deeply committed.
          </h2>

          <p style={styles.subheading}>
            Sarajevo isn't just where I work — it's everything I have.
            Tallest Tourguide & Friends was born from one belief: Bosnia deserves
            to be seen through the eyes of someone who lives this story every day,
            not through a tour operator's lens.
          </p>

          {/* Open quote, not a box — matches the testimonial treatment used
              on Consult: a serif quote mark and italic Newsreader voice read
              as personal, where a filled callout box would read as a warning
              or a marketing pull-out. */}
          <blockquote style={styles.pullQuote}>
            <span aria-hidden style={styles.quoteMark}>“</span>
            <p style={styles.pullQuoteText}>
              Every person you meet through us — your guide, your driver,
              the person cooking your meal — is someone I deeply trust.
              Bosnia deserves to be known by people who actually love it.
            </p>
          </blockquote>

        </div>

      </div>
    </section>
  )
}

const styles = {
  section: {
    backgroundColor: 'var(--color-n000)',
    padding: '88px 40px',
  },

  // Two-column grid on desktop — collapses to single
  // column on mobile via the inline style override above.
  inner: {
    display: 'grid',
    maxWidth: '1100px',
    margin: '0 auto',
    alignItems: 'center',
  },

  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    justifyContent: 'center',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: '13px',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '14px',
  },

  // Newsreader serif — the editorial voice used across the redesigned
  // pages (Consult, Signature, Where We Stay) rather than the sans display
  // face, so the site's most personal section reads like it's spoken, not
  // typeset by a marketing template.
  headline: {
    fontFamily: 'var(--font-hero)',
    fontWeight: 400,
    fontSize: 'clamp(30px, 3.8vw, 44px)',
    letterSpacing: '-0.015em',
    color: 'var(--color-n900)',
    lineHeight: '1.15',
    marginBottom: '22px',
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n700)',
    lineHeight: '1.7',
    marginBottom: '28px',
  },

  // Open quote, not a box — a large amber serif quote mark and an italic
  // Newsreader voice, set off by a hairline rather than a filled amber
  // panel. Reads as someone speaking, not a highlighted marketing callout.
  pullQuote: {
    position: 'relative',
    margin: 0,
    paddingTop: '20px',
    borderTop: '2px solid var(--color-n200)',
  },

  quoteMark: {
    position: 'absolute',
    top: '4px',
    left: 0,
    fontFamily: 'var(--font-hero)',
    fontSize: '52px',
    lineHeight: 1,
    color: 'var(--color-amber)',
    opacity: 0.7,
  },

  pullQuoteText: {
    fontFamily: 'var(--font-hero)',
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 'clamp(18px, 1.9vw, 21px)',
    lineHeight: '1.55',
    color: 'var(--color-n800)',
    margin: '10px 0 0',
    paddingLeft: '4px',
  },

  photoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  // position: relative allows the arrow buttons and counter
  // to be positioned absolutely inside the photo frame.
  mainPhotoWrapper: {
    position: 'relative',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    aspectRatio: '4/3',
    backgroundColor: 'var(--color-n300)',
    boxShadow: 'var(--shadow-sm)',
  },

  mainPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    // Smooth crossfade when photo changes —
    // achieved with a CSS transition on opacity.
    transition: 'opacity 0.2s ease',
  },

  // Arrow buttons sit over the photo on left and right edges. The glass
  // pill treatment (dark scrim + blur + thin light border) matches the
  // overlay chrome used on cinematic hero photos elsewhere on the site,
  // rather than a flat black circle.
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(10,16,20,0.42)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },

  photoCounter: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(10,16,20,0.42)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-tiny)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
  },

  caption: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-small)',
    color: 'var(--color-n600)',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  thumbnails: {
    display: 'flex',
    gap: '8px',
  },

  thumbnail: {
    flex: 1,
    aspectRatio: '4/3',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    cursor: 'pointer',
    padding: 0,
    border: 'none',
    background: 'none',
    transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
  },

  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    paddingTop: '4px',
  },

  dot: {
    height: '8px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'width 0.25s ease, background-color 0.2s ease',
  },
}

export default GuideSection