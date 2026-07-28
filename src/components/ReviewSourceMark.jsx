// Small platform marks for review attribution — Google's four-colour "G" as
// inline SVG, and Tripadvisor's owl as the official raster mark (64px, trimmed
// and circle-masked, small enough that Vite inlines it). Both are used only to
// attribute a review to where it was left, which is what Google's Places terms
// require, so neither is recoloured or restyled.

import tripadvisorOwl from '../assets/tripadvisor-owl.png'

export function GoogleMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.4h12.1c-.2 1.9-1.6 4.8-4.5 6.8l6.9 5.4c4.1-3.8 6.6-9.4 6.6-15.5z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.8 1.3-4.3 2.2-7.6 2.2-5.8 0-10.8-3.8-12.5-9.1l-7.2 5.6C7.9 41.1 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.8-2.8-.8-4.4s.3-3 .7-4.4l-7.1-5.6C2.8 16.9 2 20.4 2 24s.8 7.1 2.3 10l7.2-5.6z" />
      <path fill="#EA4335" d="M24 9.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.4 29.9 1 24 1 15.4 1 7.9 5.9 4.3 13l7.1 5.6C13.2 13.3 18.2 9.5 24 9.5z" />
    </svg>
  )
}

export function TripadvisorMark({ size = 16 }) {
  return (
    <img
      src={tripadvisorOwl}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block', width: size, height: size }}
      aria-hidden
    />
  )
}

// Renders whichever mark a review card needs, by source key. Reviews sent to
// us directly have no platform behind them, so they get no mark.
export default function ReviewSourceMark({ source, size = 16 }) {
  if (source === 'google') return <GoogleMark size={size} />
  if (source === 'tripadvisor') return <TripadvisorMark size={size} />
  return null
}
