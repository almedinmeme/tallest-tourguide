// GuideSection.jsx
// The most personal section on the entire site — the belief, the people it was
// earned with, and the promise underneath it.
//
// Laid out as a contact sheet rather than a carousel: the statement across the
// top, all five photographs in one horizontal rail below it, and the promise
// closing the section under a hairline. Every photo is on screen (or one
// flick away) instead of hidden behind arrows, and because the rail scrolls
// sideways it costs the same vertical space on a phone as a single photo does.
//
// All five source files are 4:3 group shots, so the tiles stay 4:3 — a
// portrait crop would cut half the group out of every one of them.
//
// The scrollbar is hidden in favour of a progress line, and the arrows are
// hidden on touch, where the rail is swiped instead.
import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import useInView from '../hooks/useInView'
import Img from './Img'

// Photo data — each photo has an src and a caption.
// The caption sits under its tile, numbered, contact-sheet style, so keep
// them short — one location, one detail.
//
// Paths point at /uploads/ (not a src/assets import) so they go through Img
// and get the same 480/960/1600w responsive variants as admin-uploaded
// content — these five files were already sitting in public/uploads/,
// byte-identical to the old src/assets copies, just unreferenced.
const photos = [
  { src: '/uploads/guide-1.webp', caption: 'Things Tallest Tourguide & Friends do...' },
  { src: '/uploads/guide-2.webp', caption: 'Early morning Bosnian coffee ceremony' },
  { src: '/uploads/guide-3.webp', caption: 'Surviving the Neretva Rafting' },
  { src: '/uploads/guide-4.webp', caption: 'Doing a good banter with each other' },
  { src: '/uploads/guide-5.webp', caption: 'Forgetting the banter after the lunch' },
]

const RAIL_GAP = 20

