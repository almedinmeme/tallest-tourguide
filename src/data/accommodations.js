// Single source of truth for accommodation data is
// src/data/accommodations.json, edited via the local /admin panel.
// Image fields are URL strings served from public/uploads/.

import accommodations from './accommodations.json'

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

export const sortedAccommodations = [...accommodations].sort(byOrder)

export function getAccommodation(slug) {
  return accommodations.find((a) => a.slug === slug) || null
}

export { accommodations }
export default accommodations
