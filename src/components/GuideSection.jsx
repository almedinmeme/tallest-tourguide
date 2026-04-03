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
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useWindowWidth from '../hooks/useWindowWidth'

// Import all five guide photos
import guide1 from '../assets/guide-1.webp'
import guide2 from '../assets/guide-2.webp'
import guide3 from '../assets/guide-3.webp'
import guide4 from '../assets/guide-4.webp'
import guide5 from '../assets/guide-5.webp'

// Photo data — each photo has an src and a caption.
// The caption appears below the main photo and gives
// context about where and what the visitor is seeing.
// Keep captions short — one location, one detail.
const photos = [
  { src: guide1, caption: 'Things Tallest Tourguide & Friends do... ' },
  { src: guide2, caption: 'Early morning Bosnian coffee ceremony' },
  { src: guide3, caption: 'Surviving the Neretva Rafting' },
  { src: guide4, caption: 'Doing a good banter with each other' },
  { src: guide5, caption: 'Forgetting the banter after the lunch'  },
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
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : '72px',
      }}>

        {/* ── LEFT COLUMN — Text Content ──────────────────
            On mobile this appears below the photo carousel
            because the grid collapses to a single column
            and the photo div comes first in the JSX order.
            We deliberately put photos first in JSX so mobile
            visitors see the visual before the text — images
            load faster perceptually and set the emotional
            context for the words that follow. */}
        <div style={styles.textColumn}>

          {/* Section eyebrow — same pattern as every other section */}
          <span style={styles.eyebrow}>Our belief</span>

          {/* Main headline — uses the copy we wrote together */}
          <h2 style={styles.headline}>
              Deeply Local.<br />
         Deeply Commited.
          </h2>

          {/* Subheading */}
          <p style={styles.subheading}>
            Sarajevo isn't just where I work — it's everything I have.
            My family, my people, and the stories that built me are all
            rooted in this city. Starting Tallest Tourguide & Friends was born from a single belief: 
            Bosnia deserves to be seen as it actually is. Not through a tour operator's lens, but through the 
            eyes of someone who lives this story every day. That changes everything about what a tour becomes.
          </p>

          {/* Body copy */}
          <p style={styles.body}>
            You won't be a tourist moving through checkpoints. You'll be a guest — welcomed the 
            way we welcome a friend arriving at the door. I'll share the history, the culture, 
            the complexity of this place, but not as information. As something that matters. Because it does.
          </p>

         <p style={styles.body}>
            What I want most is for you to leave feeling seen — to carry Bosnia with you when you go home and 
            tell people about it, because you felt the presence 
            of real people behind every story. That's why I started this. To be an ambassador for my people.
          </p>

          {/* Pull quote — the single most important sentence.
              Displayed with a Forest Green left border — a typographic
              pattern called a blockquote that signals to scanning visitors
              "this is the most important thing this person said."
              Italic style reinforces that this is a direct, personal statement
              rather than marketing copy. */}
          <blockquote style={styles.pullQuote}>
            "And none of this works alone. Every person you meet through us — your guide, your driver, 
            the person cooking your meal — is someone I deeply trust.  <br />They believe, the way I do, 
            that every single guest is valuable. That this work matters. 
            That Bosnia deserves to be known by people who actually love it"
          </blockquote>
         

        </div>

        {/* ── RIGHT COLUMN — Photo Carousel ──────────────
            On mobile this appears first — full width,
            with arrow buttons for navigation.
            On desktop it sits beside the text column. */}
        <div style={styles.photoColumn}>

          {/* Main photo display */}
          <div style={styles.mainPhotoWrapper}>

            {/* The photo itself — objectFit cover keeps it
                perfectly cropped regardless of the source dimensions */}
            <img
              src={photos[selectedPhoto].src}
              alt={photos[selectedPhoto].caption}
              style={styles.mainPhoto}
            />

            {/* Left arrow — navigates to previous photo.
                Positioned absolutely over the photo's left edge.
                Large enough to tap comfortably on mobile. */}
            <button
              style={{ ...styles.arrowBtn, left: '12px' }}
              onClick={handlePrev}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} color="var(--color-n000)" />
            </button>

            {/* Right arrow — navigates to next photo */}
            <button
              style={{ ...styles.arrowBtn, right: '12px' }}
              onClick={handleNext}
              aria-label="Next photo"
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
                    // Active thumbnail gets a Forest Green border
                    // so visitors can see which photo is displayed.
                    // Opacity on inactive thumbnails creates visual
                    // hierarchy — the selected one reads as "current."
                    border: selectedPhoto === index
                      ? '2px solid var(--color-forest-green)'
                      : '2px solid transparent',
                    opacity: selectedPhoto === index ? 1 : 0.6,
                  }}
                  aria-label={`View photo ${index + 1}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
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
                    backgroundColor: selectedPhoto === index
                      ? 'var(--color-forest-green)'
                      : 'var(--color-n300)',
                    transform: selectedPhoto === index
                      ? 'scale(1.3)'
                      : 'scale(1)',
                  }}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          )}

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
    gap: '0px',
  },

  eyebrow: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
    fontSize: 'var(--text-small)',
    color: 'var(--color-forest-green)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },

  headline: {
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: 'var(--text-h1)',
    color: 'var(--color-n900)',
    lineHeight: '1.2',
    marginBottom: '20px',
  },

  subheading: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '20px',
  },

  body: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-body)',
    color: 'var(--color-n600)',
    lineHeight: 'var(--leading-body)',
    marginBottom: '28px',
  },

  // The pull quote uses a Forest Green left border —
  // a classic typographic blockquote treatment.
  // The italic style signals personal voice rather than
  // marketing language. Pale amber background gives it
  // warmth without competing with the text beside it.
  pullQuote: {
    borderLeft: '4px solid var(--color-forest-green)',
    backgroundColor: 'var(--color-amber-light)',
    padding: '16px 20px',
    borderRadius: '0 8px 8px 0',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: 'var(--text-body-l)',
    color: 'var(--color-n900)',
    fontStyle: 'italic',
    lineHeight: '1.5',
    margin: '0',
  },

  aboutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
    padding: '0 20px',
    backgroundColor: 'transparent',
    color: 'var(--color-forest-green)',
    fontFamily: 'var(--font-body)',
    fontWeight: '700',
    fontSize: 'var(--text-small)',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    border: '1.5px solid var(--color-forest-green)',
    width: 'fit-content',
    marginTop: '8px',
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
    borderRadius: '12px',
    overflow: 'hidden',
    aspectRatio: '4/3',
    backgroundColor: 'var(--color-n300)',
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

  // Arrow buttons sit over the photo on left and right edges.
  // Semi-transparent dark background ensures they're visible
  // against any photo colour — light or dark.
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.45)',
    border: 'none',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'var(--color-n000)',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: 'var(--text-tiny)',
    padding: '4px 8px',
    borderRadius: '4px',
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
    borderRadius: '6px',
    overflow: 'hidden',
    cursor: 'pointer',
    padding: 0,
    background: 'none',
    transition: 'opacity 0.15s ease, border 0.15s ease',
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
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  },
}

export default GuideSection