const css = `
  .gs {
    background-color: var(--color-n000);
    padding: 96px 40px;
  }
  .gs__inner { max-width: 1200px; margin: 0 auto; }

  /* Header and footer share one column split, so the lede above the rail and
     the attribution below it sit on the same vertical spine. */
  .gs__head,
  .gs__foot {
    display: grid;
    grid-template-columns: 1.55fr 1fr;
    gap: 56px;
  }
  .gs__head { align-items: end; margin-bottom: 44px; }

  .gs__eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 18px;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-forest-green);
  }
  .gs__eyebrow::before {
    content: '';
    width: 28px;
    height: 1px;
    background: currentColor;
    opacity: 0.5;
  }

  /* Newsreader, set large and loose in weight — the site's editorial voice
     rather than the display sans, because this section is someone talking. */
  .gs__h2 {
    margin: 0;
    font-family: var(--font-hero);
    font-weight: 400;
    font-size: clamp(34px, 4.4vw, 54px);
    line-height: 1.06;
    letter-spacing: -0.025em;
    color: var(--color-n900);
  }

  .gs__lede {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-body-l);
    line-height: 1.75;
    color: var(--color-n600);
  }

  /* ── The contact sheet ─────────────────────────────────────── */
  .gs__rail {
    display: flex;
    align-items: start;
    gap: ${RAIL_GAP}px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    -ms-overflow-style: none;
    /* The focus ring on the rail itself needs somewhere to land. */
    padding: 2px 2px 6px;
    margin: -2px -2px -6px;
  }
  .gs__rail::-webkit-scrollbar { display: none; }
  .gs__rail:focus-visible {
    outline: 2px solid var(--color-forest-green);
    outline-offset: 4px;
    border-radius: var(--radius);
  }

  .gs__tile {
    flex: 0 0 380px;
    scroll-snap-align: start;
  }
  .gs__frame {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background-color: var(--color-n200);
  }
  .gs__shot {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.22,0.61,0.36,1);
  }
  .gs__tile:hover .gs__shot { transform: scale(1.045); }

  .gs__caption {
    display: flex;
    gap: 10px;
    margin: 14px 2px 0;
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.45;
    color: var(--color-n500);
    transition: color 0.2s ease;
  }
  .gs__tile:hover .gs__caption { color: var(--color-n800); }
  .gs__num {
    flex: none;
    padding-top: 1px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--color-amber);
  }

  /* ── Rail controls ─────────────────────────────────────────── */
  .gs__controls {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 24px;
  }
  .gs__track {
    flex: 1;
    max-width: 300px;
    height: 2px;
    background-color: var(--color-n200);
    border-radius: 2px;
    overflow: hidden;
  }
  .gs__thumb {
    height: 100%;
    background-color: var(--color-forest-green);
    border-radius: 2px;
  }
  .gs__arrows { display: flex; gap: 8px; margin-left: auto; }
  .gs__arrow {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 1px solid var(--color-n200);
    border-radius: 50%;
    background: none;
    color: var(--color-n700);
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
  }
  .gs__arrow:hover:not(:disabled) {
    border-color: var(--color-forest-green);
    color: var(--color-forest-green);
  }
  .gs__arrow:disabled { opacity: 0.3; cursor: default; }
  .gs__arrow:focus-visible {
    outline: 2px solid var(--color-forest-green);
    outline-offset: 2px;
  }

  /* ── The promise ───────────────────────────────────────────── */
  /* Bylines belong at the foot of the quote, not floating at the top of an
     empty column — align-items:end tucks it against the last line. */
  .gs__foot {
    align-items: end;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--color-n200);
  }
  .gs__quote { margin: 0; max-width: 620px; }
  .gs__quoteText {
    margin: 0;
    font-family: var(--font-hero);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(18px, 1.6vw, 22px);
    line-height: 1.55;
    color: var(--color-n800);
  }
  .gs__by {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding-top: 6px;
    font-family: var(--font-body);
    font-size: var(--text-tiny);
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-n500);
  }
  .gs__by::before {
    content: '';
    width: 24px;
    height: 1px;
    background-color: var(--color-n300);
  }

  /* Reveal on entry. Deliberately no hidden resting state — the animation
     only exists once the section is marked in-view, so a browser without
     IntersectionObserver shows the content rather than nothing. */
  @keyframes gsIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: none; }
  }
  .gs--in .gs__head { animation: gsIn 0.55s cubic-bezier(0.22,0.61,0.36,1) backwards; }
  .gs--in .gs__tile { animation: gsIn 0.55s cubic-bezier(0.22,0.61,0.36,1) backwards; }
  .gs--in .gs__foot { animation: gsIn 0.55s cubic-bezier(0.22,0.61,0.36,1) 240ms backwards; }

  /* Laptops and small windows: the spine holds, the gutter narrows — a 56px
     gutter eats the right-hand column long before the layout needs to stack. */
  @media (max-width: 1100px) {
    .gs { padding: 80px 32px; }
    .gs__head,
    .gs__foot { grid-template-columns: 1.35fr 1fr; gap: 36px; }
    .gs__head { margin-bottom: 36px; }
    .gs__tile { flex-basis: 320px; }
  }

  @media (max-width: 900px) {
    .gs { padding: 64px 20px; }
    .gs__head,
    .gs__foot { grid-template-columns: 1fr; gap: 20px; }
    .gs__head { align-items: start; margin-bottom: 28px; }
    /* Tiles stop short of the edge so the next one always peeks — the only
       affordance a phone needs, and the arrows are hidden here anyway. */
    .gs__tile { flex-basis: 72vw; }
    .gs__track { max-width: none; }
    .gs__controls { margin-top: 18px; }
    .gs__foot { margin-top: 32px; padding-top: 24px; }
  }

  @media (hover: none) {
    .gs__arrows { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .gs--in .gs__head,
    .gs--in .gs__tile,
    .gs--in .gs__foot { animation: none; }
    .gs__shot, .gs__caption { transition: none; }
    .gs__rail { scroll-behavior: auto; }
  }
`

