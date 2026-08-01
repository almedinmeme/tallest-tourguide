// CarouselNav — the paging control under the tour, journey and journal
// carousels. One implementation, three call sites; it used to be three
// near-identical copies of the same inline styles.
//
// It sits BELOW the carousel at every width, and that is the whole point.
// The old arrows were absolutely positioned against a full-width wrapper
// while the cards themselves were capped at 1184px and centred, so the two
// never lined up: on a wide screen the arrows drifted hundreds of pixels out
// into the margins, and on a narrow one — where the cards fill the width —
// they landed on top of the first and last card. Anchoring them to the flow
// of the page instead of to a box they don't share makes both failures
// impossible rather than tuned away.
//
// Being below also means one control for mouse, touch and keyboard, with a
// 48px target and a real focus ring, instead of a desktop-only overlay.

import { ChevronLeft, ChevronRight } from 'lucide-react'

const css = `
  .cnav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 32px;
  }
  .cnav__btn {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1.5px solid var(--color-n300);
    background-color: var(--color-n000);
    color: var(--color-forest-green);
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(26,26,46,0.05);
    transition: background-color var(--t-fast), border-color var(--t-fast),
      color var(--t-fast), box-shadow var(--t-base), transform var(--t-fast);
  }
  .cnav__btn:not(:disabled):hover {
    background-color: var(--color-forest-green);
    border-color: var(--color-forest-green);
    color: var(--color-n000);
    box-shadow: 0 6px 18px rgba(35,111,82,0.28);
    transform: translateY(-1px);
  }
  .cnav__btn:not(:disabled):active { transform: translateY(0) scale(0.96); }
  .cnav__btn:disabled {
    opacity: 0.35;
    cursor: default;
    box-shadow: none;
  }
  .cnav__btn:focus-visible {
    outline: 2px solid var(--color-amber);
    outline-offset: 3px;
  }

  /* Past a handful of pages a dot each stops being a map and starts being a
     rash — on a phone the tour carousel is one card per page, so fifteen dots
     ran off both edges and pushed the arrows off screen. Over the threshold
     the dots become a counter, which is the same information in a fixed width. */
  .cnav__count {
    min-width: 66px;
    text-align: center;
    font-family: var(--font-body);
    font-size: var(--text-small);
    font-weight: 600;
    color: var(--color-n500);
    font-variant-numeric: tabular-nums;
  }
  .cnav__count b { color: var(--color-n900); font-weight: 700; }

  .cnav__dots { display: flex; align-items: center; gap: 7px; }
  /* The hit area is a 44px-tall transparent button; only the pill inside it
     is painted, so the dots stay small without being fiddly to tap. */
  .cnav__dot {
    display: grid;
    place-items: center;
    height: 44px;
    padding: 0 3px;
    border: none;
    background: none;
    cursor: pointer;
  }
  .cnav__dot span {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: var(--color-n300);
    transition: width var(--t-base), background-color var(--t-base);
  }
  .cnav__dot:hover span { background-color: var(--color-n400); }
  .cnav__dot[aria-current='true'] span {
    width: 26px;
    background-color: var(--color-forest-green);
  }
  .cnav__dot:focus-visible {
    outline: 2px solid var(--color-amber);
    outline-offset: 2px;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .cnav { gap: 14px; margin-top: 24px; }
    .cnav__btn { width: 44px; height: 44px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cnav__btn, .cnav__dot span { transition: none; }
    .cnav__btn:not(:disabled):hover { transform: none; }
  }
`

// Above this many pages, dots stop fitting and stop being useful.
const MAX_DOTS = 7

export default function CarouselNav({ page, total, onChange, label = 'items' }) {
  if (!total || total < 2) return null

  return (
    <div className="cnav" role="group" aria-label={`${label} pagination`}>
      <style>{css}</style>

      <button
        type="button"
        className="cnav__btn"
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        aria-label={`Previous ${label}`}
      >
        <ChevronLeft size={22} aria-hidden />
      </button>

      {total > MAX_DOTS ? (
        <span className="cnav__count" aria-live="polite">
          <b>{page + 1}</b> / {total}
        </span>
      ) : (
        <div className="cnav__dots">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              className="cnav__dot"
              onClick={() => onChange(i)}
              aria-current={page === i}
              aria-label={`Page ${i + 1} of ${total}`}
            >
              <span />
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="cnav__btn"
        onClick={() => onChange(Math.min(total - 1, page + 1))}
        disabled={page === total - 1}
        aria-label={`Next ${label}`}
      >
        <ChevronRight size={22} aria-hidden />
      </button>
    </div>
  )
}