function GuideSection() {
  // Latched, like the reviews reveal: the entrance plays once and stays put.
  const [sectionRef, inView] = useInView()
  useEffect(() => {
    if (inView) sectionRef.current?.classList.add('gs--in')
  }, [inView, sectionRef])

  const railRef = useRef(null)
  const thumbRef = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  // Progress line and arrow states are written straight to the nodes: they
  // change on every scroll frame and nothing else in the tree depends on them.
  const measure = () => {
    const rail = railRef.current
    const thumb = thumbRef.current
    if (!rail || !thumb) return
    const track = rail.scrollWidth - rail.clientWidth
    const width = track > 0 ? rail.clientWidth / rail.scrollWidth : 1
    const offset = track > 0 ? (rail.scrollLeft / track) * (1 - width) : 0
    thumb.style.width = `${width * 100}%`
    thumb.style.transform = `translateX(${(offset / width) * 100}%)`
    if (prevRef.current) prevRef.current.disabled = rail.scrollLeft <= 1
    if (nextRef.current) nextRef.current.disabled = rail.scrollLeft >= track - 1
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // One tile per press, whatever a tile currently measures.
  const nudge = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const tile = rail.querySelector('.gs__tile')
    const stride = tile ? tile.getBoundingClientRect().width + RAIL_GAP : rail.clientWidth
    rail.scrollBy({ left: direction * stride, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="gs" aria-labelledby="belief-heading">
      <style>{css}</style>

      <div className="gs__inner">

        {/* ── HEADER — statement left, context right ───────────── */}
        <div className="gs__head">
          <div>
            <span className="gs__eyebrow">Our belief</span>
            <h2 className="gs__h2" id="belief-heading">
              Deeply local.<br />
              Deeply committed.
            </h2>
          </div>

          <p className="gs__lede">
            Sarajevo isn't just where I work — it's everything I have.
            Tallest Tourguide &amp; Friends was born from one belief: Bosnia deserves
            to be seen through the eyes of someone who lives this story every day,
            not through a tour operator's lens.
          </p>
        </div>

        {/* ── THE FIVE ─────────────────────────────────────────
            A focusable scroll container: keyboard users can pan it
            with the arrow keys, everyone else swipes or uses the
            buttons below. */}
        <div
          className="gs__rail"
          ref={railRef}
          onScroll={measure}
          tabIndex={0}
          role="group"
          aria-label="Photographs from our tours"
        >
          {photos.map((photo, index) => (
            <figure
              key={photo.src}
              className="gs__tile"
              style={{ animationDelay: `${60 + index * 70}ms` }}
            >
              <div className="gs__frame">
                <Img
                  src={photo.src}
                  alt={photo.caption}
                  sizes="(min-width: 901px) 380px, 72vw"
                  className="gs__shot"
                />
              </div>
              <figcaption className="gs__caption">
                <span className="gs__num">{String(index + 1).padStart(2, '0')}</span>
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="gs__controls">
          <div className="gs__track" aria-hidden>
            <div className="gs__thumb" ref={thumbRef} />
          </div>
          <div className="gs__arrows">
            <button
              type="button"
              className="gs__arrow"
              ref={prevRef}
              onClick={() => nudge(-1)}
              aria-label="Previous photos"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              className="gs__arrow"
              ref={nextRef}
              onClick={() => nudge(1)}
              aria-label="Next photos"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* ── THE PROMISE ──────────────────────────────────────
            Open quote, no box — the voice of the person who wrote
            it, closed with a hairline and a name rather than a
            filled callout panel. */}
        <div className="gs__foot">
          <blockquote className="gs__quote">
            <p className="gs__quoteText">
              “Every person you meet through us — your guide, your driver,
              the person cooking your meal — is someone I deeply trust.
              Bosnia deserves to be known by people who actually love it.”
            </p>
          </blockquote>
          <p className="gs__by">Almedin, Tallest Tourguide</p>
        </div>

      </div>
    </section>
  )
}

export default GuideSection
